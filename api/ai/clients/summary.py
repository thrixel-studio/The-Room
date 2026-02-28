"""
Summary/analysis client for conversation analysis.
Moved from services/analysis.py - preserving original logic.
"""
from typing import Optional, Dict
import json
import logging
from openai import AsyncOpenAI

from config import get_settings
from utils.prompts import load_framework_prompt
from ..schema_loader import load_schema

settings = get_settings()
logger = logging.getLogger(__name__)


async def analyze_conversation(
    conversation_text: str,
    framework: str = "mental_wellness"
) -> Optional[Dict]:
    """
    Analyze a conversation and generate summary with emotions using structured outputs.
    Uses framework-specific summary prompt.
    
    Args:
        conversation_text: Full conversation text (with [HUMAN]/[AI] markers)
        framework: The framework to use for analysis (e.g., "mental_wellness", "decision_making")
    
    Returns:
        Analysis dict with title, summary, key_points, and emotions
    """
    if not conversation_text or len(conversation_text.strip()) < 1:
        logger.warning("Empty conversation text provided for analysis")
        return None
    
    # Load framework-specific summary prompt
    summary_prompt = load_framework_prompt(framework, "summary")
    logger.info(f"Loaded summary prompt for framework: {framework}")
    
    # Load schema from JSON file
    schema = load_schema("conversation_summary")
    
    # Initialize OpenAI client
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    try:
        logger.info(f"Analyzing conversation with model {settings.OPENAI_SUMMARY_MODEL} using framework '{framework}'")
        
        response = await client.chat.completions.create(
            model=settings.OPENAI_SUMMARY_MODEL,
            messages=[
                {"role": "system", "content": summary_prompt},
                {"role": "user", "content": f"Please analyze this conversation:\n\n{conversation_text}"}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "conversation_summary",
                    "strict": True,
                    "schema": schema
                }
            }
        )
        
        raw_output = response.choices[0].message.content
        analysis = json.loads(raw_output)
        
        if not analysis:
            logger.error("Failed to parse analysis")
            return None
        
        logger.info(f"Successfully analyzed conversation: {analysis.get('title', 'No title')}")
        return analysis
        
    except Exception as e:
        logger.error(f"Error analyzing conversation: {e}", exc_info=True)
        return None
