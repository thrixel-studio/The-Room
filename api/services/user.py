from typing import Optional
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from datetime import datetime

from models.user import User
from models.framework import Framework as FrameworkModel


class UserService:
    @staticmethod
    def get_user(db: Session, user_id: UUID) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(
            User.id == user_id,
            User.deleted_at.is_(None)
        ).first()
    
    @staticmethod
    def get_user_framework(db: Session, user_id: UUID) -> str:
        """Get the user's selected framework key"""
        user = db.query(User).filter(User.id == user_id).first()
        
        if user and user.current_framework_id:
            framework = db.query(FrameworkModel).filter(
                FrameworkModel.id == user.current_framework_id
            ).first()
            
            if framework:
                return framework.key.lower()
        
        # Default to psychologist (mental_wellness)
        return "mental_wellness"

    @staticmethod
    def update_user(db: Session, user_id: UUID, **kwargs) -> Optional[User]:
        """Update user fields"""
        user = db.query(User).filter(
            User.id == user_id,
            User.deleted_at.is_(None)
        ).first()
        
        if not user:
            return None
        
        # Update allowed user fields
        allowed_fields = {
            "first_name", "last_name", "avatar_url", "bio", 
            "theme", "timezone", "current_framework_id"
        }
        
        for field, value in kwargs.items():
            if field in allowed_fields and hasattr(user, field):
                setattr(user, field, value)
        
        user.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_profile(db: Session, user_id: UUID) -> Optional[dict]:
        """Get user profile (returns user data formatted as profile)"""
        user = UserService.get_user(db, user_id)
        
        if not user:
            return None
        
        return {
            "user_id": user.id,
            "bio": user.bio,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "theme": user.theme.value if hasattr(user.theme, 'value') else user.theme,
            "timezone": user.timezone
        }
