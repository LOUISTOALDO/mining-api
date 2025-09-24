"""
Time utility functions.
"""

from datetime import datetime, timezone
from typing import Optional


def get_current_timestamp() -> datetime:
    """Get current UTC timestamp."""
    return datetime.now(timezone.utc)


def parse_timestamp(timestamp_str: str) -> Optional[datetime]:
    """
    Parse timestamp string to datetime object.
    
    Args:
        timestamp_str: ISO format timestamp string
        
    Returns:
        Parsed datetime object or None if invalid
    """
    try:
        return datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
    except (ValueError, TypeError):
        return None


def format_timestamp(dt: datetime) -> str:
    """
    Format datetime to ISO string.
    
    Args:
        dt: Datetime object
        
    Returns:
        ISO format timestamp string
    """
    return dt.isoformat()


def is_valid_timestamp_range(start: datetime, end: datetime) -> bool:
    """
    Check if timestamp range is valid.
    
    Args:
        start: Start timestamp
        end: End timestamp
        
    Returns:
        True if valid range, False otherwise
    """
    return start < end
