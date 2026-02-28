from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
from dependencies import get_current_user
from schemas.auth import UserResponse, UserUpdate
from schemas.user import UserProfileResponse
from services.user import UserService

router = APIRouter(prefix="/me", tags=["user"])


@router.get("", response_model=UserResponse)
async def get_me(
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    from models.framework import Framework as FrameworkModel
    
    user = UserService.get_user(db, current_user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
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
    
    # Get avatar_url
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
        is_active=True,  # You can add this field to the model if needed
        current_framework_id=user.current_framework_id,
        selected_framework=selected_framework,
        created_at=user.created_at,
        email_verified_at=user.email_verified_at
    )


@router.patch("", response_model=UserResponse)
async def update_me(
    user_data: UserUpdate,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    from models.framework import Framework as FrameworkModel

    # Convert selected_framework (string key) to current_framework_id (UUID)
    update_data = user_data.model_dump(exclude_unset=True)
    if 'selected_framework' in update_data and update_data['selected_framework']:
        framework_key = update_data.pop('selected_framework').upper()
        framework = db.query(FrameworkModel).filter(
            FrameworkModel.key == framework_key
        ).first()
        if framework:
            update_data['current_framework_id'] = framework.id

    user = UserService.update_user(
        db,
        current_user_id,
        **update_data
    )

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
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
    
    # Get avatar_url
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


@router.get("/profile", response_model=UserProfileResponse)
async def get_profile(
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile details"""
    profile = UserService.get_profile(db, current_user_id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    return profile
