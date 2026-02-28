from pydantic import BaseModel
from typing import Optional


class UserProfileResponse(BaseModel):
    bio: Optional[str]
    age: Optional[int]
    avatar_url: Optional[str]

    class Config:
        from_attributes = True
