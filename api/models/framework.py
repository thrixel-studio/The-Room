import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from database import Base


class Framework(Base):
    """AI frameworks for different journaling approaches"""
    __tablename__ = "frameworks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    key = Column(Text, nullable=False, unique=True)  # e.g., 'MENTAL_WELLNESS'
    name = Column(Text, nullable=False)  # e.g., 'Psychologist'
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    ui_metadata = Column(JSONB, nullable=True)  # icons, ordering, etc.
    system_prompt = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
