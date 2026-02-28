from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc, func
from uuid import UUID
from datetime import datetime, date
import logging

from models.entry import (
    JournalChat, ChatMessage, ChatSummary, 
    Emotion, ChatEmotion, Tag, ChatTag,
    ChatStatusEnum
)
from utils.image_storage import delete_emotion_artwork, get_emotion_artwork_url

logger = logging.getLogger(__name__)


class EntryService:
    """
    Service for journal entries (now backed by JournalChat model)
    Maintains API compatibility while using new database structure
    """
    
    @staticmethod
    def create_entry(
        db: Session,
        user_id: UUID,
        content_text: str,
        title: Optional[str] = None,
        entry_date: Optional[date] = None,
        framework_id: Optional[UUID] = None,
        status: str = "DRAFT"
    ) -> JournalChat:
        """Create a new journal chat/entry"""
        # Map old status to new enum
        status_enum = ChatStatusEnum.DRAFT
        if status == "ANALYZING":
            status_enum = ChatStatusEnum.ANALYZING
        elif status == "COMPLETE" or status == "FINAL":
            status_enum = ChatStatusEnum.COMPLETED
        elif status == "ARCHIVED":
            status_enum = ChatStatusEnum.ARCHIVED
            
        chat = JournalChat(
            user_id=user_id,
            framework_id=framework_id,
            status=status_enum,
            content_text=content_text,
            entry_date=entry_date or date.today(),
            has_user_content=bool(content_text)
        )
        
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat

    @staticmethod
    def get_entry(db: Session, entry_id: UUID, user_id: UUID) -> Optional[JournalChat]:
        """Get a single journal entry with all relationships"""
        return db.query(JournalChat).options(
            joinedload(JournalChat.summary),
            joinedload(JournalChat.framework),
            joinedload(JournalChat.tags).joinedload(ChatTag.tag),
            joinedload(JournalChat.emotions).joinedload(ChatEmotion.emotion)
        ).filter(
            JournalChat.id == entry_id,
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).first()

    @staticmethod
    def list_entries(
        db: Session,
        user_id: UUID,
        status: Optional[str] = None,
        is_analysed: Optional[bool] = None,
        is_highlight: Optional[bool] = None,
        from_date: Optional[date] = None,
        to_date: Optional[date] = None,
        tag_ids: Optional[List[UUID]] = None,
        emotion_ids: Optional[List[UUID]] = None,
        search_query: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[JournalChat], int]:
        """List journal entries with filters"""
        query = db.query(JournalChat).options(
            joinedload(JournalChat.summary),
            joinedload(JournalChat.framework),
            joinedload(JournalChat.tags).joinedload(ChatTag.tag),
            joinedload(JournalChat.emotions).joinedload(ChatEmotion.emotion)
        ).filter(
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        )
        
        # Map old status to new enum
        if status:
            if status == "DRAFT":
                query = query.filter(JournalChat.status == ChatStatusEnum.DRAFT)
            elif status == "ANALYZING":
                query = query.filter(JournalChat.status == ChatStatusEnum.ANALYZING)
            elif status in ["COMPLETE", "FINAL"]:
                query = query.filter(JournalChat.status == ChatStatusEnum.COMPLETED)
            elif status == "ARCHIVED":
                query = query.filter(JournalChat.status == ChatStatusEnum.ARCHIVED)
        
        if from_date:
            query = query.filter(JournalChat.entry_date >= from_date)
        
        if to_date:
            query = query.filter(JournalChat.entry_date <= to_date)
        
        if is_analysed is not None:
            if is_analysed:
                query = query.join(ChatSummary).filter(ChatSummary.state == "COMPLETE")
            else:
                query = query.outerjoin(ChatSummary).filter(
                    or_(ChatSummary.state != "COMPLETE", ChatSummary.chat_id.is_(None))
                )
        
        if tag_ids:
            query = query.join(ChatTag).filter(ChatTag.tag_id.in_(tag_ids))
        
        if emotion_ids:
            query = query.join(ChatEmotion).filter(ChatEmotion.emotion_id.in_(emotion_ids))
        
        if search_query:
            query = query.filter(
                or_(
                    JournalChat.content_text.ilike(f"%{search_query}%"),
                    ChatSummary.title.ilike(f"%{search_query}%")
                )
            )
        
        total = query.count()
        
        # Order by completed_at for completed entries, last_message_at for drafts
        query = query.order_by(
            desc(
                func.coalesce(
                    JournalChat.completed_at,
                    JournalChat.last_message_at,
                    JournalChat.created_at
                )
            )
        )
        
        entries = query.offset((page - 1) * page_size).limit(page_size).all()
        return entries, total

    @staticmethod
    def update_entry(
        db: Session, 
        entry_id: UUID, 
        user_id: UUID, 
        **kwargs
    ) -> Optional[JournalChat]:
        """Update journal entry fields"""
        entry = db.query(JournalChat).filter(
            JournalChat.id == entry_id,
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not entry:
            return None
        
        # Handle status mapping
        if 'status' in kwargs:
            old_status = kwargs['status']
            if old_status == "DRAFT":
                kwargs['status'] = ChatStatusEnum.DRAFT
            elif old_status == "ANALYZING":
                kwargs['status'] = ChatStatusEnum.ANALYZING
            elif old_status in ["COMPLETE", "FINAL"]:
                kwargs['status'] = ChatStatusEnum.COMPLETED
            elif old_status == "ARCHIVED":
                kwargs['status'] = ChatStatusEnum.ARCHIVED
        
        # Update allowed fields
        for key, value in kwargs.items():
            if value is not None and hasattr(entry, key):
                setattr(entry, key, value)
        
        entry.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(entry)
        return entry

    @staticmethod
    def delete_entry(db: Session, entry_id: UUID, user_id: UUID) -> bool:
        """Soft delete a journal entry"""
        entry = db.query(JournalChat).filter(
            JournalChat.id == entry_id,
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not entry:
            return False
        
        # Delete associated artwork if exists
        if entry.summary and entry.summary.image_s3_key:
            try:
                delete_emotion_artwork(entry.summary.image_s3_key)
            except Exception as e:
                logger.warning(f"Failed to delete artwork for entry {entry_id}: {e}")
        
        entry.deleted_at = datetime.utcnow()
        db.commit()
        return True

    @staticmethod
    def finish_entry(
        db: Session, 
        entry_id: UUID, 
        user_id: UUID
    ) -> Optional[JournalChat]:
        """Mark entry as completed"""
        entry = db.query(JournalChat).filter(
            JournalChat.id == entry_id,
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not entry:
            return None
        
        entry.status = ChatStatusEnum.COMPLETED
        entry.completed_at = datetime.utcnow()
        entry.submitted_at = datetime.utcnow()
        
        # Create summary record if it doesn't exist
        if not entry.summary:
            summary = ChatSummary(
                chat_id=entry.id,
                state="PENDING"
            )
            db.add(summary)
        
        db.commit()
        db.refresh(entry)
        return entry

    @staticmethod
    def get_analysis(db: Session, entry_id: UUID, user_id: UUID) -> Optional[ChatSummary]:
        """Get analysis/summary for an entry"""
        entry = db.query(JournalChat).filter(
            JournalChat.id == entry_id,
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not entry:
            return None
        
        return db.query(ChatSummary).filter(ChatSummary.chat_id == entry_id).first()

    @staticmethod
    def delete_all_entries(db: Session, user_id: UUID) -> int:
        """Delete all journal entries for a user"""
        entries = db.query(JournalChat).filter(
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).all()
        
        count = len(entries)
        
        for entry in entries:
            # Delete artwork
            if entry.summary and entry.summary.image_s3_key:
                try:
                    delete_emotion_artwork(entry.summary.image_s3_key)
                except Exception as e:
                    logger.warning(f"Failed to delete artwork for entry {entry.id}: {e}")
            
            # Soft delete
            entry.deleted_at = datetime.utcnow()
        
        db.commit()
        return count
