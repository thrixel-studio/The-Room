"""
Rate limiting middleware to prevent brute force attacks and abuse.
"""
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio
import logging
from typing import Dict, Tuple

logger = logging.getLogger(__name__)


class RateLimitStore:
    """In-memory rate limit store with automatic cleanup."""
    
    def __init__(self):
        self.store: Dict[str, list] = defaultdict(list)
        self._lock = asyncio.Lock()
    
    async def add_request(self, key: str, window_seconds: int) -> int:
        """Add a request and return current count within the time window."""
        async with self._lock:
            now = datetime.utcnow()
            cutoff = now - timedelta(seconds=window_seconds)
            
            # Remove expired entries
            self.store[key] = [
                timestamp for timestamp in self.store[key]
                if timestamp > cutoff
            ]
            
            # Add current request
            self.store[key].append(now)
            
            return len(self.store[key])
    
    async def cleanup_old_entries(self):
        """Periodically cleanup old entries to prevent memory leaks."""
        async with self._lock:
            now = datetime.utcnow()
            keys_to_delete = []
            
            for key, timestamps in self.store.items():
                # If last request was more than 1 hour ago, remove the key
                if timestamps and (now - timestamps[-1]).total_seconds() > 3600:
                    keys_to_delete.append(key)
            
            for key in keys_to_delete:
                del self.store[key]
            
            if keys_to_delete:
                logger.debug(f"Cleaned up {len(keys_to_delete)} rate limit entries")


# Global rate limit store
rate_limit_store = RateLimitStore()


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware with different limits for different endpoints.
    """
    
    # Rate limits: (max_requests, window_seconds)
    RATE_LIMITS = {
        "/auth/login": (5, 300),           # 5 attempts per 5 minutes
        "/auth/register": (3, 3600),       # 3 attempts per hour
        "/auth/refresh": (10, 60),         # 10 attempts per minute
        "/auth/google": (10, 60),          # 10 attempts per minute
        "/auth/google/callback": (10, 60), # 10 attempts per minute
        "/auth/logout": (20, 60),          # 20 attempts per minute
        "default": (100, 60),              # 100 requests per minute for other endpoints
    }
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/", "/health"]:
            return await call_next(request)
        
        # Get client identifier (IP address)
        client_ip = self._get_client_ip(request)
        
        # Get rate limit for this endpoint
        path = request.url.path
        max_requests, window = self._get_rate_limit(path)
        
        # Create a unique key for this client and endpoint
        key = f"{client_ip}:{path}"
        
        # Check rate limit
        try:
            request_count = await rate_limit_store.add_request(key, window)
            
            if request_count > max_requests:
                logger.warning(
                    f"Rate limit exceeded for {client_ip} on {path}: "
                    f"{request_count}/{max_requests} requests in {window}s"
                )
                
                # Calculate retry-after time
                retry_after = window
                
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": f"Too many requests. Please try again in {retry_after} seconds.",
                        "retry_after": retry_after
                    },
                    headers={"Retry-After": str(retry_after)}
                )
            
            # Add rate limit headers to response
            response = await call_next(request)
            response.headers["X-RateLimit-Limit"] = str(max_requests)
            response.headers["X-RateLimit-Remaining"] = str(max(0, max_requests - request_count))
            response.headers["X-RateLimit-Reset"] = str(window)
            
            return response
            
        except Exception as e:
            logger.error(f"Rate limiting error: {e}")
            # On error, allow the request to proceed
            return await call_next(request)
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request, handling proxies."""
        # Check X-Forwarded-For header (for proxies/load balancers)
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            # Take the first IP in the chain
            return forwarded.split(",")[0].strip()
        
        # Check X-Real-IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fall back to direct client IP
        if request.client:
            return request.client.host
        
        return "unknown"
    
    def _get_rate_limit(self, path: str) -> Tuple[int, int]:
        """Get rate limit configuration for a specific path."""
        # Exact match
        if path in self.RATE_LIMITS:
            return self.RATE_LIMITS[path]
        
        # Check if path starts with any configured prefix
        for config_path in self.RATE_LIMITS:
            if config_path != "default" and path.startswith(config_path):
                return self.RATE_LIMITS[config_path]
        
        # Default rate limit
        return self.RATE_LIMITS["default"]


async def cleanup_rate_limits_task():
    """Background task to cleanup old rate limit entries."""
    while True:
        try:
            await asyncio.sleep(3600)  # Run every hour
            await rate_limit_store.cleanup_old_entries()
        except Exception as e:
            logger.error(f"Error in rate limit cleanup task: {e}")
