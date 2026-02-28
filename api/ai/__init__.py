"""
AI module for handling all AI model interactions.
Provides a clean separation between business logic and AI API calls.
"""
from .clients import (
    call_assistant_api,
    analyze_conversation,
    generate_emotion_artwork,
    generate_suggestions
)
from .schema_loader import load_schema

__all__ = [
    "call_assistant_api",
    "analyze_conversation",
    "generate_emotion_artwork",
    "generate_suggestions",
    "load_schema"
]
