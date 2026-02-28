from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, date
import logging

from models.suggestion import ChatSuggestion
from models.entry import JournalChat, ChatMessage, ChatSummary, ChatStatusEnum, MessageRoleEnum
from models.framework import Framework

logger = logging.getLogger(__name__)


class SuggestionService:

    @staticmethod
    def get_active_suggestions(db: Session, user_id: UUID, limit: int = 12) -> List[Dict]:
        """Get tip-based suggestions for the user (non-dismissed), sorted by most recent."""
        suggestions = db.query(ChatSuggestion).filter(
            ChatSuggestion.user_id == user_id,
            ChatSuggestion.is_dismissed == False,
            ChatSuggestion.source_type == 'tip_based'
        ).order_by(ChatSuggestion.created_at.desc()).limit(limit).all()

        return [
            {
                "id": s.id,
                "source_chat_id": s.source_chat_id,
                "title": s.title,
                "suggestion_text": s.suggestion_text,
                "framework_key": s.framework_key,
                "context_brief": s.context_brief,
                "is_dismissed": s.is_dismissed,
                "acted_on_chat_id": s.acted_on_chat_id,
                "created_at": s.created_at
            }
            for s in suggestions
        ]

    @staticmethod
    def create_chat_from_suggestion(
        db: Session,
        user_id: UUID,
        suggestion_id: UUID
    ) -> Optional[Dict]:
        """Create a new chat session from a suggestion, locked to the suggested framework."""
        # 1. Load and validate suggestion
        suggestion = db.query(ChatSuggestion).filter(
            ChatSuggestion.id == suggestion_id,
            ChatSuggestion.user_id == user_id,
            ChatSuggestion.is_dismissed == False,
        ).first()

        if not suggestion:
            return None

        # Block "already acted on" only for exploration-type suggestions
        if suggestion.source_type == 'exploration' and suggestion.acted_on_chat_id is not None:
            return None

        # 2. Look up the framework by key
        framework = db.query(Framework).filter(
            Framework.key == suggestion.framework_key.upper()
        ).first()

        if not framework:
            logger.error(f"Framework not found for key: {suggestion.framework_key}")
            return None

        # 3. Create the new chat session locked to the suggested framework
        chat = JournalChat(
            user_id=user_id,
            framework_id=framework.id,
            status=ChatStatusEnum.DRAFT,
            entry_date=date.today(),
            has_user_content=False,
            continuation_of_chat_id=suggestion.source_chat_id
        )
        db.add(chat)
        db.flush()

        # 4. Build context from full summary and inject as system message (seq=0)
        source_summary = db.query(ChatSummary).filter(
            ChatSummary.chat_id == suggestion.source_chat_id
        ).first()

        if source_summary:
            parts = ["[CONTEXT FROM PREVIOUS CONVERSATION]"]
            if source_summary.title:
                parts.append(f"Title: {source_summary.title}")
            if source_summary.one_line_summary:
                parts.append(f"Summary: {source_summary.one_line_summary}")
            if source_summary.bullet_points:
                parts.append("Key points:\n" + "\n".join(f"- {p}" for p in source_summary.bullet_points))
            if source_summary.key_insight:
                parts.append(f"Key insight: {source_summary.key_insight}")
            if source_summary.patterns_json:
                parts.append(f"Patterns: {', '.join(source_summary.patterns_json)}")
            if suggestion.title:
                parts.append(f"\nThe user wants to explore: {suggestion.title} — {suggestion.suggestion_text}")
            parts.append("[END CONTEXT]")
            context_content = "\n".join(parts)
        else:
            context_content = suggestion.context_brief or ""

        context_message = ChatMessage(
            chat_id=chat.id,
            seq=0,
            role=MessageRoleEnum.SYSTEM,
            content=context_content,
            metadata_={
                "type": "suggestion_context",
                "source_suggestion_id": str(suggestion.id),
                "source_chat_id": str(suggestion.source_chat_id)
            }
        )
        db.add(context_message)

        # 5. Mark suggestion as acted on
        suggestion.acted_on_chat_id = chat.id
        suggestion.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(chat)

        logger.info(f"Created chat {chat.id} from suggestion {suggestion_id} with framework {suggestion.framework_key}")

        return {
            "session_id": chat.id,
            "framework": suggestion.framework_key,
            "started_at": chat.started_at
        }

    @staticmethod
    def dismiss_suggestion(db: Session, suggestion_id: UUID, user_id: UUID) -> bool:
        """Dismiss a suggestion so it no longer appears."""
        suggestion = db.query(ChatSuggestion).filter(
            ChatSuggestion.id == suggestion_id,
            ChatSuggestion.user_id == user_id
        ).first()

        if not suggestion:
            return False

        suggestion.is_dismissed = True
        suggestion.updated_at = datetime.utcnow()
        db.commit()

        return True
