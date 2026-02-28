"""Suggestions router for AI-generated follow-up suggestions."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.suggestion import (
    SuggestionListResponse,
    CreateChatFromSuggestionRequest,
    CreateChatFromSuggestionResponse
)
from services.suggestion import SuggestionService

router = APIRouter(prefix="/suggestions", tags=["suggestions"])


@router.get("", response_model=SuggestionListResponse)
async def get_active_suggestions(
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active (non-dismissed, non-acted-on) suggestions for the user."""
    suggestions = SuggestionService.get_active_suggestions(db, current_user_id)
    return SuggestionListResponse(suggestions=suggestions)


@router.post("/start-chat", response_model=CreateChatFromSuggestionResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_from_suggestion(
    request: CreateChatFromSuggestionRequest,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new chat session from a suggestion, locked to the suggested framework."""
    result = await SuggestionService.create_chat_from_suggestion(
        db, current_user_id, request.suggestion_id
    )
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suggestion not found or already used"
        )
    return result


@router.post("/{suggestion_id}/dismiss", status_code=status.HTTP_204_NO_CONTENT)
async def dismiss_suggestion(
    suggestion_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Dismiss a suggestion so it no longer appears."""
    success = SuggestionService.dismiss_suggestion(db, suggestion_id, current_user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Suggestion not found"
        )
    return None
