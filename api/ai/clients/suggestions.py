"""
Suggestions client for generating follow-up exploration suggestions.
Moved from analysis pipeline - preserving structured output pattern from summary.py.
"""
from typing import Optional, List, Dict
import json
import logging
from openai import AsyncOpenAI

from config import get_settings
from utils.prompts import load_prompt
from ..schema_loader import load_schema

settings = get_settings()
logger = logging.getLogger(__name__)


async def generate_suggestions(
    conversation_text: str,
    framework: str = "mental_wellness",
    summary_text: str = ""
) -> Optional[List[Dict]]:
    """
    Generate follow-up suggestions based on a completed conversation.
    Uses structured outputs with JSON schema.

    Args:
        conversation_text: Full conversation text (with [HUMAN]/[AI] markers)
        framework: The framework used in the original conversation
        summary_text: The generated summary for additional context

    Returns:
        List of suggestion dicts with suggestion_text, framework_key, context_brief
    """
    if not conversation_text or len(conversation_text.strip()) < 1:
        logger.warning("Empty conversation text provided for suggestion generation")
        return None

    # Load root-level suggestions prompt
    suggestions_prompt = load_prompt("suggestions.md")
    logger.info("Loaded suggestions prompt")

    # Load schema from JSON file
    schema = load_schema("chat_suggestions")

    # Initialize OpenAI client
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    try:
        logger.info(f"Generating suggestions with model {settings.OPENAI_SUMMARY_MODEL}")

        user_content = f"Original framework: {framework}\n\n"
        if summary_text:
            user_content += f"Summary of conversation:\n{summary_text}\n\n"
        user_content += f"Full conversation:\n\n{conversation_text}"

        response = await client.chat.completions.create(
            model=settings.OPENAI_SUMMARY_MODEL,
            messages=[
                {"role": "system", "content": suggestions_prompt},
                {"role": "user", "content": user_content}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "chat_suggestions",
                    "strict": True,
                    "schema": schema
                }
            }
        )

        raw_output = response.choices[0].message.content
        result = json.loads(raw_output)

        if not result or "suggestions" not in result:
            logger.error("Failed to parse suggestions")
            return None

        logger.info(f"Successfully generated {len(result['suggestions'])} suggestions")
        return result["suggestions"]

    except Exception as e:
        logger.error(f"Error generating suggestions: {e}", exc_info=True)
        return None
