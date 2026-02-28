from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from uuid import UUID
import re

from constants.frameworks import Framework, get_valid_frameworks


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    
    @validator('password')
    def validate_password_strength(cls, v):
        """
        Password must be at least 12 characters and contain:
        - At least one uppercase letter
        - At least one lowercase letter
        - At least one digit
        - At least one special character
        """
        if len(v) < 12:
            raise ValueError('Password must be at least 12 characters long')
        if len(v) > 128:
            raise ValueError('Password must not exceed 128 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]', v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @validator('first_name', 'last_name')
    def validate_names(cls, v):
        if v is not None:
            # Remove excessive whitespace
            v = ' '.join(v.split())
            # Check for dangerous characters
            if re.search(r'[<>{}]', v):
                raise ValueError('Name contains invalid characters')
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    token: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    display_name: Optional[str] = None  # Computed from first_name + last_name
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    theme: str = "dark"
    timezone: str = "UTC"
    is_active: bool = True
    current_framework_id: Optional[UUID] = None
    selected_framework: Optional[str] = None  # Framework key string
    created_at: datetime
    email_verified_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    theme: Optional[str] = None
    timezone: Optional[str] = None
    current_framework_id: Optional[UUID] = None
    selected_framework: Optional[str] = None  # Framework key string

    @validator('theme')
    def validate_theme(cls, v):
        if v is not None and v not in ['light', 'dark', 'system']:
            raise ValueError("Theme must be 'light', 'dark', or 'system'")
        return v


class PasswordResetRequest(BaseModel):
    email: EmailStr


class PasswordReset(BaseModel):
    token: str
    new_password: str = Field(min_length=12, max_length=128)
    
    @validator('new_password')
    def validate_password_strength(cls, v):
        """Same validation as registration password."""
        if len(v) < 12:
            raise ValueError('Password must be at least 12 characters long')
        if len(v) > 128:
            raise ValueError('Password must not exceed 128 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\;/`~]', v):
            raise ValueError('Password must contain at least one special character')
        return v


class EmailVerificationRequest(BaseModel):
    token: str
