"""
Pydantic schemas for authentication and user management.
"""
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str
    full_name: str
    is_active: bool = True

class UserCreate(UserBase):
    """Schema for creating a new user."""
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserUpdate(BaseModel):
    """Schema for updating user information."""
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    """Schema for user response."""
    id: int
    is_superuser: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    roles: List[str] = []
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    """Schema for user login."""
    email: str
    password: str

class Token(BaseModel):
    """Schema for authentication token."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class TokenData(BaseModel):
    """Schema for token data."""
    email: Optional[str] = None
    user_id: Optional[int] = None

class RoleBase(BaseModel):
    """Base role schema."""
    name: str
    description: Optional[str] = None
    permissions: List[str] = []

class RoleCreate(RoleBase):
    """Schema for creating a new role."""
    pass

class RoleResponse(RoleBase):
    """Schema for role response."""
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserRoleAssign(BaseModel):
    """Schema for assigning roles to users."""
    user_id: int
    role_id: int

class APIKeyCreate(BaseModel):
    """Schema for creating an API key."""
    name: str
    expires_at: Optional[datetime] = None

class APIKeyResponse(BaseModel):
    """Schema for API key response."""
    id: int
    name: str
    key_prefix: str
    is_active: bool
    expires_at: Optional[datetime] = None
    last_used: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class APIKeyCreateResponse(APIKeyResponse):
    """Schema for API key creation response (includes the actual key)."""
    api_key: str  # Only returned once during creation

class PasswordChange(BaseModel):
    """Schema for password change."""
    current_password: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class PasswordReset(BaseModel):
    """Schema for password reset request."""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Schema for password reset confirmation."""
    token: str
    new_password: str
    
    @validator('new_password')
    def validate_new_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserSessionResponse(BaseModel):
    """Schema for user session response."""
    id: int
    user_id: int
    session_token: str
    expires_at: datetime
    created_at: datetime
    last_activity: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    is_active: bool
    
    class Config:
        from_attributes = True
