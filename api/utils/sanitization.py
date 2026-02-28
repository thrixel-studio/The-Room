"""
Input sanitization utilities to prevent injection attacks and XSS.
"""
import re
import html
from typing import Optional


class InputSanitizer:
    """Utilities for sanitizing user input."""
    
    # Dangerous patterns that could indicate injection attempts
    SQL_INJECTION_PATTERNS = [
        r"(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)",
        r"(--|;|\/\*|\*\/)",
        r"(\bOR\b.*=.*)",
        r"(\bAND\b.*=.*)",
    ]
    
    # XSS patterns
    XSS_PATTERNS = [
        r"<script[^>]*>.*?</script>",
        r"javascript:",
        r"on\w+\s*=",  # event handlers like onclick, onload
        r"<iframe",
        r"<object",
        r"<embed",
    ]
    
    @staticmethod
    def sanitize_string(text: Optional[str], max_length: int = 1000) -> Optional[str]:
        """
        Sanitize a general string input.
        - Removes null bytes
        - Limits length
        - Trims whitespace
        """
        if text is None:
            return None
        
        # Remove null bytes
        text = text.replace('\x00', '')
        
        # Remove other control characters except newlines and tabs
        text = ''.join(char for char in text if char >= ' ' or char in '\n\r\t')
        
        # Trim whitespace
        text = text.strip()
        
        # Limit length
        if len(text) > max_length:
            text = text[:max_length]
        
        return text
    
    @staticmethod
    def sanitize_html(text: Optional[str]) -> Optional[str]:
        """
        Escape HTML to prevent XSS attacks.
        Converts special HTML characters to their entity equivalents.
        """
        if text is None:
            return None
        
        return html.escape(text)
    
    @staticmethod
    def sanitize_email(email: str) -> str:
        """
        Sanitize and normalize email address.
        """
        if not email:
            return ""
        
        # Remove whitespace
        email = email.strip().lower()
        
        # Basic email validation pattern
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if not re.match(email_pattern, email):
            raise ValueError("Invalid email format")
        
        # Check for suspicious patterns
        if '..' in email or email.startswith('.') or email.endswith('.'):
            raise ValueError("Invalid email format")
        
        return email
    
    @staticmethod
    def sanitize_username(username: Optional[str]) -> Optional[str]:
        """
        Sanitize username/display name.
        - Allows alphanumeric, spaces, hyphens, underscores
        - Removes or escapes potentially dangerous characters
        """
        if username is None:
            return None
        
        # Trim and normalize whitespace
        username = ' '.join(username.split())
        
        # Remove any HTML tags
        username = re.sub(r'<[^>]+>', '', username)
        
        # Check for dangerous patterns
        if re.search(r'[<>{}\\]', username):
            raise ValueError("Username contains invalid characters")
        
        # Limit length
        if len(username) > 100:
            username = username[:100]
        
        return username
    
    @staticmethod
    def detect_sql_injection(text: str) -> bool:
        """
        Detect potential SQL injection attempts.
        Returns True if suspicious patterns are found.
        """
        if not text:
            return False
        
        text_upper = text.upper()
        
        for pattern in InputSanitizer.SQL_INJECTION_PATTERNS:
            if re.search(pattern, text_upper, re.IGNORECASE):
                return True
        
        return False
    
    @staticmethod
    def detect_xss(text: str) -> bool:
        """
        Detect potential XSS attempts.
        Returns True if suspicious patterns are found.
        """
        if not text:
            return False
        
        text_lower = text.lower()
        
        for pattern in InputSanitizer.XSS_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                return True
        
        return False
    
    @staticmethod
    def sanitize_path(path: str) -> str:
        """
        Sanitize file path to prevent directory traversal attacks.
        """
        if not path:
            return ""
        
        # Remove any attempts at directory traversal
        dangerous_patterns = ['..', '~', '\\', '//', '\x00']
        
        for pattern in dangerous_patterns:
            if pattern in path:
                raise ValueError("Invalid path: contains dangerous pattern")
        
        # Only allow alphanumeric, hyphens, underscores, dots, and forward slashes
        if not re.match(r'^[a-zA-Z0-9._/-]+$', path):
            raise ValueError("Invalid path: contains invalid characters")
        
        return path
    
    @staticmethod
    def sanitize_url(url: str) -> str:
        """
        Sanitize URL to prevent SSRF and other attacks.
        Only allows http and https protocols.
        """
        if not url:
            return ""
        
        url = url.strip()
        
        # Only allow http and https protocols
        if not re.match(r'^https?://', url, re.IGNORECASE):
            raise ValueError("URL must use http or https protocol")
        
        # Block localhost and private IPs to prevent SSRF
        localhost_patterns = [
            r'localhost',
            r'127\.\d+\.\d+\.\d+',
            r'0\.0\.0\.0',
            r'10\.\d+\.\d+\.\d+',
            r'172\.(1[6-9]|2\d|3[01])\.\d+\.\d+',
            r'192\.168\.\d+\.\d+',
        ]
        
        url_lower = url.lower()
        for pattern in localhost_patterns:
            if re.search(pattern, url_lower):
                raise ValueError("URL cannot point to local or private network")
        
        return url


def sanitize_dict(data: dict, allowed_fields: set) -> dict:
    """
    Sanitize a dictionary by removing unexpected fields and sanitizing values.
    """
    sanitized = {}
    
    for key, value in data.items():
        if key not in allowed_fields:
            continue
        
        if isinstance(value, str):
            value = InputSanitizer.sanitize_string(value)
        
        sanitized[key] = value
    
    return sanitized
