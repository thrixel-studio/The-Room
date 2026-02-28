from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from uuid import UUID
from datetime import datetime, date
import json
import logging

from models.entry import JournalChat, ChatMessage, ChatSummary, ChatStatusEnum, MessageRoleEnum, SummaryStateEnum
from models.user import User
from models.framework import Framework
from config import get_settings
from utils.prompts import format_conversation_with_markers
from constants.frameworks import Framework as FrameworkConstants
from ai import call_assistant_api

settings = get_settings()
logger = logging.getLogger(__name__)


class WritingService:
    """
    Service for managing journal chat sessions
    """
    
    @staticmethod
    async def create_chat_session(db: Session, user_id: UUID, framework_key: Optional[str] = None) -> JournalChat:
        """Create a new chat-based writing session"""
        framework_id = None

        # If a specific framework_key is provided, look it up directly
        if framework_key:
            framework = db.query(Framework).filter(
                Framework.key == framework_key.upper()
            ).first()
            if framework:
                framework_id = framework.id

        # Fall back to user's current framework
        if not framework_id:
            user = db.query(User).filter(User.id == user_id).first()
            framework_id = user.current_framework_id if user and user.current_framework_id else None

        # If still no framework, get the default (MENTAL_WELLNESS)
        if not framework_id:
            framework = db.query(Framework).filter(Framework.key == "MENTAL_WELLNESS").first()
            if not framework:
                # If no frameworks exist at all, get any active framework
                framework = db.query(Framework).filter(Framework.is_active == True).first()

            if framework:
                framework_id = framework.id
            else:
                # This shouldn't happen, but handle it gracefully
                raise Exception("No frameworks available in database")
        
        # Create journal chat
        chat = JournalChat(
            user_id=user_id,
            framework_id=framework_id,
            status=ChatStatusEnum.DRAFT,
            entry_date=date.today(),
            has_user_content=False
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)
        
        logger.info(f"Created new chat session {chat.id} for user {user_id}")
        return chat
    
    @staticmethod
    def get_chat_session_with_messages(
        db: Session, 
        session_id: UUID, 
        user_id: UUID
    ) -> Optional[JournalChat]:
        """Get a chat session with all its messages"""
        chat = db.query(JournalChat).filter(
            JournalChat.id == session_id,
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not chat:
            return None
        
        # Messages are loaded via relationship, already ordered by seq
        return chat
    
    @staticmethod
    def add_user_message(
        db: Session,
        session_id: UUID,
        user_id: UUID,
        content: str
    ) -> Optional[ChatMessage]:
        """Add a user message to the chat session"""
        # Verify session exists and is active (DRAFT status)
        chat = db.query(JournalChat).filter(
            JournalChat.id == session_id,
            JournalChat.user_id == user_id,
            JournalChat.status == ChatStatusEnum.DRAFT,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not chat:
            logger.warning(f"Chat {session_id} not found or not active")
            return None
        
        # Get next sequence number
        max_seq = db.query(func.max(ChatMessage.seq)).filter(
            ChatMessage.chat_id == session_id
        ).scalar() or 0
        
        # Create user message
        message = ChatMessage(
            chat_id=session_id,
            seq=max_seq + 1,
            role=MessageRoleEnum.USER,
            content=content,
            metadata_={}
        )
        db.add(message)
        
        # Update chat metadata
        chat.has_user_content = True
        chat.last_message_at = datetime.utcnow()
        chat.updated_at = datetime.utcnow()
        
        # Update content_text with all user messages
        WritingService._update_chat_content(db, session_id)
        
        db.commit()
        db.refresh(message)
        
        logger.info(f"Added user message to chat {session_id}")
        return message
    
    @staticmethod
    def _update_chat_content(db: Session, session_id: UUID):
        """Update chat content_text from user messages"""
        chat = db.query(JournalChat).filter(JournalChat.id == session_id).first()
        if not chat:
            return
        
        # Get all user messages
        user_messages = db.query(ChatMessage).filter(
            ChatMessage.chat_id == session_id,
            ChatMessage.role == MessageRoleEnum.USER
        ).order_by(ChatMessage.seq).all()
        
        if user_messages:
            content_text = "\n\n".join([msg.content for msg in user_messages])
            chat.content_text = content_text
            chat.word_count = len(content_text.split())
    
    @staticmethod
    async def generate_ai_response(
        db: Session,
        session_id: UUID,
        user_id: UUID,
        user_message_content: str
    ) -> Optional[ChatMessage]:
        """Generate AI response and save it as a message"""
        chat = WritingService.get_chat_session_with_messages(db, session_id, user_id)
        if not chat or chat.status != ChatStatusEnum.DRAFT:
            logger.warning(f"Chat {session_id} not found or not active")
            return None
        
        # Get user information
        user = db.query(User).filter(User.id == user_id).first()
        
        # Get framework key for prompts
        framework_key = chat.framework.key if chat.framework else "MENTAL_WELLNESS"
        
        # Extract first name
        user_first_name = None
        if user and user.first_name:
            user_first_name = user.first_name.strip()
        
        # Build conversation history
        conversation_history = []
        for msg in chat.messages[-10:]:  # Last 10 messages
            conversation_history.append({
                "role": msg.role.value,
                "content": msg.content
            })
        
        # Add current user message
        conversation_history.append({
            "role": "user",
            "content": user_message_content
        })
        
        # Generate AI response
        api_result = await call_assistant_api(
            conversation_history, 
            framework_key.lower(), 
            user_first_name
        )
        
        if not api_result:
            logger.error(f"Failed to generate AI response for chat {session_id}")
            return None
        
        ai_content, api_metadata = api_result
        
        # Parse AI response
        try:
            ai_response = json.loads(ai_content)
            response_content = ai_response.get("content", ai_content)

            # Extract and validate completion_percentage
            completion_percentage = ai_response.get("completion_percentage")
            if completion_percentage is not None:
                try:
                    completion_percentage = float(completion_percentage)
                    # Clamp to 0.0-1.0 range
                    completion_percentage = max(0.0, min(1.0, completion_percentage))
                except (ValueError, TypeError):
                    logger.warning(f"Invalid completion_percentage value: {completion_percentage}")
                    completion_percentage = None

            metadata = {
                "prompt_type": ai_response.get("prompt_type", "question"),
                "framework": framework_key,
                "api_response": api_metadata
            }

            # Add completion_percentage to metadata if present
            if completion_percentage is not None:
                metadata["completion_percentage"] = completion_percentage

            # Extract and validate suggested_framework
            valid_frameworks = {"mental_wellness", "decision_making", "productivity_boost", "problem_solving"}
            suggested_framework = ai_response.get("suggested_framework")
            if suggested_framework:
                suggested_framework = suggested_framework.lower()
                if suggested_framework not in valid_frameworks or suggested_framework == framework_key.lower():
                    suggested_framework = None
            if suggested_framework:
                metadata["suggested_framework"] = suggested_framework

        except json.JSONDecodeError:
            logger.warning(f"AI returned invalid JSON, using raw content")
            response_content = ai_content
            metadata = {
                "prompt_type": "question",
                "framework": framework_key,
                "api_response": api_metadata
            }
        
        # Get next sequence number
        max_seq = db.query(func.max(ChatMessage.seq)).filter(
            ChatMessage.chat_id == session_id
        ).scalar() or 0
        
        # Save AI message
        ai_message = ChatMessage(
            chat_id=session_id,
            seq=max_seq + 1,
            role=MessageRoleEnum.ASSISTANT,
            content=response_content,
            metadata_=metadata
        )
        db.add(ai_message)
        
        # Update chat timestamp
        chat.last_message_at = datetime.utcnow()
        chat.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(ai_message)
        
        logger.info(f"Generated AI response for chat {session_id} using framework '{framework_key}'")
        return ai_message
    
    @staticmethod
    async def finish_chat_session_immediate(
        db: Session,
        session_id: UUID,
        user_id: UUID
    ) -> Optional[JournalChat]:
        """Finish a chat session immediately, mark as ANALYZING"""
        chat = db.query(JournalChat).filter(
            JournalChat.id == session_id,
            JournalChat.user_id == user_id,
            JournalChat.status == ChatStatusEnum.DRAFT,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not chat:
            return None
        
        # Mark as analyzing
        chat.status = ChatStatusEnum.ANALYZING
        chat.submitted_at = datetime.utcnow()
        chat.updated_at = datetime.utcnow()
        
        # Create summary record
        if not chat.summary:
            summary = ChatSummary(
                chat_id=chat.id,
                state="PENDING"
            )
            db.add(summary)
        
        db.commit()
        db.refresh(chat)
        
        logger.info(f"Finished chat {session_id}, marked as ANALYZING")
        return chat

    @staticmethod
    def _update_progress(db: Session, chat_id: UUID, stage: str, message: str, progress: int):
        """Update progress in database instead of WebSocket"""
        try:
            summary = db.query(ChatSummary).filter(ChatSummary.chat_id == chat_id).first()
            if summary:
                summary.current_stage = stage
                summary.stage_message = message
                summary.progress_percent = progress
                db.commit()
        except Exception as e:
            logger.warning(f"Failed to update progress: {e}")
            db.rollback()

    @staticmethod
    async def analyze_entry_background(entry_id: UUID, user_id: UUID):
        """Background task to analyze entry and generate artwork"""
        from database import SessionLocal

        db = SessionLocal()

        try:
            import asyncio
            from services.analysis import AnalysisService

            logger.info(f"Starting background analysis for entry {entry_id}")

            chat = db.query(JournalChat).filter(
                JournalChat.id == entry_id,
                JournalChat.user_id == user_id,
                JournalChat.deleted_at.is_(None)
            ).first()

            if not chat:
                logger.error(f"Chat {entry_id} not found for background analysis")
                return

            # Get framework key
            framework_key = chat.framework.key if chat.framework else "MENTAL_WELLNESS"

            # Stage 1: Loading messages
            WritingService._update_progress(db, entry_id, "loading_messages", "Loading conversation...", 10)

            # Format conversation with markers
            messages = db.query(ChatMessage).filter(
                ChatMessage.chat_id == entry_id
            ).order_by(ChatMessage.seq).all()

            formatted_conversation = format_conversation_with_markers(messages)

            logger.info(f"Running analysis with framework '{framework_key}'")

            # Stage 2: Generating summary
            WritingService._update_progress(db, entry_id, "generating_summary", "Analyzing your conversation...", 30)

            # Run analysis and artwork generation in parallel
            analysis_task = AnalysisService.analyze_conversation(
                db, entry_id, user_id, framework_key, formatted_conversation
            )

            # Stage 3: Creating artwork
            WritingService._update_progress(db, entry_id, "creating_artwork", "Creating emotion artwork...", 60)

            artwork_task = AnalysisService.generate_emotion_artwork_from_conversation(
                db, entry_id, user_id, formatted_conversation, framework_key
            )

            analysis, artwork_path = await asyncio.gather(
                analysis_task,
                artwork_task,
                return_exceptions=True
            )

            # Handle results
            if isinstance(analysis, Exception):
                logger.error(f"Analysis failed: {analysis}")
                analysis = None

            if isinstance(artwork_path, Exception):
                logger.error(f"Artwork generation failed: {artwork_path}")
                artwork_path = None

            # Save results
            if analysis:
                AnalysisService.save_analysis_to_entry(db, entry_id, analysis, artwork_path)

                # Generate suggestions (non-fatal)
                WritingService._update_progress(db, entry_id, "generating_suggestions", "Creating follow-up suggestions...", 85)
                try:
                    suggestions = await AnalysisService.generate_suggestions(
                        db, entry_id, user_id, framework_key, formatted_conversation,
                        summary_text=analysis.get("summary", "")
                    )
                    if suggestions:
                        AnalysisService.save_suggestions(db, entry_id, user_id, suggestions)
                except Exception as e:
                    logger.warning(f"Suggestion generation failed (non-fatal): {e}")

                WritingService._update_progress(db, entry_id, "finalizing", "Finalizing journal entry...", 90)

                # Mark as completed
                chat.status = ChatStatusEnum.COMPLETED
                chat.completed_at = datetime.utcnow()
                db.commit()

                logger.info(f"Background analysis completed for entry {entry_id}")
            else:
                # Analysis failed - revert to DRAFT so user can see it in "Continue Writing"
                chat.status = ChatStatusEnum.DRAFT
                chat.submitted_at = None  # Clear submission timestamp

                # Update summary state to FAILED
                summary = db.query(ChatSummary).filter(ChatSummary.chat_id == entry_id).first()
                if summary:
                    summary.state = SummaryStateEnum.FAILED
                    summary.error_message = "Failed to generate summary"

                db.commit()
                logger.warning(f"Analysis failed for entry {entry_id}, reverted to DRAFT")

        except Exception as e:
            logger.error(f"Failed background analysis for entry {entry_id}: {e}", exc_info=True)

            try:
                # Revert to DRAFT status so user can retry or continue editing
                chat = db.query(JournalChat).filter(JournalChat.id == entry_id).first()
                if chat:
                    chat.status = ChatStatusEnum.DRAFT
                    chat.submitted_at = None  # Clear submission timestamp

                    # Update summary to show failure
                    summary = db.query(ChatSummary).filter(ChatSummary.chat_id == entry_id).first()
                    if summary:
                        summary.state = SummaryStateEnum.FAILED
                        summary.error_message = str(e)

                    db.commit()
                    logger.info(f"Reverted entry {entry_id} to DRAFT after analysis error")

            except Exception as inner_e:
                logger.error(f"Failed to update error state: {inner_e}")
        finally:
            db.close()
    
    @staticmethod
    def delete_chat_session(
        db: Session,
        session_id: UUID,
        user_id: UUID
    ) -> bool:
        """Delete a chat session (soft delete)"""
        chat = db.query(JournalChat).filter(
            JournalChat.id == session_id,
            JournalChat.user_id == user_id,
            JournalChat.deleted_at.is_(None)
        ).first()
        
        if not chat:
            logger.warning(f"Chat {session_id} not found or doesn't belong to user {user_id}")
            return False
        
        try:
            # Soft delete
            chat.deleted_at = datetime.utcnow()
            db.commit()
            
            logger.info(f"Successfully deleted chat session {session_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting chat session {session_id}: {e}", exc_info=True)
            db.rollback()
            return False
