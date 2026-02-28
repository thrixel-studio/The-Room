"""
Router for serving media files (images, artwork, etc.)

Note: Emotion artwork is now stored in S3. The API returns presigned URLs
directly in the response, so this router is kept for potential future media needs.
"""
from fastapi import APIRouter
import logging

router = APIRouter(prefix="/media", tags=["media"])
logger = logging.getLogger(__name__)

# Emotion artwork is now served via S3 presigned URLs
# The get_emotion_artwork_url() function from utils.image_storage is used
# to generate temporary URLs that are returned directly in API responses
