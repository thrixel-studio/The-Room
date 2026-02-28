from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import urllib.parse
import logging

from database import get_db
from schemas.auth import (
    UserRegister, UserLogin, Token, TokenRefresh, UserResponse,
    GoogleAuthRequest, PasswordResetRequest, PasswordReset,
    EmailVerificationRequest
)
from services.auth import AuthService
from services.security import SecurityService
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user with password authentication"""
    from models.user import User
    from models.framework import Framework as FrameworkModel
    
    existing_user = db.query(User).filter(
        User.email == user_data.email.lower()
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    
    user = AuthService.register_user(
        db=db,
        email=user_data.email,
        password=user_data.password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    
    # Compute display_name from first_name and last_name
    display_name = None
    if user.first_name and user.last_name:
        display_name = f"{user.first_name} {user.last_name}"
    elif user.first_name:
        display_name = user.first_name
    elif user.last_name:
        display_name = user.last_name
    
    # Get framework key
    selected_framework = None
    if user.current_framework_id:
        framework = db.query(FrameworkModel).filter(
            FrameworkModel.id == user.current_framework_id
        ).first()
        if framework:
            selected_framework = framework.key.lower()
    
    # Get avatar_url (will be None for password-based registration)
    avatar_url = user.avatar_url
    
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        display_name=display_name,
        avatar_url=avatar_url,
        bio=user.bio,
        theme=user.theme.value if hasattr(user.theme, 'value') else user.theme,
        timezone=user.timezone,
        is_active=True,
        current_framework_id=user.current_framework_id,
        selected_framework=selected_framework,
        created_at=user.created_at,
        email_verified_at=user.email_verified_at
    )


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, request: Request, db: Session = Depends(get_db)):
    """Authenticate user and return access and refresh tokens"""
    from models.user import User
    
    # Get client IP and user agent
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    
    # Check if user exists
    email = credentials.email.lower()
    existing_user = db.query(User).filter(User.email == email).first()
    
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No account found with this email address"
        )
    
    user = AuthService.authenticate_user(
        db,
        credentials.email,
        credentials.password,
        ip_address=client_ip,
        user_agent=user_agent
    )
    
    if not user:
        # Check if account is locked
        is_locked, unlock_time = SecurityService.check_account_lockout(db, existing_user.id)
        
        if is_locked:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is temporarily locked due to multiple failed login attempts. Please try again later."
            )
        
        # Wrong password
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please try again."
        )
    
    access_token = AuthService.create_access_token(data={"sub": str(user.id)})
    refresh_token = AuthService.create_refresh_token(
        db, user.id, client_ip, user_agent
    )
    
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh(token_data: TokenRefresh, request: Request, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    result = AuthService.verify_refresh_token(db, token_data.refresh_token)
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    user_id, old_token_id, family_id = result
    
    # Get client info
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    
    # Create new tokens with same family
    access_token = AuthService.create_access_token(data={"sub": str(user_id)})
    refresh_token = AuthService.create_refresh_token(
        db, user_id, client_ip, user_agent, family_id
    )
    
    # Revoke old refresh token (rotation)
    AuthService.revoke_refresh_token(db, token_data.refresh_token)
    
    logger.info(f"Refreshed tokens for user {user_id}, family {family_id}")
    
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(token_data: TokenRefresh, db: Session = Depends(get_db)):
    """Logout and revoke refresh token"""
    AuthService.revoke_refresh_token(db, token_data.refresh_token)
    return None


@router.get("/google/login")
async def google_login():
    """Initiate Google OAuth flow"""
    google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    url = f"{google_auth_url}?{urllib.parse.urlencode(params)}"
    return RedirectResponse(url=url)


@router.get("/google/callback")
async def google_callback(code: str, request: Request, db: Session = Depends(get_db)):
    """Google OAuth callback endpoint"""
    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization code not provided"
        )
    
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    
    # Exchange code for tokens
    google_user_info = await AuthService.exchange_google_code(
        code=code,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )
    
    if not google_user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Failed to authenticate with Google"
        )
    
    # Get or create user
    user = AuthService.get_or_create_google_user(db, google_user_info)
    
    # Create tokens
    access_token = AuthService.create_access_token(data={"sub": str(user.id)})
    refresh_token = AuthService.create_refresh_token(
        db, user.id, client_ip, user_agent
    )
    
    # Redirect to frontend with tokens
    frontend_url = f"{settings.FRONTEND_URL}/callback?access_token={access_token}&refresh_token={refresh_token}"
    return RedirectResponse(url=frontend_url)


@router.post("/google", response_model=Token)
async def google_auth(auth_data: GoogleAuthRequest, request: Request, db: Session = Depends(get_db)):
    """Authenticate user with Google OAuth token (client-side flow)"""
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "unknown")
    
    # Verify Google token and get user info
    google_user_info = await AuthService.verify_google_token(auth_data.token)
    
    if not google_user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    # Get or create user
    user = AuthService.get_or_create_google_user(db, google_user_info)
    
    # Create tokens
    access_token = AuthService.create_access_token(data={"sub": str(user.id)})
    refresh_token = AuthService.create_refresh_token(
        db, user.id, client_ip, user_agent
    )
    
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/password-reset/request", status_code=status.HTTP_200_OK)
async def request_password_reset(
    request_data: PasswordResetRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """Request a password reset token"""
    from models.user import User
    
    client_ip = request.client.host if request.client else "unknown"
    
    user = db.query(User).filter(User.email == request_data.email.lower()).first()
    
    if user:
        # Create password reset token
        token = SecurityService.create_password_reset_token(db, user.id, client_ip)
        
        # TODO: Send email with reset link
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
        logger.info(f"Password reset requested for {user.email}. Reset link: {reset_link}")
        
        # In development, return the token
        if settings.DATABASE_RESET:
            return {"message": "Password reset link sent", "dev_token": token}
    else:
        logger.info(f"Password reset requested for non-existent email: {request_data.email}")
    
    return {"message": "If the email exists, a password reset link has been sent"}


@router.post("/password-reset/confirm", status_code=status.HTTP_200_OK)
async def reset_password(
    reset_data: PasswordReset,
    db: Session = Depends(get_db)
):
    """Reset password using a valid reset token"""
    # Verify token
    user_id = SecurityService.verify_password_reset_token(db, reset_data.token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Get user
    from models.user import User, UserCredential
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    credentials = db.query(UserCredential).filter(
        UserCredential.user_id == user_id
    ).first()
    
    if credentials:
        credentials.password_hash = AuthService.get_password_hash(reset_data.new_password)
        credentials.password_updated_at = datetime.utcnow()
    else:
        # Create credentials if they don't exist (OAuth user setting password)
        credentials = UserCredential(
            user_id=user_id,
            password_hash=AuthService.get_password_hash(reset_data.new_password)
        )
        db.add(credentials)
    
    user.updated_at = datetime.utcnow()
    
    # Mark token as used
    SecurityService.use_password_reset_token(db, reset_data.token)
    
    # Revoke all existing refresh tokens for security
    AuthService.revoke_all_user_tokens(db, user_id)
    
    db.commit()
    
    logger.info(f"Password successfully reset for user {user.email}")
    
    return {"message": "Password successfully reset. Please login with your new password."}


@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    verification_data: EmailVerificationRequest,
    db: Session = Depends(get_db)
):
    """Verify email address using verification token"""
    user_id = SecurityService.verify_email_token(db, verification_data.token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    logger.info(f"Email verified for user {user_id}")
    
    return {"message": "Email successfully verified"}


@router.post("/resend-verification", status_code=status.HTTP_200_OK)
async def resend_verification(
    request_data: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """Resend email verification link"""
    from models.user import User
    
    user = db.query(User).filter(User.email == request_data.email.lower()).first()
    
    if user and not user.email_verified_at:
        # Create new verification token
        token = SecurityService.create_email_verification_token(db, user.id)
        
        # TODO: Send email with verification link
        verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        logger.info(f"Verification email resent to {user.email}. Link: {verification_link}")
        
        if settings.DATABASE_RESET:
            return {"message": "Verification link sent", "dev_token": token}
    
    return {"message": "If the email exists and is unverified, a verification link has been sent"}
