from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class ConsistencyMetrics(BaseModel):
    days_written_this_month: int
    target_days: Optional[int]
    current_streak_days: int
    writing_minutes_month: int


class EmotionStateItem(BaseModel):
    emotion_id: UUID
    name: str
    color: Optional[str] = None
    count: int
    avg_intensity: Decimal


class InsightCardResponse(BaseModel):
    id: UUID
    type: str
    severity: str
    title: str
    message: str
    payload: Optional[Dict]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class InsightsDashboardResponse(BaseModel):
    consistency: ConsistencyMetrics
    emotion_state: List[EmotionStateItem]
    cards: List[InsightCardResponse]
