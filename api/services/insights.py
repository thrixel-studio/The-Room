from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc
from uuid import UUID
from datetime import datetime, date, timedelta

from models.entry import JournalChat, ChatEmotion, Emotion, ChatStatusEnum


class InsightsService:
    @staticmethod
    def get_dashboard(
        db: Session,
        user_id: UUID,
        period_days: int = 30
    ) -> Dict:
        """Get dashboard insights for user"""
        end_date = date.today()
        start_date = end_date - timedelta(days=period_days)
        
        consistency = InsightsService._get_consistency_metrics(db, user_id, start_date, end_date)
        emotion_state = InsightsService._get_emotion_state(db, user_id, start_date, end_date)
        cards = []  # Insight cards not implemented in new schema yet
        
        return {
            "consistency": consistency,
            "emotion_state": emotion_state,
            "cards": cards
        }

    @staticmethod
    def _get_consistency_metrics(db: Session, user_id: UUID, start_date: date, end_date: date) -> Dict:
        """Calculate consistency metrics"""
        # Count completed chats in the period
        days_written = db.query(func.count(func.distinct(JournalChat.entry_date))).filter(
            JournalChat.user_id == user_id,
            JournalChat.status == ChatStatusEnum.COMPLETED,
            JournalChat.entry_date >= start_date,
            JournalChat.entry_date <= end_date,
            JournalChat.deleted_at.is_(None)
        ).scalar() or 0
        
        # Writing minutes not tracked
        writing_minutes = 0
        
        current_streak = InsightsService._calculate_streak(db, user_id)
        
        return {
            "days_written_this_month": days_written,
            "target_days": 20,
            "current_streak_days": current_streak,
            "writing_minutes_month": writing_minutes
        }

    @staticmethod
    def _calculate_streak(db: Session, user_id: UUID) -> int:
        """Calculate consecutive days streak (excluding today)"""
        today = date.today()
        streak = 0
        current_date = today - timedelta(days=1)
        
        while True:
            # Check if there's a completed chat on this date
            chat_exists = db.query(JournalChat).filter(
                JournalChat.user_id == user_id,
                JournalChat.status == ChatStatusEnum.COMPLETED,
                JournalChat.entry_date == current_date,
                JournalChat.deleted_at.is_(None)
            ).first()
            
            if chat_exists:
                streak += 1
                current_date -= timedelta(days=1)
            else:
                break
            
            if streak > 365:
                break
        
        return streak

    @staticmethod
    def _get_emotion_state(db: Session, user_id: UUID, start_date: date, end_date: date) -> List[Dict]:
        """Get emotion statistics for the period"""
        emotion_data = db.query(
            Emotion.id,
            Emotion.display_name,
            func.count(ChatEmotion.chat_id).label("count"),
            func.avg(ChatEmotion.score).label("avg_score")
        ).join(
            ChatEmotion, Emotion.id == ChatEmotion.emotion_id
        ).join(
            JournalChat, ChatEmotion.chat_id == JournalChat.id
        ).filter(
            JournalChat.user_id == user_id,
            JournalChat.status == ChatStatusEnum.COMPLETED,
            JournalChat.entry_date >= start_date,
            JournalChat.entry_date <= end_date,
            JournalChat.deleted_at.is_(None)
        ).group_by(
            Emotion.id, Emotion.display_name
        ).order_by(
            desc("count")
        ).limit(10).all()
        
        return [
            {
                "emotion_id": row.id,
                "name": row.display_name,
                "color": None,  # Can add color mapping later
                "count": row.count,
                "avg_intensity": float(row.avg_score) if row.avg_score else 0.0
            }
            for row in emotion_data
        ]

    @staticmethod
    def _get_active_cards(db: Session, user_id: UUID) -> List[Dict]:
        """Get active insight cards (not implemented yet)"""
        return []

    @staticmethod
    def dismiss_card(db: Session, card_id: UUID, user_id: UUID) -> bool:
        """Dismiss an insight card (not implemented yet)"""
        return False
