from typing import List
from sqlalchemy.orm import Session
from uuid import UUID

from models.entry import Tag, Emotion


class TaxonomyService:
    @staticmethod
    def list_tags(db: Session) -> List[Tag]:
        """List all tags"""
        return db.query(Tag).all()

    @staticmethod
    def create_tag(db: Session, name: str, kind: str, user_id: UUID) -> Tag:
        """Create a new tag"""
        # Normalize key from name
        key = name.lower().replace(" ", "_")
        
        tag = Tag(
            key=key,
            display_name=name
        )
        db.add(tag)
        db.commit()
        db.refresh(tag)
        return tag

    @staticmethod
    def list_emotions(db: Session) -> List[Emotion]:
        """List all emotions"""
        return db.query(Emotion).all()
