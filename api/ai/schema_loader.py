"""
Utility for loading JSON schemas for AI structured outputs.
"""
import json
from pathlib import Path
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

SCHEMAS_DIR = Path(__file__).parent / "schemas"


def load_schema(schema_name: str) -> Dict[str, Any]:
    """
    Load a JSON schema from the schemas directory.
    
    Args:
        schema_name: Name of the schema file (e.g., "conversation_summary")
    
    Returns:
        The schema as a dictionary
    
    Raises:
        FileNotFoundError: If the schema file doesn't exist
        json.JSONDecodeError: If the schema file is invalid JSON
    """
    filepath = SCHEMAS_DIR / f"{schema_name}.json"
    
    if not filepath.exists():
        logger.error(f"Schema file not found: {filepath}")
        raise FileNotFoundError(f"Schema file not found: {schema_name}.json")
    
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            schema = json.load(f)
        
        logger.debug(f"Loaded schema from {schema_name}.json")
        return schema
        
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON in schema {schema_name}.json: {e}")
        raise
    except Exception as e:
        logger.error(f"Failed to load schema from {schema_name}.json: {e}")
        raise
