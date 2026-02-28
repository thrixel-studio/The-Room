"""
Security-related models for rate limiting and account protection
Note: Refresh tokens handled separately in auth logic
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database import Base


class LoginAttempt(Base):
    """Track login attempts for rate limiting"""
    __tablename__ = "login_attempts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, index=True)
    ip_address = Column(String, nullable=False)
    success = Column(Integer, nullable=False)  # 0 for failure, 1 for success
    attempted_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    user_agent = Column(String, nullable=True)


class AccountLockout(Base):
    """Track locked accounts"""
    __tablename__ = "account_lockouts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    locked_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    unlock_at = Column(DateTime, nullable=False, index=True)
    reason = Column(String, nullable=False)
    unlocked_at = Column(DateTime, nullable=True)


class PasswordResetToken(Base):
    """Secure tokens for password reset functionality"""
    __tablename__ = "password_reset_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String, nullable=False, unique=True, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    ip_address = Column(String, nullable=True)


class EmailVerificationToken(Base):
    """Tokens for email verification during registration"""
    __tablename__ = "email_verification_tokens"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String, nullable=False, unique=True, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

