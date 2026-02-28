from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime
from uuid import UUID


# Chat message schemas
class ChatMessageResponse(BaseModel):
    id: UUID
    session_id: UUID
    role: str  # 'user' or 'assistant'
    content: str
    metadata: Optional[Dict] = {}
    created_at: datetime
    completion_percentage: Optional[float] = None
    suggested_framework: Optional[str] = None

    class Config:
        from_attributes = True


class ChatMessageCreate(BaseModel):
    content: str


# Chat session schemas  
class ChatSessionResponse(BaseModel):
    id: UUID
    state: str  # Maps to JournalChat.status but exposed as 'state' for API compatibility
    framework: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    messages: List[ChatMessageResponse]

    class Config:
        from_attributes = True


class ChatSessionCreate(BaseModel):
    """Create a new chat-based writing session"""
    mode: str = "CHAT"
    framework_key: Optional[str] = None


class SwitchFrameworkRequest(BaseModel):
    """Switch the active framework on an existing session"""
    framework_key: str


class AIResponse(BaseModel):
    """Structured response from AI"""
    content: str
    reflection: Optional[str] = None
    prompt_type: str  # question, reflection, validation, summary
