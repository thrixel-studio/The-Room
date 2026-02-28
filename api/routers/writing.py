"""Writing router for chat-based journaling sessions."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from schemas.writing import (
    ChatSessionResponse,
    ChatMessageCreate,
    ChatMessageResponse
)
from services.writing import WritingService
from models.entry import ChatMessage, ChatStatusEnum, JournalChat, ChatSummary, SummaryStateEnum, MessageRoleEnum

router = APIRouter(prefix="/writing", tags=["writing"])


@router.post("/chat/sessions", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_chat_session(
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create new chat-based writing session."""
    chat = await WritingService.create_chat_session(db, current_user_id)

    return {
        "id": chat.id,
        "state": chat.status.value,
        "framework": chat.framework.key.lower() if chat.framework else None,
        "started_at": chat.started_at,
        "ended_at": chat.completed_at,
        "messages": []
    }


@router.get("/chat/sessions", response_model=list[ChatSessionResponse])
async def list_active_chat_sessions(
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all active unfinished chat sessions."""
    from models.entry import JournalChat

    chats = db.query(JournalChat).filter(
        JournalChat.user_id == current_user_id,
        JournalChat.status == ChatStatusEnum.DRAFT,
        JournalChat.deleted_at.is_(None),
        JournalChat.has_user_content == True
    ).order_by(JournalChat.last_message_at.desc()).all()

    result = []
    for chat in chats:
        messages = db.query(ChatMessage).filter(
            ChatMessage.chat_id == chat.id
        ).order_by(ChatMessage.seq).all()

        visible_messages = [msg for msg in messages if msg.role != MessageRoleEnum.SYSTEM]

        serialized_messages = [
            ChatMessageResponse(
                id=msg.id,
                session_id=msg.chat_id,
                role=msg.role.value,
                content=msg.content,
                metadata=msg.metadata_ or {},
                created_at=msg.created_at,
                completion_percentage=(msg.metadata_ or {}).get("completion_percentage")
            )
            for msg in visible_messages
        ]

        result.append({
            "id": chat.id,
            "state": "ACTIVE",
            "framework": chat.framework.key.lower() if chat.framework else None,
            "started_at": chat.started_at,
            "ended_at": chat.completed_at,
            "messages": serialized_messages
        })

    return result


@router.get("/chat/sessions/{session_id}", response_model=ChatSessionResponse)
async def get_chat_session(
    session_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get chat session with all messages."""
    chat = WritingService.get_chat_session_with_messages(db, session_id, current_user_id)
    if not chat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    visible_messages = [msg for msg in chat.messages if msg.role != MessageRoleEnum.SYSTEM]

    serialized_messages = [
        ChatMessageResponse(
            id=msg.id,
            session_id=msg.chat_id,
            role=msg.role.value,
            content=msg.content,
            metadata=msg.metadata_ or {},
            created_at=msg.created_at,
            completion_percentage=(msg.metadata_ or {}).get("completion_percentage")
        )
        for msg in visible_messages
    ]

    api_state = "ACTIVE"
    if chat.status == ChatStatusEnum.ANALYZING:
        api_state = "ANALYZING"
    elif chat.status == ChatStatusEnum.COMPLETED:
        api_state = "FINISHED"
    elif chat.status == ChatStatusEnum.ARCHIVED:
        api_state = "ARCHIVED"

    return {
        "id": chat.id,
        "state": api_state,
        "framework": chat.framework.key.lower() if chat.framework else None,
        "started_at": chat.started_at,
        "ended_at": chat.completed_at,
        "messages": serialized_messages
    }


@router.post("/chat/sessions/{session_id}/messages", response_model=ChatMessageResponse)
async def send_chat_message(
    session_id: UUID,
    message_data: ChatMessageCreate,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send message and get AI response."""
    user_message = WritingService.add_user_message(
        db,
        session_id,
        current_user_id,
        message_data.content
    )

    if not user_message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or inactive"
        )

    ai_message = await WritingService.generate_ai_response(
        db,
        session_id,
        current_user_id,
        message_data.content
    )

    if not ai_message:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate AI response"
        )

    return ChatMessageResponse(
        id=ai_message.id,
        session_id=ai_message.chat_id,
        role=ai_message.role.value,
        content=ai_message.content,
        metadata=ai_message.metadata_ or {},
        created_at=ai_message.created_at,
        completion_percentage=(ai_message.metadata_ or {}).get("completion_percentage")
    )


@router.post("/chat/sessions/{session_id}/finish", status_code=status.HTTP_200_OK)
async def finish_chat_session(
    session_id: UUID,
    request: Request,
    background_tasks: BackgroundTasks,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Finish chat session and create journal entry."""
    chat = await WritingService.finish_chat_session_immediate(
        db,
        session_id,
        current_user_id
    )

    if not chat:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or inactive"
        )

    background_tasks.add_task(
        WritingService.analyze_entry_background,
        chat.id,
        current_user_id
    )

    return {
        "entry_id": chat.id,
        "analysis_state": "PENDING"
    }


@router.get("/chat/sessions/{session_id}/analysis-status")
async def get_analysis_status(
    session_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get real-time status of entry analysis/generation."""
    chat = db.query(JournalChat).filter(
        JournalChat.id == session_id,
        JournalChat.user_id == current_user_id,
        JournalChat.deleted_at.is_(None)
    ).first()

    if not chat:
        raise HTTPException(status_code=404, detail="Session not found")

    if chat.status == ChatStatusEnum.DRAFT:
        return {
            "status": "PENDING",
            "progress_percent": 0,
            "stage": "PENDING",
            "message": "Waiting to start analysis"
        }
    elif chat.status == ChatStatusEnum.ANALYZING:
        summary = chat.summary
        if summary:
            return {
                "status": "IN_PROGRESS",
                "progress_percent": summary.progress_percent or 10,
                "stage": summary.current_stage or "loading_messages",
                "message": summary.stage_message or "Starting analysis..."
            }
        return {
            "status": "IN_PROGRESS",
            "progress_percent": 10,
            "stage": "loading_messages",
            "message": "Starting analysis..."
        }
    elif chat.status == ChatStatusEnum.COMPLETED:
        return {
            "status": "COMPLETED",
            "progress_percent": 100,
            "stage": "COMPLETED",
            "entry_id": str(chat.id)
        }
    else:
        summary = chat.summary
        if summary and summary.state == SummaryStateEnum.FAILED:
            return {
                "status": "ERROR",
                "error": summary.error_message or "Analysis failed"
            }
        return {
            "status": "ERROR",
            "error": "Unknown status"
        }


@router.delete("/chat/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_chat_session(
    session_id: UUID,
    current_user_id: UUID = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete chat session and its messages."""
    success = WritingService.delete_chat_session(db, session_id, current_user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return None
