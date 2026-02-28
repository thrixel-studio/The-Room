"""
Assistant client for chat-based AI interactions.
Moved from services/writing.py - preserving original logic.
"""
from typing import List, Optional, Tuple, Dict
import json
import logging
from openai import AsyncOpenAI

from config import get_settings
from utils.prompts import load_framework_prompt

settings = get_settings()
logger = logging.getLogger(__name__)


async def call_assistant_api(
    conversation_history: List[dict],
    framework: str = "mental_wellness",
    user_first_name: Optional[str] = None
) -> Optional[Tuple[str, dict]]:
    """
    Call OpenAI API with conversation history using framework-specific prompt.
    
    Args:
        conversation_history: List of message dicts with "role" and "content"
        framework: Framework to use (e.g., "mental_wellness", "decision_making")
        user_first_name: Optional user's first name for personalization
    
    Returns:
        Tuple of (AI content, API metadata) or None if failed
    """
    if not settings.OPENAI_API_KEY:
        logger.error("OPENAI_API_KEY not configured")
        return None
    
    # Load framework-specific system instructions
    system_prompt = load_framework_prompt(framework, "assistant")
    logger.info(f"Loaded assistant prompt for framework: {framework}")
    
    # Add user's first name to the system prompt if provided
    if user_first_name:
        system_prompt_with_name = f"{system_prompt}\n\n**USER'S FIRST NAME**: {user_first_name}\nYou may use this name naturally in your greetings and responses to create a more personal connection."
    else:
        system_prompt_with_name = system_prompt
    
    # Ensure JSON format is clear
    system_prompt_with_json = f"{system_prompt_with_name}\n\nCRITICAL: You MUST respond with valid JSON only. No other text."
    
    # Build messages for OpenAI
    messages = [
        {"role": "system", "content": system_prompt_with_json}
    ]
    messages.extend(conversation_history)
    
    # Initialize OpenAI client
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    # Call OpenAI API
    try:
        response = await client.chat.completions.create(
            model=settings.OPENAI_ASSISTANT_MODEL,
            messages=messages,
            response_format={"type": "json_object"}  # Force JSON response
        )
        
        # Log the full response for debugging
        result = response.model_dump()
        logger.info(f"OpenAI Chat API Response: {result}")
        print(f"\n{'='*60}")
        print(f"OPENAI CHAT API RESPONSE (framework: {framework}):")
        print(f"{'='*60}")
        print(f"{result}")
        print(f"{'='*60}\n")
        
        if not response.choices or len(response.choices) == 0:
            logger.error(f"Unexpected OpenAI response format: {result}")
            return None
        
        ai_content = response.choices[0].message.content
        
        # Extract API metadata
        api_metadata = {
            "model": response.model,
            "usage": response.usage.model_dump() if response.usage else {},
            "finish_reason": response.choices[0].finish_reason,
            "framework": framework,
            "system_fingerprint": response.system_fingerprint
        }
        
        logger.info(f"OpenAI response: {ai_content[:100]}...")
        return ai_content, api_metadata
        
    except Exception as e:
        logger.error(f"Error calling OpenAI API: {e}", exc_info=True)
        return None
