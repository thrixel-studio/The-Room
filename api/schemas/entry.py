from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import datetime, date
from uuid import UUID
from decimal import Decimal


# Core response models matching frontend expectations
class TagResponse(BaseModel):
    id: UUID
    name: str
    kind: str = "TOPIC"  # Default for compatibility

    class Config:
        from_attributes = True


class EmotionResponse(BaseModel):
    id: UUID
    name: str
    intensity: float  # Changed from Decimal to float for frontend compatibility
    color: Optional[str] = None

    class Config:
        from_attributes = True


class TipCardResponse(BaseModel):
    title: str
    description: str
    framework_key: str

    class Config:
        from_attributes = True


class EntrySummaryResponse(BaseModel):
    summary_bullets: List[str]
    one_line_summary: Optional[str]
    tips: List[TipCardResponse] = []
    key_insight: Optional[str] = None
    patterns: List[str] = []
    reflection_questions: List[str] = []

    class Config:
        from_attributes = True


class EntrySuggestionResponse(BaseModel):
    id: UUID
    title: Optional[str] = None
    suggestion_text: str
    framework_key: str
    context_brief: Optional[str] = None

    class Config:
        from_attributes = True


class EntryTipResponse(BaseModel):
    tip_text: str
    framework_key: str
    entry_id: UUID

    class Config:
        from_attributes = True


class EntryTipsResponse(BaseModel):
    tips: List[EntryTipResponse]


class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class RecentMessageResponse(BaseModel):
    role: str
    content: str

    class Config:
        from_attributes = True


# List view card - compact representation
class EntryCardResponse(BaseModel):
    id: UUID
    entry_date: date
    created_at: datetime
    hero_image_url: Optional[str]
    title: Optional[str] = None
    summary_bullets: List[str]
    tags: List[TagResponse]
    emotions: List[EmotionResponse]
    is_highlight: bool = False
    status: str
    framework: Optional[str] = None
    session_id: Optional[UUID] = None
    last_message: Optional[str] = None
    last_message_timestamp: Optional[datetime] = None
    completion_percentage: Optional[float] = None
    recent_messages: Optional[List[RecentMessageResponse]] = None

    class Config:
        from_attributes = True


# Detail view - full entry with messages
class EntryDetailResponse(BaseModel):
    id: UUID
    title: Optional[str]
    content_text: str
    status: str
    is_highlight: bool = False
    entry_date: date
    created_at: datetime
    updated_at: datetime
    finished_at: Optional[datetime]
    hero_image_url: Optional[str]
    source_type: str = "CHAT"
    tags: List[TagResponse]
    emotions: List[EmotionResponse]
    summary: Optional[EntrySummaryResponse]
    suggestions: List[EntrySuggestionResponse] = []
    session_id: Optional[UUID] = None
    messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True


# Request models
class EntryCreate(BaseModel):
    title: Optional[str] = None
    content_text: str
    entry_date: Optional[date] = None
    source_type: str = "FREEFORM"
    source_id: Optional[UUID] = None


class EntryUpdate(BaseModel):
    title: Optional[str] = None
    is_highlight: Optional[bool] = None
    status: Optional[str] = None


class EntryAnalysisResponse(BaseModel):
    state: str
    model_version: Optional[str]
    quality_flag: Optional[str] = None
    sentiment_score: Optional[float] = None
    key_phrases: Optional[List[str]] = None
    error_message: Optional[str] = None

    class Config:
        from_attributes = True
        protected_namespaces = ()


class EntryListResponse(BaseModel):
    items: List[EntryCardResponse]
    total: int
    page: int
    page_size: int
