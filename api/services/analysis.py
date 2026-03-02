from typing import List, Optional
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
import logging

from models.entry import JournalChat, ChatSummary, Emotion, ChatEmotion, ChatMessage, SummaryStateEnum
from models.suggestion import ChatSuggestion
from models.user import User
from config import get_settings
from constants.frameworks import Framework
from ai import analyze_conversation, generate_emotion_artwork, generate_suggestions as ai_generate_suggestions

settings = get_settings()
logger = logging.getLogger(__name__)


class AnalysisService:
    @staticmethod
    async def analyze_conversation(
        db: Session,
        entry_id: UUID,
        user_id: UUID,
        framework: str = "mental_wellness",
        formatted_conversation: Optional[str] = None
    ) -> Optional[dict]:
        """
        Analyze a conversation and generate summary with emotions using structured outputs.
        Uses framework-specific summary prompt.
        
        Args:
            db: Database session
            entry_id: ID of the journal entry
            user_id: ID of the user
            framework: The framework to use for analysis (e.g., "mental_wellness", "decision_making")
            formatted_conversation: Pre-formatted conversation with [HUMAN]/[AI] markers
        """
        try:
            # Get the chat
            chat = db.query(JournalChat).filter(
                JournalChat.id == entry_id,
                JournalChat.user_id == user_id
            ).first()
            
            if not chat:
                logger.error(f"Chat {entry_id} not found")
                return None
            
            # Use provided formatted conversation or fall back to chat content
            conversation_text = formatted_conversation if formatted_conversation else chat.content_text
            
            if not conversation_text or len(conversation_text.strip()) < 1:
                logger.warning(f"Entry {entry_id} has no content for analysis")
                return None
            
            # Analyze conversation
            logger.info(f"Analyzing writing for entry {entry_id} using framework '{framework}'")
            analysis = await analyze_conversation(conversation_text, framework)
            
            if not analysis:
                logger.error(f"Failed to analyze entry {entry_id}")
                return None
            
            logger.info(f"Successfully analyzed entry {entry_id}: {analysis.get('title', 'No title')}")
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing writing for entry {entry_id}: {e}", exc_info=True)
            return None
    
    @staticmethod
    async def generate_emotion_artwork_from_conversation(
        db: Session,
        entry_id: UUID,
        user_id: UUID,
        formatted_conversation: str,
        framework: str = "mental_wellness"
    ) -> Optional[str]:
        """
        Generate abstract artwork directly from formatted conversation with [HUMAN]/[AI] markers.
        Sends conversation with instructions directly to image model.
        Uses framework-specific artwork prompt.
        
        Args:
            db: Database session
            entry_id: ID of the journal entry
            user_id: ID of the user (also used for S3 folder isolation)
            formatted_conversation: Conversation text with [HUMAN] and [AI] markers
            framework: The framework to use for artwork generation
        
        Returns:
            S3 object key or None
        """
        try:
            logger.info(f"Generating emotion artwork for entry {entry_id} using framework '{framework}'")
            
            # Use user_id for S3 folder isolation
            # Note: In the future, we may want to add a separate s3_folder_id field to User model
            # for enhanced security, but for now user_id provides adequate isolation
            api_path = await generate_emotion_artwork(
                entry_id,
                user_id,
                formatted_conversation,
                framework
            )
            
            if not api_path:
                logger.error(f"Failed to generate artwork for entry {entry_id}")
                return None
            
            logger.info(f"Successfully generated artwork for entry {entry_id}")
            return api_path
            
        except Exception as e:
            logger.error(f"Failed to generate emotion artwork from conversation: {e}", exc_info=True)
            return None
    
    @staticmethod
    def save_analysis_to_entry(
        db: Session,
        entry_id: UUID,
        analysis: dict,
        artwork_path: Optional[str] = None
    ) -> bool:
        """
        Save the analysis results to the database
        """
        try:
            chat = db.query(JournalChat).filter(JournalChat.id == entry_id).first()
            if not chat:
                logger.error(f"Chat {entry_id} not found")
                return False
            
            # Update chat title from analysis
            if analysis.get("title"):
                # Store title in the summary
                pass  # Will be stored in summary below
            
            # Save summary
            existing_summary = db.query(ChatSummary).filter(
                ChatSummary.chat_id == entry_id
            ).first()
            
            summary_text = analysis.get("summary", "")
            title = analysis.get("title", "")
            tips = analysis.get("tips", [])
            key_insight = analysis.get("key_insight")
            patterns = analysis.get("patterns", [])
            reflection_questions = analysis.get("reflection_questions", [])

            if existing_summary:
                existing_summary.bullet_points = []
                existing_summary.one_line_summary = summary_text
                existing_summary.title = title
                existing_summary.summary_text = summary_text
                existing_summary.tips_json = tips
                existing_summary.key_insight = key_insight
                existing_summary.patterns_json = patterns
                existing_summary.reflection_questions_json = reflection_questions
                existing_summary.state = SummaryStateEnum.COMPLETE
                existing_summary.image_s3_key = artwork_path
                existing_summary.generated_at = datetime.utcnow()
                existing_summary.updated_at = datetime.utcnow()
                logger.info(f"Updated existing summary for chat {entry_id}")
            else:
                summary = ChatSummary(
                    chat_id=entry_id,
                    title=title,
                    summary_text=summary_text,
                    bullet_points=[],
                    one_line_summary=summary_text,
                    tips_json=tips,
                    key_insight=key_insight,
                    patterns_json=patterns,
                    reflection_questions_json=reflection_questions,
                    state=SummaryStateEnum.COMPLETE,
                    image_s3_key=artwork_path,
                    generated_at=datetime.utcnow()
                )
                db.add(summary)
                logger.info(f"Created new summary for chat {entry_id}")
            
            # Save emotions
            emotions_list = analysis.get("emotions", [])
            
            # Clear existing emotions for this chat
            db.query(ChatEmotion).filter(ChatEmotion.chat_id == entry_id).delete()
            
            for emotion_data in emotions_list:
                emotion_name = emotion_data.get("name")
                # Convert percentage to score (0-1 range)
                emotion_percentage = emotion_data.get("percentage", 0)
                emotion_score = emotion_percentage / 100.0
                
                if not emotion_name:
                    continue
                
                # Normalize emotion name to key format (lowercase, underscore)
                emotion_key = emotion_name.lower().replace(" ", "_")
                
                # Get or create emotion
                emotion = db.query(Emotion).filter(
                    Emotion.key == emotion_key
                ).first()
                
                if not emotion:
                    emotion = Emotion(
                        key=emotion_key,
                        display_name=emotion_name
                    )
                    db.add(emotion)
                    db.flush()
                
                # Create chat-emotion relationship
                chat_emotion = ChatEmotion(
                    chat_id=entry_id,
                    emotion_id=emotion.id,
                    score=emotion_score
                )
                db.add(chat_emotion)
            
            # Create tip-based ChatSuggestion records from the tips list
            tips_list = tips if isinstance(tips, list) else []

            # Delete existing tip-based suggestions for this chat (idempotent re-analysis)
            db.query(ChatSuggestion).filter(
                ChatSuggestion.source_chat_id == entry_id,
                ChatSuggestion.source_type == 'tip_based'
            ).delete()

            for tip in tips_list:
                if not isinstance(tip, dict):
                    continue
                db.add(ChatSuggestion(
                    source_chat_id=entry_id,
                    user_id=chat.user_id,
                    title=tip.get("title"),
                    suggestion_text=tip.get("description", ""),
                    framework_key=tip.get("framework_key", "mental_wellness"),
                    context_brief=None,
                    source_type='tip_based'
                ))

            db.commit()
            logger.info(f"Successfully saved analysis for chat {entry_id}")
            return True

        except Exception as e:
            logger.error(f"Error saving analysis for chat {entry_id}: {e}", exc_info=True)
            db.rollback()
            return False

    @staticmethod
    async def generate_suggestions(
        db: Session,
        entry_id: UUID,
        user_id: UUID,
        framework: str,
        formatted_conversation: str,
        summary_text: str = ""
    ) -> Optional[list]:
        """Generate follow-up suggestions for a completed conversation."""
        try:
            logger.info(f"Generating suggestions for entry {entry_id}")
            suggestions = await ai_generate_suggestions(
                formatted_conversation, framework, summary_text
            )

            if not suggestions:
                logger.warning(f"No suggestions generated for entry {entry_id}")
                return None

            logger.info(f"Generated {len(suggestions)} suggestions for entry {entry_id}")
            return suggestions
        except Exception as e:
            logger.error(f"Error generating suggestions: {e}", exc_info=True)
            return None

    @staticmethod
    def save_suggestions(
        db: Session,
        entry_id: UUID,
        user_id: UUID,
        suggestions: list
    ) -> bool:
        """Save generated suggestions to database."""
        try:
            for suggestion_data in suggestions:
                suggestion = ChatSuggestion(
                    source_chat_id=entry_id,
                    user_id=user_id,
                    suggestion_text=suggestion_data["suggestion_text"],
                    framework_key=suggestion_data["framework_key"],
                    context_brief=suggestion_data["context_brief"]
                )
                db.add(suggestion)

            db.commit()
            logger.info(f"Saved {len(suggestions)} suggestions for entry {entry_id}")
            return True
        except Exception as e:
            logger.error(f"Error saving suggestions: {e}", exc_info=True)
            db.rollback()
            return False
