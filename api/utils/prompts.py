"""
Utility functions for loading prompt templates from markdown files.
"""
from pathlib import Path
import logging
from typing import Optional

from constants.frameworks import Framework, FRAMEWORK_TO_PROMPT_FOLDER

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).parent.parent / "ai" / "prompts"


def load_prompt(filename: str) -> str:
    """
    Load a prompt template from a markdown file (legacy - for root level prompts).
    
    Args:
        filename: Name of the prompt file (e.g., "journal_analysis.md")
    
    Returns:
        The prompt content as a string
    
    Raises:
        FileNotFoundError: If the prompt file doesn't exist
    """
    filepath = PROMPTS_DIR / filename
    
    if not filepath.exists():
        logger.error(f"Prompt file not found: {filepath}")
        raise FileNotFoundError(f"Prompt file not found: {filename}")
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read().strip()
        
        logger.debug(f"Loaded prompt from {filename}")
        return content
        
    except Exception as e:
        logger.error(f"Failed to load prompt from {filename}: {e}")
        raise


def load_framework_prompt(framework: str, prompt_type: str) -> str:
    """
    Load a prompt template from a framework-specific subfolder.

    Args:
        framework: Framework name (e.g., "mental_wellness", "decision_making")
        prompt_type: Type of prompt - "assistant" or "summary"

    Returns:
        The prompt content as a string

    Raises:
        FileNotFoundError: If the prompt file doesn't exist
        ValueError: If framework or prompt_type is invalid
    """
    # Validate framework
    try:
        framework_enum = Framework(framework)
    except ValueError:
        logger.warning(f"Invalid framework '{framework}', defaulting to mental_wellness")
        framework_enum = Framework.MENTAL_WELLNESS
    
    # Get folder name from mapping
    folder_name = FRAMEWORK_TO_PROMPT_FOLDER.get(framework_enum, "mental_wellness")
    
    # Validate prompt type
    valid_prompt_types = {"assistant", "summary"}
    if prompt_type not in valid_prompt_types:
        raise ValueError(f"Invalid prompt_type: '{prompt_type}'. Must be one of: {valid_prompt_types}")
    
    filename = f"{prompt_type}.md"
    filepath = PROMPTS_DIR / "frameworks" / folder_name / filename
    
    if not filepath.exists():
        logger.error(f"Framework prompt file not found: {filepath}")
        raise FileNotFoundError(f"Prompt file not found: {folder_name}/{filename}")
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read().strip()
        
        logger.debug(f"Loaded framework prompt from {folder_name}/{filename}")
        return content
        
    except Exception as e:
        logger.error(f"Failed to load framework prompt from {folder_name}/{filename}: {e}")
        raise


def format_conversation_with_markers(messages: list) -> str:
    """
    Format a list of chat messages with clear human/AI markers.
    
    Args:
        messages: List of ChatMessage objects or dicts with 'role' and 'content' keys
    
    Returns:
        Formatted conversation text with [HUMAN] and [AI] markers
    """
    formatted_parts = []
    
    for msg in messages:
        # Handle both ChatMessage objects and dicts
        if hasattr(msg, 'role'):
            role = msg.role
            content = msg.content
        else:
            role = msg.get('role', 'user')
            content = msg.get('content', '')
        
        # Add marker based on role
        if role == 'user':
            formatted_parts.append(f"[HUMAN]: {content}")
        elif role == 'assistant':
            formatted_parts.append(f"[AI]: {content}")
        else:
            # Fallback for any other roles
            formatted_parts.append(f"[{role.upper()}]: {content}")
    
    return "\n\n".join(formatted_parts)
