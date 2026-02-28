from pydantic import BaseModel
from typing import List
from uuid import UUID


class TagCreate(BaseModel):
    name: str
    kind: str = "CUSTOM"


class TagResponse(BaseModel):
    id: UUID
    key: str
    display_name: str

    class Config:
        from_attributes = True
        
    @property
    def name(self):
        """Alias for backward compatibility"""
        return self.display_name
    
    @property
    def kind(self):
        """Always return TOPIC for compatibility"""
        return "TOPIC"


class EmotionResponse(BaseModel):
    id: UUID
    key: str
    display_name: str

    class Config:
        from_attributes = True
    
    @property
    def name(self):
        """Alias for backward compatibility"""
        return self.display_name
    
    @property
    def valence(self):
        """Placeholder for compatibility"""
        return "neutral"
    
    @property
    def group(self):
        """Placeholder for compatibility"""
        return "general"
