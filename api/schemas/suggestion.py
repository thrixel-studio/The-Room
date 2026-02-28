from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class SuggestionResponse(BaseModel):
    """Individual suggestion for deeper exploration"""
    id: UUID
    source_chat_id: UUID
    title: Optional[str] = None
    suggestion_text: str
    framework_key: str
    context_brief: Optional[str] = None
    is_dismissed: bool
    acted_on_chat_id: Optional[UUID] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SuggestionListResponse(BaseModel):
    """List of active suggestions"""
    suggestions: List[SuggestionResponse]


class CreateChatFromSuggestionRequest(BaseModel):
    """Request to create a new chat session from a suggestion"""
    suggestion_id: UUID


class CreateChatFromSuggestionResponse(BaseModel):
    """Response after creating a chat from a suggestion"""
    session_id: UUID
    framework: str
    started_at: datetime
