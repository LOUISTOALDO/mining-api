"""
Authentication dependencies for FastAPI.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from ..db import get_db
from .service import AuthService
from .models import User

# Security scheme
security = HTTPBearer()

def get_auth_service(db: Session = Depends(get_db)) -> AuthService:
    """Get authentication service instance."""
    return AuthService(db)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    """Get current authenticated user from token."""
    token = credentials.credentials
    
    # Try API key authentication first
    user = auth_service.authenticate_api_key(token)
    if user:
        return user
    
    # Try session token authentication
    session = auth_service.get_session(token)
    if session and session.user:
        return session.user
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user

def get_current_superuser(current_user: User = Depends(get_current_active_user)) -> User:
    """Get current superuser."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user

def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> Optional[User]:
    """Get current user if authenticated, otherwise None."""
    if not credentials:
        return None
    
    try:
        return get_current_user(credentials, auth_service)
    except HTTPException:
        return None

# Role-based permissions
def require_role(role_name: str):
    """Decorator to require a specific role."""
    def role_checker(current_user: User = Depends(get_current_active_user)):
        user_roles = [role.name for role in current_user.roles]
        if role_name not in user_roles and not current_user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {role_name} role"
            )
        return current_user
    return role_checker

def require_permission(permission: str):
    """Decorator to require a specific permission."""
    def permission_checker(current_user: User = Depends(get_current_active_user)):
        # Superusers have all permissions
        if current_user.is_superuser:
            return current_user
        
        # Check user roles for permission
        user_permissions = []
        for role in current_user.roles:
            if role.permissions:
                import json
                try:
                    role_permissions = json.loads(role.permissions)
                    user_permissions.extend(role_permissions)
                except json.JSONDecodeError:
                    continue
        
        if permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {permission} permission"
            )
        return current_user
    return permission_checker

# Common role requirements
require_admin = require_role("admin")
require_operator = require_role("operator")
require_viewer = require_role("viewer")

# Common permission requirements
require_read_telemetry = require_permission("read:telemetry")
require_write_telemetry = require_permission("write:telemetry")
require_read_machines = require_permission("read:machines")
require_write_machines = require_permission("write:machines")
require_read_users = require_permission("read:users")
require_write_users = require_permission("write:users")
