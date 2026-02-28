import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base
import enum


class ThemeEnum(str, enum.Enum):
    LIGHT = "light"
    DARK = "dark"
    SYSTEM = "system"


class OAuthProviderEnum(str, enum.Enum):
    GOOGLE = "google"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    email_verified_at = Column(DateTime, nullable=True)
    first_name = Column(Text, nullable=True)
    last_name = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    avatar_url = Column(Text, nullable=True)  # Profile picture URL (from OAuth or uploaded)
    
    theme = Column(SQLEnum(ThemeEnum, name="theme_enum"), nullable=False, default=ThemeEnum.DARK)
    timezone = Column(Text, nullable=False, default="UTC")
    current_framework_id = Column(UUID(as_uuid=True), ForeignKey("frameworks.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
    
    # Relationships
    credentials = relationship("UserCredential", back_populates="user", uselist=False, cascade="all, delete-orphan")
    oauth_accounts = relationship("UserOAuthAccount", back_populates="user", cascade="all, delete-orphan")
    journal_chats = relationship("JournalChat", back_populates="user", cascade="all, delete-orphan")
    current_framework = relationship("Framework", foreign_keys=[current_framework_id])


class UserCredential(Base):
    """Password authentication - optional (not all users will have passwords)"""
    __tablename__ = "user_credentials"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    password_hash = Column(Text, nullable=False)
    password_updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="credentials")


class UserOAuthAccount(Base):
    """OAuth accounts (Google, etc.)"""
    __tablename__ = "user_oauth_accounts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    provider = Column(SQLEnum(OAuthProviderEnum, name="oauth_provider_enum"), nullable=False)
    provider_subject = Column(Text, nullable=False)  # Google "sub"
    provider_email = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    user = relationship("User", back_populates="oauth_accounts")
    
    __table_args__ = (
        # Unique constraint on provider + provider_subject
        # Note: SQLAlchemy will create this as a unique index
    )
