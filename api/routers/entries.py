from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List
from datetime import date
import logging

from database import get_db
from dependencies import get_current_user
from schemas.entry import (
    EntryDetailResponse, EntryCardResponse, EntryListResponse,
    EntryCreate, EntryUpdate, EntryAnalysisResponse,
    EntryTipResponse, EntryTipsResponse, EntrySuggestionResponse
)
from services.entry import EntryService
from models.entry import ChatMessage, ChatTag, ChatEmotion, ChatStatusEnum, JournalChat, ChatSummary
from models.suggestion import ChatSuggestion
from utils.image_storage import get_emotion_artwork_url

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/entries", tags=["entries"])


@router.get("", response_model=EntryListResponse)
async def list_entries(
    status_filter: Optional[str] = Query(None, alias="status"),
    analysed: Optional[bool] = None,
    is_highlight: Optional[bool] = None,
    from_date: Optional[date] = None,
    to_date: Optional[date] = None,
    tag_ids: Optional[str] = None,
    emotion_ids: Optional[str] = None,
    q: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List journal entries with filtering and pagination"""
    logger.info(f"[ENTRIES] List entries called with filters: status={status_filter}, analysed={analysed}, "
                f"is_highlight={is_highlight}, from_date={from_date}, to_date={to_date}, "
                f"page={page}, page_size={page_size}, user_id={current_user_id}")

    tag_id_list = [UUID(id) for id in tag_ids.split(",")] if tag_ids else None
    emotion_id_list = [UUID(id) for id in emotion_ids.split(",")] if emotion_ids else None

    chats, total = EntryService.list_entries(
        db=db,
        user_id=current_user_id,
        status=status_filter,
        is_analysed=analysed,
        is_highlight=is_highlight,
        from_date=from_date,
        to_date=to_date,
        tag_ids=tag_id_list,
        emotion_ids=emotion_id_list,
        search_query=q,
        page=page,
        page_size=page_size
    )

    logger.info(f"[ENTRIES] Found {total} total entries, returning {len(chats)} entries for this page")
    
    entry_cards = []
    for chat in chats:
        # Get summary bullets (first 3 for list view)
        summary_bullets = []
        if chat.summary and chat.summary.bullet_points:
            summary_bullets = chat.summary.bullet_points[:3]
        
        # Get tags (first 3)
        tags = [
            {"id": ct.tag.id, "name": ct.tag.display_name, "kind": "TOPIC"}
            for ct in chat.tags[:3]
        ]
        
        # Get emotions
        emotions = [
            {
                "id": ce.emotion.id,
                "name": ce.emotion.display_name,
                "intensity": float(ce.score),
                "color": None  # Can add color mapping later
            }
            for ce in chat.emotions
        ]
        
        # For draft entries, get session_id, framework, last message, recent_messages, and completion_percentage
        session_id = None
        framework = None
        last_message = None
        last_message_timestamp = None
        completion_percentage = None
        recent_messages = None

        if chat.status == ChatStatusEnum.DRAFT:
            session_id = chat.id  # Session ID is the chat ID
            framework = chat.framework.key.lower() if chat.framework else None

            # Get last 5 messages for preview
            messages = db.query(ChatMessage).filter(
                ChatMessage.chat_id == chat.id
            ).order_by(ChatMessage.seq.desc()).limit(5).all()

            if messages:
                # Reverse to get chronological order
                messages = list(reversed(messages))
                recent_messages = [
                    {"role": msg.role, "content": msg.content}
                    for msg in messages
                ]

                # Get last user message for last_message field
                last_user_msg = next((msg for msg in reversed(messages) if msg.role == "user"), None)
                if last_user_msg:
                    last_message = last_user_msg.content
                    last_message_timestamp = last_user_msg.created_at
                else:
                    # Skip empty drafts
                    continue

                # Get last assistant message for completion_percentage
                last_assistant_msg = next((msg for msg in reversed(messages) if msg.role == "assistant"), None)
                if last_assistant_msg and last_assistant_msg.metadata_:
                    completion_percentage = last_assistant_msg.metadata_.get("completion_percentage")
            else:
                # Skip empty drafts
                continue
        
        # Convert S3 key to URL
        hero_image_url = None
        if chat.summary and chat.summary.image_s3_key:
            hero_image_url = get_emotion_artwork_url(chat.summary.image_s3_key)
        
        # Map status to old format for API compatibility
        api_status = "DRAFT"
        if chat.status == ChatStatusEnum.ANALYZING:
            api_status = "ANALYZING"
        elif chat.status == ChatStatusEnum.COMPLETED:
            api_status = "COMPLETE"
        elif chat.status == ChatStatusEnum.ARCHIVED:
            api_status = "ARCHIVED"
        
        entry_cards.append({
            "id": chat.id,
            "entry_date": chat.entry_date,
            "created_at": chat.created_at,
            "hero_image_url": hero_image_url,
            "title": chat.summary.title if chat.summary else None,
            "summary_bullets": summary_bullets,
            "tags": tags,
            "emotions": emotions,
            "is_highlight": False,  # Not implemented in new schema
            "status": api_status,
            "framework": framework,
            "session_id": session_id,
            "last_message": last_message,
            "last_message_timestamp": last_message_timestamp,
            "completion_percentage": completion_percentage,
            "recent_messages": recent_messages
        })
    
    # For DRAFT status, use filtered count
    response_total = len(entry_cards) if status_filter == "DRAFT" else total

    logger.info(f"[ENTRIES] Returning {len(entry_cards)} entry cards with statuses: "
                f"{[e['status'] for e in entry_cards]}")
    logger.info(f"[ENTRIES] Response data: total={response_total}, items_count={len(entry_cards)}, "
                f"page={page}, page_size={page_size}")

    # Log each entry's key details
    for idx, entry in enumerate(entry_cards):
        logger.info(f"[ENTRIES] Entry {idx+1}: id={entry['id']}, status={entry['status']}, "
                    f"title={entry['title']}, entry_date={entry['entry_date']}")

    return EntryListResponse(
        items=entry_cards,
        total=response_total,
        page=page,
        page_size=page_size
    )


@router.get("/{entry_id}", response_model=EntryDetailResponse)
async def get_entry(
    entry_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get detailed journal entry"""
    chat = EntryService.get_entry(db, entry_id, current_user_id)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    
    # Get tags
    tags = [
        {"id": ct.tag.id, "name": ct.tag.display_name, "kind": "TOPIC"}
        for ct in chat.tags
    ]
    
    # Get emotions
    emotions = [
        {
            "id": ce.emotion.id,
            "name": ce.emotion.display_name,
            "intensity": float(ce.score),
            "color": None
        }
        for ce in chat.emotions
    ]
    
    # Get summary with all enriched fields
    summary = None
    if chat.summary and chat.summary.bullet_points:
        summary = {
            "summary_bullets": chat.summary.bullet_points,
            "one_line_summary": chat.summary.one_line_summary,
            "tips": [
                {
                    "title": t.get("title", ""),
                    "description": t.get("description", ""),
                    "framework_key": t.get("framework_key", "mental_wellness"),
                }
                for t in (chat.summary.tips_json or [])
                if isinstance(t, dict)
            ],
            "key_insight": chat.summary.key_insight,
            "patterns": chat.summary.patterns_json or [],
            "reflection_questions": chat.summary.reflection_questions_json or [],
        }

    # Get tip-based suggestions for this conversation
    entry_suggestions = db.query(ChatSuggestion).filter(
        ChatSuggestion.source_chat_id == chat.id,
        ChatSuggestion.source_type == 'tip_based'
    ).all()
    suggestions = [
        {
            "id": s.id,
            "title": s.title,
            "suggestion_text": s.suggestion_text,
            "framework_key": s.framework_key,
            "context_brief": s.context_brief,
        }
        for s in entry_suggestions
    ]

    # Get messages (empty for performance - messages not loaded)
    session_id = chat.id
    messages = []
    
    # Convert S3 key to URL
    hero_image_url = None
    if chat.summary and chat.summary.image_s3_key:
        hero_image_url = get_emotion_artwork_url(chat.summary.image_s3_key)
    
    # Map status to old format
    api_status = "DRAFT"
    if chat.status == ChatStatusEnum.ANALYZING:
        api_status = "ANALYZING"
    elif chat.status == ChatStatusEnum.COMPLETED:
        api_status = "COMPLETE"
    elif chat.status == ChatStatusEnum.ARCHIVED:
        api_status = "ARCHIVED"
    
    return {
        "id": chat.id,
        "title": chat.summary.title if chat.summary else None,
        "content_text": chat.content_text or "",
        "status": api_status,
        "is_highlight": False,
        "entry_date": chat.entry_date,
        "created_at": chat.created_at,
        "updated_at": chat.updated_at,
        "finished_at": chat.completed_at,
        "hero_image_url": hero_image_url,
        "source_type": "CHAT",
        "tags": tags,
        "emotions": emotions,
        "summary": summary,
        "suggestions": suggestions,
        "session_id": session_id,
        "messages": messages
    }


@router.patch("/{entry_id}", response_model=EntryDetailResponse)
async def update_entry(
    entry_id: UUID,
    entry_data: EntryUpdate,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update journal entry"""
    # Map title to summary.title if needed
    update_data = entry_data.model_dump(exclude_unset=True)
    
    chat = EntryService.update_entry(
        db,
        entry_id,
        current_user_id,
        **update_data
    )
    
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    
    return await get_entry(entry_id, current_user_id, db)


@router.delete("", status_code=status.HTTP_200_OK)
async def delete_all_entries(
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete all journal entries for the current user"""
    count = EntryService.delete_all_entries(db, current_user_id)
    return {"message": f"Successfully deleted {count} journal entries", "count": count}


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a journal entry"""
    success = EntryService.delete_entry(db, entry_id, current_user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entry not found")
    return None


@router.get("/tips", response_model=EntryTipsResponse)
async def get_entry_tips(
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get tips from the user's most recent completed journal entries."""
    chats = (
        db.query(JournalChat)
        .join(ChatSummary, ChatSummary.chat_id == JournalChat.id)
        .filter(
            JournalChat.user_id == current_user_id,
            JournalChat.status == ChatStatusEnum.COMPLETED,
            ChatSummary.tips_json.isnot(None),
        )
        .order_by(JournalChat.completed_at.desc())
        .limit(5)
        .all()
    )

    tips = []
    for chat in chats:
        framework_key = chat.framework.key.lower() if chat.framework else "mental_wellness"
        for tip_text in (chat.summary.tips_json or []):
            if tip_text:
                tips.append(EntryTipResponse(
                    tip_text=tip_text,
                    framework_key=framework_key,
                    entry_id=chat.id
                ))

    # Cap at 8 tips to keep the UI clean
    return EntryTipsResponse(tips=tips[:8])


@router.get("/{entry_id}/analysis", response_model=EntryAnalysisResponse)
async def get_entry_analysis(
    entry_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analysis/summary for an entry"""
    summary = EntryService.get_analysis(db, entry_id, current_user_id)
    if not summary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found")
    
    return {
        "state": summary.state.value,
        "model_version": summary.model_version,
        "quality_flag": None,
        "sentiment_score": None,
        "key_phrases": summary.bullet_points,
        "error_message": summary.error_message
    }
