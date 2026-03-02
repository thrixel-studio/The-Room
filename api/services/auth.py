from datetime import datetime, timedelta
from typing import Optional, Tuple
from jose import JWTError, jwt
import bcrypt as _bcrypt
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
import hashlib
import httpx
import logging
import uuid as uuid_lib

from models.user import User, UserCredential, UserOAuthAccount
from models.framework import Framework
from config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

# In-memory refresh token storage (temporary solution)
# In production, this should be stored in Redis or a database table
_refresh_tokens = {}


class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return _bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

    @staticmethod
    def get_password_hash(password: str) -> str:
        return _bcrypt.hashpw(password.encode("utf-8"), _bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    @staticmethod
    def create_refresh_token(
        db: Session,
        user_id: UUID,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        family_id: Optional[UUID] = None
    ) -> str:
        """Create a new refresh token (stored in memory for now)"""
        import secrets
        
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        if family_id is None:
            family_id = uuid_lib.uuid4()
        
        # Store in memory
        _refresh_tokens[token_hash] = {
            'user_id': user_id,
            'expires_at': expires_at,
            'family_id': family_id,
            'revoked_at': None,
            'ip_address': ip_address,
            'user_agent': user_agent
        }
        
        logger.debug(f"Created refresh token for user {user_id}, family {family_id}")
        
        return token

    @staticmethod
    def verify_token(token: str) -> Optional[dict]:
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload
        except JWTError:
            return None

    @staticmethod
    def register_user(
        db: Session, 
        email: str, 
        password: str, 
        first_name: Optional[str] = None,
        last_name: Optional[str] = None
    ) -> User:
        """Register a new user with password authentication"""
        # Get default framework
        default_framework = db.query(Framework).filter(
            Framework.key == "MENTAL_WELLNESS"
        ).first()
        
        # Create user
        user = User(
            email=email.lower(),
            first_name=first_name,
            last_name=last_name
        )
        
        if default_framework:
            user.current_framework_id = default_framework.id
        
        db.add(user)
        db.flush()
        
        # Create credentials
        hashed_password = AuthService.get_password_hash(password)
        credentials = UserCredential(
            user_id=user.id,
            password_hash=hashed_password
        )
        db.add(credentials)
        
        db.commit()
        db.refresh(user)
        
        logger.info(f"Created new user: {email} (ID: {user.id})")
        
        return user

    @staticmethod
    def authenticate_user(
        db: Session,
        email: str,
        password: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None
    ) -> Optional[User]:
        """Authenticate user with password"""
        from services.security import SecurityService
        
        email = email.lower()
        user = db.query(User).filter(
            User.email == email,
            User.deleted_at.is_(None)
        ).first()
        
        # Record failed attempt if user doesn't exist
        if not user:
            if ip_address:
                SecurityService.record_login_attempt(db, email, ip_address, False, user_agent)
            return None
        
        # Check if account is locked
        is_locked, unlock_time = SecurityService.check_account_lockout(db, user.id)
        if is_locked:
            logger.warning(f"Login attempt for locked account: {email}")
            return None
        
        # Get credentials
        credentials = db.query(UserCredential).filter(
            UserCredential.user_id == user.id
        ).first()
        
        if not credentials:
            # OAuth-only user trying to login with password
            logger.warning(f"Password login attempt for OAuth-only account: {email}")
            if ip_address:
                SecurityService.record_login_attempt(db, email, ip_address, False, user_agent)
            return None
        
        # Verify password
        if not AuthService.verify_password(password, credentials.password_hash):
            logger.warning(f"Invalid password for account: {email}")
            if ip_address:
                SecurityService.record_login_attempt(db, email, ip_address, False, user_agent)
            
            # Check for account lockout
            if SecurityService.should_lockout_account(db, email):
                SecurityService.lockout_account(
                    db,
                    user.id,
                    f"Too many failed login attempts from {ip_address or 'unknown IP'}"
                )
                logger.warning(f"Account locked due to failed attempts: {email}")
            
            return None
        
        # Success
        if ip_address:
            SecurityService.record_login_attempt(db, email, ip_address, True, user_agent)
        
        logger.info(f"Successful authentication for user: {email}")
        return user

    @staticmethod
    def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
        return db.query(User).filter(
            User.id == user_id,
            User.deleted_at.is_(None)
        ).first()

    @staticmethod
    def revoke_refresh_token(db: Session, token: str) -> bool:
        """Revoke a single refresh token"""
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        if token_hash in _refresh_tokens:
            _refresh_tokens[token_hash]['revoked_at'] = datetime.utcnow()
            logger.info(f"Revoked refresh token")
            return True
        return False
    
    @staticmethod
    def revoke_all_user_tokens(db: Session, user_id: UUID) -> int:
        """Revoke all refresh tokens for a user"""
        count = 0
        now = datetime.utcnow()
        
        for token_hash, data in _refresh_tokens.items():
            if data['user_id'] == user_id and data['revoked_at'] is None:
                data['revoked_at'] = now
                count += 1
        
        logger.info(f"Revoked all refresh tokens for user {user_id}: {count} tokens")
        return count

    @staticmethod
    def verify_refresh_token(db: Session, token: str) -> Optional[Tuple[UUID, UUID, UUID]]:
        """Verify refresh token and return (user_id, token_id, family_id) if valid"""
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        if token_hash not in _refresh_tokens:
            logger.warning("Refresh token not found")
            return None
        
        data = _refresh_tokens[token_hash]
        
        # Check if revoked
        if data['revoked_at'] is not None:
            logger.warning(f"SECURITY ALERT: Attempted reuse of revoked refresh token!")
            return None
        
        # Check if expired
        if data['expires_at'] <= datetime.utcnow():
            logger.warning(f"Expired refresh token used")
            return None
        
        # Generate a mock token_id
        token_id = uuid_lib.UUID(token_hash[:32].ljust(32, '0'))
        
        return data['user_id'], token_id, data['family_id']

    @staticmethod
    async def exchange_google_code(code: str, redirect_uri: str) -> Optional[dict]:
        """Exchange Google authorization code for tokens and return user info"""
        try:
            async with httpx.AsyncClient() as client:
                # Exchange code for tokens
                token_response = await client.post(
                    "https://oauth2.googleapis.com/token",
                    data={
                        "code": code,
                        "client_id": settings.GOOGLE_CLIENT_ID,
                        "client_secret": settings.GOOGLE_CLIENT_SECRET,
                        "redirect_uri": redirect_uri,
                        "grant_type": "authorization_code"
                    }
                )
                
                if token_response.status_code != 200:
                    logger.error(f"Token exchange failed: {token_response.text}")
                    return None
                
                tokens = token_response.json()
                access_token = tokens.get("access_token")
                
                if not access_token:
                    return None
                
                # Get user info using access token
                user_response = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                
                if user_response.status_code == 200:
                    return user_response.json()
                return None
                
        except Exception as e:
            logger.error(f"Error exchanging Google code: {e}")
            return None

    @staticmethod
    async def verify_google_token(token: str) -> Optional[dict]:
        """Verify Google OAuth token and return user info"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    headers={"Authorization": f"Bearer {token}"}
                )
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            logger.error(f"Error verifying Google token: {e}")
            return None

    @staticmethod
    def get_or_create_google_user(db: Session, google_user_info: dict) -> User:
        """Get existing user or create new one from Google OAuth data"""
        email = google_user_info.get("email")
        google_sub = google_user_info.get("sub")
        avatar_url = google_user_info.get("picture")  # Google profile picture
        
        # Check if OAuth account exists
        oauth_account = db.query(UserOAuthAccount).filter(
            UserOAuthAccount.provider == "google",
            UserOAuthAccount.provider_subject == google_sub
        ).first()
        
        if oauth_account:
            # OAuth account exists, get user
            user = db.query(User).filter(User.id == oauth_account.user_id).first()
            
            if user:
                # Update OAuth account and user info if changed
                needs_commit = False
                
                if oauth_account.provider_email != email:
                    oauth_account.provider_email = email
                    oauth_account.updated_at = datetime.utcnow()
                    needs_commit = True
                
                # Always update avatar_url on login to get latest profile picture
                if avatar_url and user.avatar_url != avatar_url:
                    user.avatar_url = avatar_url
                    user.updated_at = datetime.utcnow()
                    needs_commit = True
                    logger.info(f"Updated avatar URL for user {email}")
                
                if needs_commit:
                    db.commit()
                    db.refresh(user)
                
                logger.debug(f"Found existing Google OAuth user: {email}")
                return user
        
        # Check if user exists by email
        user = db.query(User).filter(User.email == email.lower()).first()
        
        if user:
            # User exists, link OAuth account and update avatar
            oauth_account = UserOAuthAccount(
                user_id=user.id,
                provider="google",
                provider_subject=google_sub,
                provider_email=email
            )
            db.add(oauth_account)
            
            # Update avatar if provided
            if avatar_url:
                user.avatar_url = avatar_url
                user.updated_at = datetime.utcnow()
            
            db.commit()
            db.refresh(user)
            
            logger.info(f"Linked Google OAuth to existing user: {email}")
            return user
        
        # Create new user
        given_name = google_user_info.get("given_name")
        family_name = google_user_info.get("family_name")
        
        # Get default framework
        default_framework = db.query(Framework).filter(
            Framework.key == "MENTAL_WELLNESS"
        ).first()
        
        user = User(
            email=email.lower(),
            first_name=given_name,
            last_name=family_name,
            avatar_url=avatar_url,
            email_verified_at=datetime.utcnow()  # Google verifies emails
        )
        
        if default_framework:
            user.current_framework_id = default_framework.id
        
        db.add(user)
        db.flush()
        
        # Create OAuth account link
        oauth_account = UserOAuthAccount(
            user_id=user.id,
            provider="google",
            provider_subject=google_sub,
            provider_email=email
        )
        db.add(oauth_account)
        
        db.commit()
        db.refresh(user)
        
        logger.info(f"Created new Google OAuth user: {email} (ID: {user.id})")
        
        return user
