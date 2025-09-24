"""
Authentication service for user management and security.
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from typing import Optional, List
import secrets
import json

from .models import User, Role, UserRole, UserSession, APIKey
from .schemas import (
    UserCreate, UserUpdate, UserLogin, TokenData,
    RoleCreate, UserRoleAssign, APIKeyCreate,
    PasswordChange, PasswordReset, PasswordResetConfirm
)

class AuthService:
    """Service class for authentication and user management."""
    
    def __init__(self, db: Session):
        self.db = db
    
    # User Management
    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        if self.get_user_by_email(user_data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        if self.get_user_by_username(user_data.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        hashed_password = User.hash_password(user_data.password)
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            hashed_password=hashed_password,
            is_active=user_data.is_active
        )
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        
        return db_user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        return self.db.query(User).filter(User.username == username).first()
    
    def update_user(self, user_id: int, user_data: UserUpdate) -> User:
        """Update user information."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check for conflicts
        if user_data.email and user_data.email != user.email:
            if self.get_user_by_email(user_data.email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
        
        if user_data.username and user_data.username != user.username:
            if self.get_user_by_username(user_data.username):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
        
        # Update fields
        for field, value in user_data.dict(exclude_unset=True).items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def delete_user(self, user_id: int) -> bool:
        """Delete a user."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Deactivate instead of hard delete
        user.is_active = False
        self.db.commit()
        
        return True
    
    # Authentication
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password."""
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        if not user.is_active:
            return None
        
        if not user.verify_password(password):
            return None
        
        # Update last login
        user.last_login = datetime.utcnow()
        self.db.commit()
        
        return user
    
    def create_user_session(self, user_id: int, session_token: str, ip_address: str = None, user_agent: str = None) -> UserSession:
        """Create a new user session."""
        # Deactivate existing sessions for this user
        self.db.query(UserSession).filter(
            and_(UserSession.user_id == user_id, UserSession.is_active == True)
        ).update({"is_active": False})
        
        # Create new session
        expires_at = datetime.utcnow() + timedelta(hours=24)  # 24 hour session
        
        session = UserSession(
            user_id=user_id,
            session_token=session_token,
            expires_at=expires_at,
            ip_address=ip_address,
            user_agent=user_agent
        )
        
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        
        return session
    
    def get_session(self, session_token: str) -> Optional[UserSession]:
        """Get an active session by token."""
        session = self.db.query(UserSession).filter(
            and_(
                UserSession.session_token == session_token,
                UserSession.is_active == True
            )
        ).first()
        
        if not session or session.is_expired():
            return None
        
        return session
    
    def invalidate_user_session(self, session_token: str) -> bool:
        """Invalidate a user session."""
        session = self.get_session(session_token)
        if session:
            session.is_active = False
            self.db.commit()
            return True
        return False
    
    # Role Management
    def create_role(self, role_data: RoleCreate) -> Role:
        """Create a new role."""
        if self.get_role_by_name(role_data.name):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role already exists"
            )
        
        db_role = Role(
            name=role_data.name,
            description=role_data.description,
            permissions=json.dumps(role_data.permissions)
        )
        
        self.db.add(db_role)
        self.db.commit()
        self.db.refresh(db_role)
        
        return db_role
    
    def get_role_by_name(self, name: str) -> Optional[Role]:
        """Get role by name."""
        return self.db.query(Role).filter(Role.name == name).first()
    
    def get_roles(self) -> List[Role]:
        """Get all roles."""
        return self.db.query(Role).all()
    
    def assign_role_to_user(self, user_id: int, role_id: int, assigned_by: int) -> UserRole:
        """Assign a role to a user."""
        # Check if assignment already exists
        existing = self.db.query(UserRole).filter(
            and_(UserRole.user_id == user_id, UserRole.role_id == role_id)
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has this role"
            )
        
        user_role = UserRole(
            user_id=user_id,
            role_id=role_id,
            assigned_by=assigned_by
        )
        
        self.db.add(user_role)
        self.db.commit()
        self.db.refresh(user_role)
        
        return user_role
    
    def get_user_roles(self, user_id: int) -> List[Role]:
        """Get all roles for a user."""
        return self.db.query(Role).join(UserRole).filter(
            UserRole.user_id == user_id
        ).all()
    
    # API Key Management
    def create_api_key(self, api_key_data: APIKeyCreate) -> tuple[APIKey, str]:
        """Create a new API key for a user."""
        api_key, key_hash, key_prefix = APIKey.generate_api_key()
        
        db_api_key = APIKey(
            user_id=1,  # Default user for now
            name=api_key_data.name,
            key_hash=key_hash,
            key_prefix=key_prefix,
            expires_at=api_key_data.expires_at
        )
        
        self.db.add(db_api_key)
        self.db.commit()
        self.db.refresh(db_api_key)
        
        return db_api_key, api_key
    
    def get_api_keys(self, user_id: int = None) -> List[APIKey]:
        """Get API keys."""
        query = self.db.query(APIKey)
        if user_id:
            query = query.filter(APIKey.user_id == user_id)
        return query.all()
    
    def revoke_api_key(self, api_key_id: int) -> bool:
        """Revoke an API key."""
        api_key = self.db.query(APIKey).filter(APIKey.id == api_key_id).first()
        if not api_key:
            return False
        
        api_key.is_active = False
        self.db.commit()
        return True
    
    def authenticate_api_key(self, api_key: str) -> Optional[User]:
        """Authenticate a user by API key."""
        # Find API key by checking all hashes
        api_keys = self.db.query(APIKey).filter(APIKey.is_active == True).all()
        
        for db_api_key in api_keys:
            if db_api_key.key_hash == User.hash_password(api_key):
                # Update last used
                db_api_key.last_used = datetime.utcnow()
                self.db.commit()
                
                return self.get_user_by_id(db_api_key.user_id)
        
        return None
    
    # Session Management
    def get_user_sessions(self, user_id: int = None) -> List[UserSession]:
        """Get user sessions."""
        query = self.db.query(UserSession)
        if user_id:
            query = query.filter(UserSession.user_id == user_id)
        return query.all()
    
    def terminate_session(self, session_id: int) -> bool:
        """Terminate a user session."""
        session = self.db.query(UserSession).filter(UserSession.id == session_id).first()
        if not session:
            return False
        
        session.is_active = False
        self.db.commit()
        return True
    
    # Password Management
    def change_password(self, user_id: int, password_data: PasswordChange) -> bool:
        """Change user password."""
        user = self.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        if not user.verify_password(password_data.current_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        user.hashed_password = User.hash_password(password_data.new_password)
        self.db.commit()
        
        return True
    
    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Get all users with pagination."""
        return self.db.query(User).offset(skip).limit(limit).all()
    
    def get_user_count(self) -> int:
        """Get total user count."""
        return self.db.query(User).count()
