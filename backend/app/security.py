"""
Security and authentication utilities.
"""

from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings

# Security scheme for API key authentication
security = HTTPBearer(auto_error=False)


async def verify_api_key(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> str:
    """
    Verify API key from Authorization header.
    
    Args:
        credentials: HTTP authorization credentials
        
    Returns:
        API key if valid
        
    Raises:
        HTTPException: If API key is invalid or missing
    """
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="API key required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    api_key = credentials.credentials
    
    if api_key != settings.api_key:
        raise HTTPException(
            status_code=401,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return api_key


# Dependency for protected routes
def get_current_api_key(api_key: str = Depends(verify_api_key)) -> str:
    """Dependency to get current API key."""
    return api_key
