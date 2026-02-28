import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Boolean, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base


class ChatSuggestion(Base):
    """AI-generated suggestions for deeper exploration after a chat is analyzed."""
    __tablename__ = "chat_suggestions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_chat_id = Column(UUID(as_uuid=True), ForeignKey("journal_chats.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Suggestion content
    title = Column(Text, nullable=True)
    suggestion_text = Column(Text, nullable=False)
    framework_key = Column(String, nullable=False)
    context_brief = Column(Text, nullable=True)
    source_type = Column(String(50), nullable=False, default='exploration')

    # Lifecycle
    is_dismissed = Column(Boolean, nullable=False, default=False)
    acted_on_chat_id = Column(UUID(as_uuid=True), ForeignKey("journal_chats.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    source_chat = relationship("JournalChat", foreign_keys=[source_chat_id])
    acted_on_chat = relationship("JournalChat", foreign_keys=[acted_on_chat_id])
    user = relationship("User")

    __table_args__ = (
        Index("idx_suggestions_user_active", "user_id", "is_dismissed"),
        Index("idx_suggestions_source_chat", "source_chat_id"),
    )
