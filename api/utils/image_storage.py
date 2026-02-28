"""
Utility functions for storing and serving emotion artwork images in Amazon S3.

DB storage recommendation:
- Store the returned S3 object key (e.g., "tenants/<tenant>/emotion-artwork/<uuid>.webp")
- Do NOT store presigned URLs (they expire)
"""

import logging
from functools import lru_cache
from uuid import UUID
from typing import Optional
from io import BytesIO

import boto3
from PIL import Image
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

from config import get_settings

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def s3_client():
    """
    Create and cache an S3 client with AWS credentials.
    """
    settings = get_settings()
    
    if not settings.S3_BUCKET or not settings.AWS_REGION:
        raise RuntimeError("Missing required settings: S3_BUCKET and/or AWS_REGION")
    
    if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY:
        raise RuntimeError("Missing required AWS credentials: AWS_ACCESS_KEY_ID and/or AWS_SECRET_ACCESS_KEY")

    cfg = Config(
        region_name=settings.AWS_REGION,
        signature_version='s3v4',
        s3={'addressing_style': 'virtual'},
        retries={"mode": "adaptive", "max_attempts": 10},
    )

    return boto3.client(
        "s3",
        region_name=settings.AWS_REGION,
        config=cfg,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )


def convert_png_to_webp(png_bytes: bytes, quality: int = 85) -> bytes:
    """Convert PNG bytes to WebP format with compression."""
    try:
        image = Image.open(BytesIO(png_bytes))

        # Convert RGBA to RGB if needed
        if image.mode == 'RGBA':
            background = Image.new('RGB', image.size, (255, 255, 255))
            background.paste(image, mask=image.split()[3])
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')

        output = BytesIO()
        image.save(output, format='WEBP', quality=quality, method=6)
        output.seek(0)
        webp_bytes = output.read()

        logger.info(
            f"Converted PNG ({len(png_bytes)} bytes) to WebP ({len(webp_bytes)} bytes), "
            f"reduction: {100 - (len(webp_bytes) / len(png_bytes) * 100):.1f}%"
        )
        return webp_bytes
    except Exception as e:
        logger.error(f"Failed to convert PNG to WebP: {e}", exc_info=True)
        raise ValueError(f"Image conversion failed: {e}")


def build_artwork_key(entry_id: UUID, s3_folder_id: UUID) -> str:
    """
    Create an S3 object key with user isolation.
    Format: Artworks/s3-folder-id/entry-id.webp

    Args:
        entry_id: The journal entry ID
        s3_folder_id: UUID for folder isolation (typically user_id)
    """
    settings = get_settings()
    s3_prefix = settings.S3_PREFIX.strip("/")

    filename = f"{entry_id}.webp"
    return f"{s3_prefix}/{s3_folder_id}/{filename}"


def save_emotion_artwork(entry_id: UUID, s3_folder_id: UUID, image_bytes: bytes) -> Optional[str]:
    """
    Save emotion artwork image to S3.

    Args:
        entry_id: The journal entry ID
        s3_folder_id: UUID for S3 folder isolation (typically user_id)
        image_bytes: The PNG image bytes

    Returns:
        S3 object key (safe to store in DB), or None if upload failed.
    """
    settings = get_settings()

    try:
        # Convert PNG to WebP
        webp_quality = getattr(settings, 'WEBP_QUALITY', 85)
        webp_bytes = convert_png_to_webp(image_bytes, quality=webp_quality)

        key = build_artwork_key(entry_id=entry_id, s3_folder_id=s3_folder_id)

        s3_client().put_object(
            Bucket=settings.S3_BUCKET,
            Key=key,
            Body=webp_bytes,
            ContentType="image/webp",
        )
        logger.info("Successfully uploaded emotion artwork to s3://%s/%s", settings.S3_BUCKET, key)
        return key
    except ValueError as e:
        logger.error("Failed to convert artwork for entry %s: %s", entry_id, e, exc_info=True)
        return None
    except (ClientError, BotoCoreError, Exception) as e:
        logger.error("Failed to upload emotion artwork for entry %s: %s", entry_id, e, exc_info=True)
        return None


def get_emotion_artwork_url(s3_key: str) -> Optional[str]:
    """
    Generate a presigned URL for downloading an artwork object from S3.
    URL expires after 1 hour (3600 seconds).
    """
    settings = get_settings()
    key = s3_key.lstrip("/")

    try:
        url = s3_client().generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": settings.S3_BUCKET, "Key": key},
            ExpiresIn=3600,  # 1 hour
        )
        return url
    except (ClientError, BotoCoreError, Exception) as e:
        logger.error("Failed to generate presigned URL for key %s: %s", key, e, exc_info=True)
        return None


def emotion_artwork_exists(s3_key: str) -> bool:
    """
    Check whether an object exists in S3 (HEAD request).
    """
    settings = get_settings()
    key = s3_key.lstrip("/")
    
    try:
        s3_client().head_object(Bucket=settings.S3_BUCKET, Key=key)
        return True
    except ClientError as e:
        code = e.response.get("Error", {}).get("Code")
        if code in ("404", "NoSuchKey", "NotFound"):
            return False
        logger.error("head_object failed for key %s: %s", key, e, exc_info=True)
        return False
    except (BotoCoreError, Exception) as e:
        logger.error("head_object failed for key %s: %s", key, e, exc_info=True)
        return False


def delete_emotion_artwork(s3_key: str) -> bool:
    """
    Delete an emotion artwork image from S3.
    """
    settings = get_settings()
    key = s3_key.lstrip("/")
    
    try:
        s3_client().delete_object(Bucket=settings.S3_BUCKET, Key=key)
        logger.info("Deleted emotion artwork: s3://%s/%s", settings.S3_BUCKET, key)
        return True
    except (ClientError, BotoCoreError, Exception) as e:
        logger.error("Failed to delete emotion artwork %s: %s", key, e, exc_info=True)
        return False
