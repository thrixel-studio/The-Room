"""
AI clients for different model interactions.
"""
from .assistant import call_assistant_api
from .summary import analyze_conversation
from .artwork import generate_emotion_artwork
from .suggestions import generate_suggestions

__all__ = [
    "call_assistant_api",
    "analyze_conversation",
    "generate_emotion_artwork",
    "generate_suggestions"
]
