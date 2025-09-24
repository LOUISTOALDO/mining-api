"""
Security middleware and utilities for production-ready security.
"""

import time
from typing import Optional
from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.base import RequestResponseEndpoint
import secrets
import hashlib
from loguru import logger
from .security_logging import security_logger


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)
        
        # Allow docs routes to load properly - skip security headers for docs
        docs_paths = ["/docs", "/redoc", "/openapi.json"]
        is_docs_route = any(request.url.path.startswith(path) for path in docs_paths)
        
        if is_docs_route:
            # Minimal headers for docs to allow Swagger UI to work
            response.headers["X-Content-Type-Options"] = "nosniff"
            return response
        
        # Full security headers for all other routes
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()"
        
        # Additional security headers
        response.headers["X-Download-Options"] = "noopen"
        response.headers["X-Permitted-Cross-Domain-Policies"] = "none"
        response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
        response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
        response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
        
        # HSTS (only for HTTPS)
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        
        # Content Security Policy - Enhanced for production
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "  # 'unsafe-eval' needed for some React/Next.js builds
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' ws: wss:; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'; "
            "object-src 'none'; "
            "media-src 'self'; "
            "worker-src 'self'; "
            "manifest-src 'self';"
        )
        response.headers["Content-Security-Policy"] = csp
        
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Enhanced rate limiting middleware with per-user limits."""
    
    def __init__(self, app, requests_per_minute: int = 100, burst_limit: int = 20, 
                 user_requests_per_minute: int = 200, user_burst_limit: int = 50):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.burst_limit = burst_limit
        self.user_requests_per_minute = user_requests_per_minute
        self.user_burst_limit = user_burst_limit
        self.requests = {}  # In production, use Redis
        self.burst_requests = {}
        self.user_requests = {}  # Per-user tracking
        self.user_burst_requests = {}
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        client_ip = request.client.host
        current_time = time.time()
        
        # Get user ID if authenticated
        user_id = None
        try:
            # Try to get user from JWT token
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                # Decode JWT to get user ID (simplified - in production use proper JWT validation)
                import jwt
                try:
                    payload = jwt.decode(token, options={"verify_signature": False})
                    user_id = payload.get("sub")
                except:
                    pass
        except:
            pass
        
        # Clean old entries
        self._clean_old_entries(current_time)
        
        # Check user-based rate limits if authenticated
        if user_id:
            # User burst limit
            user_burst_key = f"user_{user_id}_burst"
            if user_burst_key in self.user_burst_requests:
                if len(self.user_burst_requests[user_burst_key]) >= self.user_burst_limit:
                    security_logger.log_rate_limit_exceeded(client_ip, user_id, "user_burst")
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={"detail": "User rate limit exceeded. Too many requests per second."}
                    )
            else:
                self.user_burst_requests[user_burst_key] = []
            
            self.user_burst_requests[user_burst_key].append(current_time)
            
            # User per-minute limit
            user_minute_key = f"user_{user_id}_minute"
            if user_minute_key in self.user_requests:
                if len(self.user_requests[user_minute_key]) >= self.user_requests_per_minute:
                    security_logger.log_rate_limit_exceeded(client_ip, user_id, "user_minute")
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={"detail": "User rate limit exceeded. Too many requests per minute."}
                    )
            else:
                self.user_requests[user_minute_key] = []
            
            self.user_requests[user_minute_key].append(current_time)
        
        # Check IP-based rate limits (for unauthenticated requests)
        # Burst limit (per second)
        burst_key = f"{client_ip}_burst"
        if burst_key in self.burst_requests:
            if len(self.burst_requests[burst_key]) >= self.burst_limit:
                security_logger.log_rate_limit_exceeded(client_ip, None, "ip_burst")
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={"detail": "Rate limit exceeded. Too many requests per second."}
                )
        else:
            self.burst_requests[burst_key] = []
        
        self.burst_requests[burst_key].append(current_time)
        
        # Per-minute limit
        minute_key = f"{client_ip}_minute"
        if minute_key in self.requests:
            if len(self.requests[minute_key]) >= self.requests_per_minute:
                security_logger.log_rate_limit_exceeded(client_ip, None, "ip_minute")
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={"detail": "Rate limit exceeded. Too many requests per minute."}
                )
        else:
            self.requests[minute_key] = []
        
        self.requests[minute_key].append(current_time)
        
        response = await call_next(request)
        return response
    
    def _clean_old_entries(self, current_time: float):
        """Clean old rate limit entries."""
        # Clean IP burst requests (older than 1 second)
        for key in list(self.burst_requests.keys()):
            self.burst_requests[key] = [
                req_time for req_time in self.burst_requests[key]
                if current_time - req_time < 1.0
            ]
            if not self.burst_requests[key]:
                del self.burst_requests[key]
        
        # Clean IP minute requests (older than 60 seconds)
        for key in list(self.requests.keys()):
            self.requests[key] = [
                req_time for req_time in self.requests[key]
                if current_time - req_time < 60.0
            ]
            if not self.requests[key]:
                del self.requests[key]
        
        # Clean user burst requests (older than 1 second)
        for key in list(self.user_burst_requests.keys()):
            self.user_burst_requests[key] = [
                req_time for req_time in self.user_burst_requests[key]
                if current_time - req_time < 1.0
            ]
            if not self.user_burst_requests[key]:
                del self.user_burst_requests[key]
        
        # Clean user minute requests (older than 60 seconds)
        for key in list(self.user_requests.keys()):
            self.user_requests[key] = [
                req_time for req_time in self.user_requests[key]
                if current_time - req_time < 60.0
            ]
            if not self.user_requests[key]:
                del self.user_requests[key]


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """Limit request body size to prevent DoS attacks."""
    
    def __init__(self, app, max_size: int = 10 * 1024 * 1024):  # 10MB default
        super().__init__(app)
        self.max_size = max_size
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"Request body too large. Maximum size: {self.max_size} bytes"
            )
        
        response = await call_next(request)
        return response


def generate_secure_token(length: int = 32) -> str:
    """Generate a cryptographically secure random token."""
    return secrets.token_urlsafe(length)


def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """Hash a password with a salt."""
    if salt is None:
        salt = secrets.token_hex(16)
    
    # Use PBKDF2 for password hashing
    password_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000  # iterations
    )
    
    return password_hash.hex(), salt


def verify_password(password: str, password_hash: str, salt: str) -> bool:
    """Verify a password against its hash."""
    computed_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(computed_hash, password_hash)


class SecurityLogger:
    """Security event logger."""
    
    @staticmethod
    def log_security_event(event_type: str, details: dict, request: Request):
        """Log security events."""
        logger.warning(
            f"Security event: {event_type}",
            extra={
                "event_type": event_type,
                "client_ip": request.client.host,
                "user_agent": request.headers.get("user-agent"),
                "path": request.url.path,
                "method": request.method,
                **details
            }
        )
    
    @staticmethod
    def log_failed_auth(username: str, request: Request):
        """Log failed authentication attempts."""
        SecurityLogger.log_security_event(
            "failed_auth",
            {"username": username},
            request
        )
    
    @staticmethod
    def log_rate_limit_hit(request: Request):
        """Log rate limit violations."""
        SecurityLogger.log_security_event(
            "rate_limit_hit",
            {},
            request
        )
