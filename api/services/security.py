"""
Security service for account protection, lockout management, and security events.
"""
from datetime import datetime, timedelta
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from uuid import UUID
import hashlib
import secrets
import logging

from models.security import LoginAttempt, AccountLockout, PasswordResetToken, EmailVerificationToken
from models.user import User

logger = logging.getLogger(__name__)


class SecurityService:
    """Service for handling security-related operations."""
    
    # Configuration
    MAX_LOGIN_ATTEMPTS = 5
    LOCKOUT_DURATION_MINUTES = 30
    PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1
    EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24
    
    @staticmethod
    def record_login_attempt(
        db: Session,
        email: str,
        ip_address: str,
        success: bool,
        user_agent: Optional[str] = None
    ) -> None:
        """Record a login attempt for tracking and security monitoring."""
        attempt = LoginAttempt(
            email=email.lower(),
            ip_address=ip_address,
            success=1 if success else 0,
            user_agent=user_agent
        )
        db.add(attempt)
        db.commit()
        
        if success:
            logger.info(f"Successful login for {email} from {ip_address}")
        else:
            logger.warning(f"Failed login attempt for {email} from {ip_address}")
    
    @staticmethod
    def check_account_lockout(db: Session, user_id: UUID) -> Tuple[bool, Optional[datetime]]:
        """
        Check if account is currently locked out.
        Returns (is_locked, unlock_time)
        """
        now = datetime.utcnow()
        
        # Find active lockout
        lockout = db.query(AccountLockout).filter(
            AccountLockout.user_id == user_id,
            AccountLockout.unlock_at > now,
            AccountLockout.unlocked_at.is_(None)
        ).first()
        
        if lockout:
            return True, lockout.unlock_at
        
        return False, None
    
    @staticmethod
    def should_lockout_account(db: Session, email: str) -> bool:
        """
        Check if account should be locked based on recent failed attempts.
        Returns True if account should be locked.
        """
        # Look at failed attempts in the last 15 minutes
        cutoff_time = datetime.utcnow() - timedelta(minutes=15)
        
        failed_attempts = db.query(LoginAttempt).filter(
            LoginAttempt.email == email.lower(),
            LoginAttempt.success == 0,
            LoginAttempt.attempted_at > cutoff_time
        ).count()
        
        return failed_attempts >= SecurityService.MAX_LOGIN_ATTEMPTS
    
    @staticmethod
    def lockout_account(db: Session, user_id: UUID, reason: str) -> AccountLockout:
        """Lock an account for a specified duration."""
        now = datetime.utcnow()
        unlock_at = now + timedelta(minutes=SecurityService.LOCKOUT_DURATION_MINUTES)
        
        lockout = AccountLockout(
            user_id=user_id,
            locked_at=now,
            unlock_at=unlock_at,
            reason=reason
        )
        db.add(lockout)
        db.commit()
        
        logger.warning(
            f"Account {user_id} locked until {unlock_at}. Reason: {reason}"
        )
        
        return lockout
    
    @staticmethod
    def unlock_account(db: Session, user_id: UUID) -> bool:
        """Manually unlock an account (admin action)."""
        lockout = db.query(AccountLockout).filter(
            AccountLockout.user_id == user_id,
            AccountLockout.unlocked_at.is_(None)
        ).first()
        
        if lockout:
            lockout.unlocked_at = datetime.utcnow()
            db.commit()
            logger.info(f"Account {user_id} manually unlocked")
            return True
        
        return False
    
    @staticmethod
    def create_password_reset_token(
        db: Session,
        user_id: UUID,
        ip_address: Optional[str] = None
    ) -> str:
        """Create a secure token for password reset."""
        # Generate a secure random token
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        expires_at = datetime.utcnow() + timedelta(
            hours=SecurityService.PASSWORD_RESET_TOKEN_EXPIRY_HOURS
        )
        
        # Invalidate any existing unused tokens for this user
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user_id,
            PasswordResetToken.used_at.is_(None)
        ).update({"used_at": datetime.utcnow()})
        
        # Create new token
        reset_token = PasswordResetToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
            ip_address=ip_address
        )
        db.add(reset_token)
        db.commit()
        
        logger.info(f"Password reset token created for user {user_id}")
        
        return token
    
    @staticmethod
    def verify_password_reset_token(db: Session, token: str) -> Optional[UUID]:
        """
        Verify a password reset token and return the user_id if valid.
        Returns None if token is invalid or expired.
        """
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        reset_token = db.query(PasswordResetToken).filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None),
            PasswordResetToken.expires_at > datetime.utcnow()
        ).first()
        
        if reset_token:
            return reset_token.user_id
        
        return None
    
    @staticmethod
    def use_password_reset_token(db: Session, token: str) -> bool:
        """Mark a password reset token as used."""
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        reset_token = db.query(PasswordResetToken).filter(
            PasswordResetToken.token_hash == token_hash,
            PasswordResetToken.used_at.is_(None)
        ).first()
        
        if reset_token:
            reset_token.used_at = datetime.utcnow()
            db.commit()
            logger.info(f"Password reset token used for user {reset_token.user_id}")
            return True
        
        return False
    
    @staticmethod
    def create_email_verification_token(db: Session, user_id: UUID) -> str:
        """Create a secure token for email verification."""
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        expires_at = datetime.utcnow() + timedelta(
            hours=SecurityService.EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS
        )
        
        verification_token = EmailVerificationToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at
        )
        db.add(verification_token)
        db.commit()
        
        logger.info(f"Email verification token created for user {user_id}")
        
        return token
    
    @staticmethod
    def verify_email_token(db: Session, token: str) -> Optional[UUID]:
        """
        Verify an email verification token and mark it as verified.
        Returns the user_id if valid, None otherwise.
        """
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        verification_token = db.query(EmailVerificationToken).filter(
            EmailVerificationToken.token_hash == token_hash,
            EmailVerificationToken.verified_at.is_(None),
            EmailVerificationToken.expires_at > datetime.utcnow()
        ).first()
        
        if verification_token:
            verification_token.verified_at = datetime.utcnow()
            
            # Mark user's email as verified
            user = db.query(User).filter(User.id == verification_token.user_id).first()
            if user:
                user.email_verified_at = datetime.utcnow()
            
            db.commit()
            logger.info(f"Email verified for user {verification_token.user_id}")
            
            return verification_token.user_id
        
        return None
    
    @staticmethod
    def cleanup_expired_tokens(db: Session) -> int:
        """
        Cleanup expired tokens and old login attempts.
        Returns count of records cleaned up.
        """
        now = datetime.utcnow()
        count = 0
        
        # Delete old login attempts (older than 30 days)
        old_attempts = db.query(LoginAttempt).filter(
            LoginAttempt.attempted_at < now - timedelta(days=30)
        ).delete()
        count += old_attempts
        
        # Delete expired password reset tokens
        expired_reset = db.query(PasswordResetToken).filter(
            PasswordResetToken.expires_at < now
        ).delete()
        count += expired_reset
        
        # Delete expired email verification tokens
        expired_verification = db.query(EmailVerificationToken).filter(
            EmailVerificationToken.expires_at < now
        ).delete()
        count += expired_verification
        
        # Delete old lockouts (older than 90 days)
        old_lockouts = db.query(AccountLockout).filter(
            AccountLockout.locked_at < now - timedelta(days=90)
        ).delete()
        count += old_lockouts
        
        db.commit()
        
        if count > 0:
            logger.info(f"Cleaned up {count} expired security records")
        
        return count
