import uuid
from datetime import datetime, date
from sqlalchemy import Column, String, Text, DateTime, Boolean, Date, Integer, ForeignKey, Index, Enum as SQLEnum, CheckConstraint, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from database import Base
import enum


class ChatStatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    ANALYZING = "ANALYZING"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"


class MessageRoleEnum(str, enum.Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class SummaryStateEnum(str, enum.Enum):
    PENDING = "PENDING"
    COMPLETE = "COMPLETE"
    FAILED = "FAILED"


class JournalChat(Base):
    """Main journal chat/conversation entity"""
    __tablename__ = "journal_chats"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    framework_id = Column(UUID(as_uuid=True), ForeignKey("frameworks.id"), nullable=False)
    
    status = Column(SQLEnum(ChatStatusEnum, name="chat_status_enum"), nullable=False, default=ChatStatusEnum.DRAFT)
    has_user_content = Column(Boolean, nullable=False, default=False)
    
    # Calendar / streak logic
    entry_date = Column(Date, nullable=False)
    
    # Denormalized content
    content_text = Column(Text, nullable=True)
    word_count = Column(Integer, nullable=True)
    
    # Lifecycle timestamps
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Continuations
    continuation_of_chat_id = Column(UUID(as_uuid=True), ForeignKey("journal_chats.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="journal_chats")
    framework = relationship("Framework")
    messages = relationship("ChatMessage", back_populates="chat", cascade="all, delete-orphan", order_by="ChatMessage.seq")
    summary = relationship("ChatSummary", back_populates="chat", uselist=False, cascade="all, delete-orphan")
    emotions = relationship("ChatEmotion", back_populates="chat", cascade="all, delete-orphan")
    tags = relationship("ChatTag", back_populates="chat", cascade="all, delete-orphan")
    
    __table_args__ = (
        Index("idx_chats_user_date", "user_id", "entry_date"),
        Index("idx_chats_user_completed_at", "user_id", "completed_at"),
        Index("idx_chats_user_drafts_with_content", "user_id", "last_message_at"),
        Index("idx_chats_user_status", "user_id", "status"),
    )


class ChatMessage(Base):
    """Messages in a journal chat"""
    __tablename__ = "chat_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    chat_id = Column(UUID(as_uuid=True), ForeignKey("journal_chats.id", ondelete="CASCADE"), nullable=False, index=True)
    seq = Column(Integer, nullable=False)  # Monotonic sequence per chat
    role = Column(SQLEnum(MessageRoleEnum, name="message_role_enum"), nullable=False)
    content = Column(Text, nullable=False)
    metadata_ = Column("metadata", JSONB, nullable=True)  # Use metadata_ to avoid conflict with SQLAlchemy's metadata
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    chat = relationship("JournalChat", back_populates="messages")
    
    __table_args__ = (
        Index("idx_messages_chat_seq", "chat_id", "seq"),
    )


class ChatSummary(Base):
    """AI-generated summary for a chat (1:1 relationship)"""
    __tablename__ = "chat_summaries"
    
    chat_id = Column(UUID(as_uuid=True), ForeignKey("journal_chats.id", ondelete="CASCADE"), primary_key=True)
    
    state = Column(SQLEnum(SummaryStateEnum, name="summary_state_enum"), nullable=False, default=SummaryStateEnum.PENDING)
    model_version = Column(Text, nullable=True)
    
    title = Column(Text, nullable=True)
    summary_text = Column(Text, nullable=True)
    bullet_points = Column(ARRAY(Text), nullable=True)
    one_line_summary = Column(Text, nullable=True)
    
    image_s3_key = Column(Text, nullable=True)
    image_prompt = Column(Text, nullable=True)
    generated_at = Column(DateTime, nullable=True)
    raw_payload = Column(JSONB, nullable=True)
    tips_json = Column(JSONB, nullable=True)          # List[str] conversation topic suggestions
    key_insight = Column(Text, nullable=True)          # Single most meaningful observation
    patterns_json = Column(JSONB, nullable=True)       # List[str] recurring thought patterns
    reflection_questions_json = Column(JSONB, nullable=True)  # List[str] open questions
    error_message = Column(Text, nullable=True)

    # Progress tracking for HTTP polling
    progress_percent = Column(Integer, nullable=True, default=0)
    current_stage = Column(String(50), nullable=True)
    stage_message = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    chat = relationship("JournalChat", back_populates="summary")


class Emotion(Base):
    """Dynamic emotions taxonomy"""
    __tablename__ = "emotions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(String, nullable=False, unique=True)  # normalized label
    display_name = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    chats = relationship("ChatEmotion", back_populates="emotion")


class ChatEmotion(Base):
    """Emotions detected in a chat"""
    __tablename__ = "chat_emotions"
    
    chat_id = Column(UUID(as_uuid=True), ForeignKey("journal_chats.id", ondelete="CASCADE"), primary_key=True)
    emotion_id = Column(UUID(as_uuid=True), ForeignKey("emotions.id", ondelete="RESTRICT"), primary_key=True)
    score = Column(Float, nullable=False)  # 0.0 to 1.0
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    chat = relationship("JournalChat", back_populates="emotions")
    emotion = relationship("Emotion", back_populates="chats")
    
    __table_args__ = (
        CheckConstraint("score >= 0.0 AND score <= 1.0", name="check_score_range"),
        Index("idx_chat_emotions_emotion", "emotion_id"),
    )


class Tag(Base):
    """Tags/topics for filtering"""
    __tablename__ = "tags"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(String, nullable=False, unique=True)
    display_name = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    chats = relationship("ChatTag", back_populates="tag")


class ChatTag(Base):
    """Tags assigned to a chat"""
    __tablename__ = "chat_tags"
    
    chat_id = Column(UUID(as_uuid=True), ForeignKey("journal_chats.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(UUID(as_uuid=True), ForeignKey("tags.id", ondelete="RESTRICT"), primary_key=True)
    
    chat = relationship("JournalChat", back_populates="tags")
    tag = relationship("Tag", back_populates="chats")


class UserDailyEntryStat(Base):
    """Daily rollup for streaks and calendar"""
    __tablename__ = "user_daily_entry_stats"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    entry_date = Column(Date, primary_key=True)
    completed_count = Column(Integer, nullable=False, default=0)
    last_completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    __table_args__ = (
        Index("idx_daily_stats_user_date", "user_id", "entry_date"),
    )
