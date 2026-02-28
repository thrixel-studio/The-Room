"""
Artwork generation client for emotional artwork.
Moved from services/analysis.py - preserving original logic.
"""
from typing import Optional
import logging
import base64
from openai import AsyncOpenAI
from uuid import UUID

from config import get_settings
from utils.prompts import load_prompt
from utils.image_storage import save_emotion_artwork

settings = get_settings()
logger = logging.getLogger(__name__)


async def generate_emotion_artwork(
    entry_id: UUID,
    s3_folder_id: UUID,
    formatted_conversation: str,
    framework: str = "mental_wellness"
) -> Optional[str]:
    """
    Generate abstract artwork directly from formatted conversation with [HUMAN]/[AI] markers.
    Sends conversation with instructions directly to image model.
    Uses universal artwork prompt (same for all frameworks).

    Args:
        entry_id: ID of the journal entry
        s3_folder_id: UUID for S3 folder isolation (typically user_id)
        formatted_conversation: Conversation text with [HUMAN] and [AI] markers
        framework: The framework to use for artwork generation (kept for compatibility)

    Returns:
        S3 object key (e.g., "Artworks/s3-folder-id/entry-id.webp") or None
    """
    try:
        logger.info(f"Generating emotion artwork for entry {entry_id}")

        # Load universal artwork prompt (same for all frameworks)
        artwork_prompt = load_prompt("artwork.md")
        logger.info("Loaded universal artwork prompt")
        
        # Combine instructions with formatted conversation for image model
        full_prompt = f"{artwork_prompt}\n\nConversation:\n{formatted_conversation}"
        
        # Initialize OpenAI client
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Generate the image directly
        params = {
            "model": settings.OPENAI_IMAGE_MODEL,
            "prompt": full_prompt,
            "n": 1,
            "size": settings.OPENAI_IMAGE_SIZE,
        }
        
        image_response = await client.images.generate(**params)
        
        if not image_response.data or len(image_response.data) == 0:
            logger.error("No image data in OpenAI response")
            return None
        
        b64_json = image_response.data[0].b64_json
        
        if not b64_json:
            logger.error("No base64 data in OpenAI response")
            return None
        
        image_bytes = base64.b64decode(b64_json)
        
        # Save to S3 with s3_folder_id for folder isolation
        s3_key = save_emotion_artwork(entry_id, s3_folder_id, image_bytes)
        
        if s3_key:
            logger.info(f"Successfully saved artwork to S3: {s3_key}")
        
        return s3_key
        
    except Exception as e:
        logger.error(f"Failed to generate emotion artwork: {e}", exc_info=True)
        return None
