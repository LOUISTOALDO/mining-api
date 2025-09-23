"""
Custom middleware for error handling and request processing.
"""
import time
import traceback
from typing import Callable
from fastapi import Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from .exceptions import MiningPDMException
from .logging import StructuredLogger, logger

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware for handling exceptions and errors."""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        try:
            response = await call_next(request)
            return response
        except MiningPDMException as e:
            # Handle custom application exceptions
            logger.error(f"Application error: {e.message}", extra={
                "error_type": type(e).__name__,
                "details": e.details,
                "path": request.url.path,
                "method": request.method
            })
            
            return JSONResponse(
                status_code=400,
                content={
                    "error": "Application Error",
                    "message": e.message,
                    "details": e.details,
                    "type": type(e).__name__
                }
            )
        except HTTPException as e:
            # Handle FastAPI HTTP exceptions
            logger.warning(f"HTTP error: {e.detail}", extra={
                "status_code": e.status_code,
                "path": request.url.path,
                "method": request.method
            })
            
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": "HTTP Error",
                    "message": e.detail,
                    "status_code": e.status_code
                }
            )
        except Exception as e:
            # Handle unexpected exceptions
            logger.error(f"Unexpected error: {str(e)}", extra={
                "error_type": type(e).__name__,
                "traceback": traceback.format_exc(),
                "path": request.url.path,
                "method": request.method
            })
            
            # Log security event for unexpected errors
            StructuredLogger.log_security_event(
                "unexpected_error",
                ip_address=request.client.host if request.client else None,
                details={
                    "path": request.url.path,
                    "method": request.method,
                    "error": str(e),
                    "error_type": type(e).__name__
                }
            )
            
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "message": "An unexpected error occurred",
                    "type": "InternalError"
                }
            )

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging requests and responses."""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Log request
        start_time = time.time()
        
        # Extract request info
        request_info = {
            "method": request.method,
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "client_ip": request.client.host if request.client else None,
            "user_agent": request.headers.get("user-agent"),
            "content_type": request.headers.get("content-type"),
            "content_length": request.headers.get("content-length")
        }
        
        logger.info("Request started", extra={"request": request_info})
        
        # Process request
        response = await call_next(request)
        
        # Log response
        process_time = time.time() - start_time
        response_info = {
            "status_code": response.status_code,
            "process_time_ms": round(process_time * 1000, 2),
            "content_type": response.headers.get("content-type"),
            "content_length": response.headers.get("content-length")
        }
        
        logger.info("Request completed", extra={"response": response_info})
        
        # Log performance metric
        StructuredLogger.log_performance_metric(
            "request_processing_time",
            process_time,
            "seconds",
            {
                "method": request.method,
                "path": request.url.path,
                "status_code": str(response.status_code)
            }
        )
        
        return response

class SecurityMiddleware(BaseHTTPMiddleware):
    """Middleware for security headers and protection."""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Check for suspicious patterns
        if self._is_suspicious_request(request):
            StructuredLogger.log_security_event(
                "suspicious_request",
                ip_address=request.client.host if request.client else None,
                details={
                    "path": request.url.path,
                    "method": request.method,
                    "user_agent": request.headers.get("user-agent"),
                    "reason": "Suspicious request pattern detected"
                }
            )
            
            return JSONResponse(
                status_code=403,
                content={
                    "error": "Forbidden",
                    "message": "Request blocked by security policy"
                }
            )
        
        # Process request
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        return response
    
    def _is_suspicious_request(self, request: Request) -> bool:
        """Check if request is suspicious."""
        path = request.url.path.lower()
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Check for common attack patterns
        suspicious_patterns = [
            "..",  # Path traversal
            "<script",  # XSS
            "union select",  # SQL injection
            "drop table",  # SQL injection
            "exec(",  # Command injection
            "eval(",  # Code injection
        ]
        
        # Check path
        for pattern in suspicious_patterns:
            if pattern in path:
                return True
        
        # Check user agent
        suspicious_user_agents = [
            "sqlmap",
            "nikto",
            "nmap",
            "masscan",
            "zap",
            "burp"
        ]
        
        for ua in suspicious_user_agents:
            if ua in user_agent:
                return True
        
        return False

class RateLimitingMiddleware(BaseHTTPMiddleware):
    """Simple rate limiting middleware."""
    
    def __init__(self, app: ASGIApp, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests = {}  # In production, use Redis or similar
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        current_time = time.time()
        
        # Clean old entries
        self._clean_old_entries(current_time)
        
        # Check rate limit
        if self._is_rate_limited(client_ip, current_time):
            StructuredLogger.log_security_event(
                "rate_limit_exceeded",
                ip_address=client_ip,
                details={
                    "path": request.url.path,
                    "method": request.method,
                    "limit": self.requests_per_minute
                }
            )
            
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "message": f"Rate limit exceeded. Maximum {self.requests_per_minute} requests per minute."
                }
            )
        
        # Record request
        if client_ip not in self.requests:
            self.requests[client_ip] = []
        self.requests[client_ip].append(current_time)
        
        # Process request
        response = await call_next(request)
        return response
    
    def _clean_old_entries(self, current_time: float):
        """Clean entries older than 1 minute."""
        cutoff_time = current_time - 60
        for client_ip in list(self.requests.keys()):
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if req_time > cutoff_time
            ]
            if not self.requests[client_ip]:
                del self.requests[client_ip]
    
    def _is_rate_limited(self, client_ip: str, current_time: float) -> bool:
        """Check if client is rate limited."""
        if client_ip not in self.requests:
            return False
        
        # Count requests in the last minute
        cutoff_time = current_time - 60
        recent_requests = [
            req_time for req_time in self.requests[client_ip]
            if req_time > cutoff_time
        ]
        
        return len(recent_requests) >= self.requests_per_minute

class CORSMiddleware(BaseHTTPMiddleware):
    """Custom CORS middleware with security considerations."""
    
    def __init__(self, app: ASGIApp, allowed_origins: list = None):
        super().__init__(app)
        self.allowed_origins = allowed_origins or ["http://localhost:3000"]
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        origin = request.headers.get("origin")
        
        # Handle preflight requests
        if request.method == "OPTIONS":
            response = Response()
            if origin in self.allowed_origins:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
                response.headers["Access-Control-Max-Age"] = "86400"
            return response
        
        # Process request
        response = await call_next(request)
        
        # Add CORS headers
        if origin in self.allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        
        return response
