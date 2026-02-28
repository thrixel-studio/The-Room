from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from database import get_db
from dependencies import get_current_user
from schemas.taxonomy import TagCreate, TagResponse, EmotionResponse
from services.taxonomy import TaxonomyService

router = APIRouter(prefix="/taxonomy", tags=["taxonomy"])


@router.get("/tags", response_model=List[TagResponse])
async def list_tags(db: Session = Depends(get_db)):
    tags = TaxonomyService.list_tags(db)
    return tags


@router.post("/tags", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_data: TagCreate,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    tag = TaxonomyService.create_tag(db, tag_data.name, tag_data.kind, current_user_id)
    return tag


@router.get("/emotions", response_model=List[EmotionResponse])
async def list_emotions(db: Session = Depends(get_db)):
    emotions = TaxonomyService.list_emotions(db)
    return emotions
