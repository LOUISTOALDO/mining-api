"""
Secure session management middleware and utilities.
"""
import time
import secrets
from typing import Optional, Dict, Any
from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.base import RequestResponseEndpoint
from loguru import logger
import jwt
import os
from datetime import datetime, timedelta
from .security_logging import security_logger

class SecureSessionMiddleware(BaseHTTPMiddleware):
    """Middleware for secure session management."""
    
    def __init__(self, app, session_timeout_minutes: int = 60, max_sessions_per_user: int = 5):
        super().__init__(app)
        self.session_timeout_minutes = session_timeout_minutes
        self.max_sessions_per_user = max_sessions_per_user
        self.active_sessions: Dict[str, Dict[str, Any]] = {}  # In production, use Redis
        self.user_sessions: Dict[str, list] = {}  # Track sessions per user
    
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Check for session token in cookies or headers
        session_token = self._get_session_token(request)
        
        if session_token:
            # Validate session
            if not self._validate_session(session_token, request):
                # Session invalid, clear it
                response = await call_next(request)
                self._clear_session_cookie(response)
                return response
            
            # Update session activity
            self._update_session_activity(session_token)
        
        response = await call_next(request)
        
        # Add secure session cookie if new session created
        if hasattr(request.state, 'new_session_token'):
            self._set_secure_session_cookie(response, request.state.new_session_token)
        
        return response
    
    def _get_session_token(self, request: Request) -> Optional[str]:
        """Extract session token from request."""
        # Check cookie first
        session_token = request.cookies.get("session_token")
        if session_token:
            return session_token
        
        # Check Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            return auth_header.split(" ")[1]
        
        return None
    
    def _validate_session(self, session_token: str, request: Request) -> bool:
        """Validate session token."""
        try:
            # Decode JWT token
            payload = jwt.decode(
                session_token, 
                os.getenv("JWT_SECRET_KEY", "fallback-key"), 
                algorithms=["HS256"],
                options={"verify_exp": True}
            )
            
            # Check if session exists in our tracking
            if session_token not in self.active_sessions:
                return False
            
            session_data = self.active_sessions[session_token]
            
            # Check if session is expired
            if time.time() > session_data["expires_at"]:
                self._remove_session(session_token)
                return False
            
            # Check IP address (optional - can be disabled for mobile users)
            if os.getenv("SESSION_IP_VALIDATION", "true").lower() == "true":
                if session_data.get("ip_address") != request.client.host:
                    security_logger.log_session_anomaly(
                        session_data.get("user_id", "unknown"),
                        request.client.host,
                        "ip_mismatch",
                        {
                            "expected_ip": session_data.get("ip_address"),
                            "actual_ip": request.client.host,
                            "token_prefix": session_token[:10]
                        }
                    )
                    return False
            
            # Check user agent (optional)
            if os.getenv("SESSION_USER_AGENT_VALIDATION", "false").lower() == "true":
                if session_data.get("user_agent") != request.headers.get("User-Agent"):
                    security_logger.log_session_anomaly(
                        session_data.get("user_id", "unknown"),
                        request.client.host,
                        "user_agent_mismatch",
                        {
                            "expected_ua": session_data.get("user_agent"),
                            "actual_ua": request.headers.get("User-Agent"),
                            "token_prefix": session_token[:10]
                        }
                    )
                    return False
            
            return True
            
        except jwt.ExpiredSignatureError:
            logger.info(f"Session expired: {session_token[:10]}...")
            self._remove_session(session_token)
            return False
        except jwt.InvalidTokenError:
            security_logger.log_suspicious_activity(
                "invalid_session_token",
                request.client.host,
                {"token_prefix": session_token[:10], "user_agent": request.headers.get("User-Agent", "")}
            )
            return False
        except Exception as e:
            logger.error(f"Session validation error: {e}")
            return False
    
    def _update_session_activity(self, session_token: str):
        """Update session last activity timestamp."""
        if session_token in self.active_sessions:
            self.active_sessions[session_token]["last_activity"] = time.time()
    
    def _remove_session(self, session_token: str):
        """Remove session from tracking."""
        if session_token in self.active_sessions:
            user_id = self.active_sessions[session_token].get("user_id")
            if user_id and user_id in self.user_sessions:
                self.user_sessions[user_id] = [s for s in self.user_sessions[user_id] if s != session_token]
            del self.active_sessions[session_token]
    
    def create_secure_session(self, user_id: str, request: Request) -> str:
        """Create a new secure session."""
        # Check session limit per user
        if user_id in self.user_sessions:
            if len(self.user_sessions[user_id]) >= self.max_sessions_per_user:
                # Remove oldest session
                oldest_session = self.user_sessions[user_id][0]
                self._remove_session(oldest_session)
        
        # Generate secure session token
        session_token = self._generate_secure_token()
        
        # Create session data
        current_time = time.time()
        session_data = {
            "user_id": user_id,
            "created_at": current_time,
            "last_activity": current_time,
            "expires_at": current_time + (self.session_timeout_minutes * 60),
            "ip_address": request.client.host,
            "user_agent": request.headers.get("User-Agent", ""),
            "session_id": secrets.token_urlsafe(16)
        }
        
        # Store session
        self.active_sessions[session_token] = session_data
        
        # Track user sessions
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = []
        self.user_sessions[user_id].append(session_token)
        
        # Log session creation
        security_logger.log_security_event(
            event_type="session_created",
            severity="INFO",
            user_id=user_id,
            ip_address=request.client.host,
            user_agent=request.headers.get("User-Agent", ""),
            request=request
        )
        
        return session_token
    
    def _generate_secure_token(self) -> str:
        """Generate a cryptographically secure session token."""
        # Create JWT token with secure payload
        payload = {
            "sub": secrets.token_urlsafe(16),  # Random subject
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(minutes=self.session_timeout_minutes),
            "jti": secrets.token_urlsafe(16),  # JWT ID for uniqueness
            "type": "session"
        }
        
        return jwt.encode(
            payload, 
            os.getenv("JWT_SECRET_KEY", "fallback-key"), 
            algorithm="HS256"
        )
    
    def _set_secure_session_cookie(self, response: Response, session_token: str):
        """Set secure session cookie."""
        is_production = os.getenv("ENVIRONMENT") == "production"
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            max_age=self.session_timeout_minutes * 60,
            httponly=True,  # Prevent XSS
            secure=is_production,  # HTTPS only in production
            samesite="strict",  # CSRF protection
            path="/"
        )
    
    def _clear_session_cookie(self, response: Response):
        """Clear session cookie."""
        response.delete_cookie(
            key="session_token",
            path="/",
            httponly=True,
            secure=os.getenv("ENVIRONMENT") == "production",
            samesite="strict"
        )
    
    def invalidate_user_sessions(self, user_id: str):
        """Invalidate all sessions for a user."""
        if user_id in self.user_sessions:
            for session_token in self.user_sessions[user_id]:
                self._remove_session(session_token)
            del self.user_sessions[user_id]
        
        security_logger.log_security_event(
            event_type="all_sessions_invalidated",
            severity="WARNING",
            user_id=user_id,
            details={"reason": "manual_invalidation"}
        )
    
    def cleanup_expired_sessions(self):
        """Clean up expired sessions."""
        current_time = time.time()
        expired_sessions = [
            token for token, data in self.active_sessions.items()
            if current_time > data["expires_at"]
        ]
        
        for token in expired_sessions:
            self._remove_session(token)
        
        if expired_sessions:
            logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")
