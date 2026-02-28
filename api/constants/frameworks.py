"""
Framework constants and validation for the journaling application.
"""
from enum import Enum
from typing import Optional


class Framework(str, Enum):
    """Valid framework types for the journaling application."""
    MENTAL_WELLNESS = "mental_wellness"
    DECISION_MAKING = "decision_making"
    PRODUCTIVITY_BOOST = "productivity_boost"
    PROBLEM_SOLVING = "problem_solving"
    
    @classmethod
    def get_default(cls) -> "Framework":
        """Get the default framework."""
        return cls.MENTAL_WELLNESS
    
    @classmethod
    def from_string(cls, value: Optional[str]) -> Optional["Framework"]:
        """Convert a string to a Framework enum, returns None if invalid."""
        if value is None:
            return None
        try:
            return cls(value.lower().replace(" ", "_"))
        except ValueError:
            return None
    
    @classmethod
    def is_valid(cls, value: str) -> bool:
        """Check if a string is a valid framework value."""
        try:
            cls(value)
            return True
        except ValueError:
            return False
    
    def to_display_name(self) -> str:
        """Convert to human-readable display name."""
        return self.value.replace("_", " ").title()


# Mapping from legacy integer IDs to Framework enum
LEGACY_ID_TO_FRAMEWORK = {
    2: Framework.PRODUCTIVITY_BOOST,
    3: Framework.MENTAL_WELLNESS,
    4: Framework.DECISION_MAKING,
    5: Framework.PROBLEM_SOLVING,
}

# Mapping from Framework enum to folder names in prompts directory
FRAMEWORK_TO_PROMPT_FOLDER = {
    Framework.MENTAL_WELLNESS: "mental_wellness",
    Framework.DECISION_MAKING: "decision_making",
    Framework.PRODUCTIVITY_BOOST: "productivity_boost",
    Framework.PROBLEM_SOLVING: "problem_solving",
}


def get_valid_frameworks() -> list[str]:
    """Get list of all valid framework values."""
    return [f.value for f in Framework]


def validate_framework(value: Optional[str]) -> Optional[str]:
    """
    Validate and normalize a framework value.
    Returns the normalized value if valid, None if the input is None.
    Raises ValueError if the value is invalid.
    """
    if value is None:
        return None
    
    normalized = value.lower().replace(" ", "_")
    if not Framework.is_valid(normalized):
        raise ValueError(
            f"Invalid framework: '{value}'. "
            f"Must be one of: {', '.join(get_valid_frameworks())}"
        )
    return normalized
