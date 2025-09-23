"""
Tests for authentication system.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.auth.service import AuthService
from app.auth.schemas import UserCreate, UserLogin

class TestAuthService:
    """Test authentication service."""
    
    def test_create_user(self, db_session: Session, auth_service: AuthService):
        """Test user creation."""
        user_data = UserCreate(
            email="newuser@example.com",
            username="newuser",
            full_name="New User",
            password="NewPassword123!"
        )
        
        user = auth_service.create_user(user_data)
        
        assert user.email == user_data.email
        assert user.username == user_data.username
        assert user.full_name == user_data.full_name
        assert user.is_active is True
        assert user.is_superuser is False
        assert user.hashed_password != user_data.password  # Should be hashed
    
    def test_create_duplicate_user(self, db_session: Session, auth_service: AuthService, test_user):
        """Test creating duplicate user fails."""
        user_data = UserCreate(
            email=test_user.email,  # Same email
            username="different_username",
            full_name="Different User",
            password="DifferentPassword123!"
        )
        
        with pytest.raises(Exception):  # Should raise HTTPException
            auth_service.create_user(user_data)
    
    def test_authenticate_user(self, db_session: Session, auth_service: AuthService, test_user):
        """Test user authentication."""
        # Test correct credentials
        authenticated_user = auth_service.authenticate_user(test_user.username, "TestPassword123!")
        assert authenticated_user is not None
        assert authenticated_user.id == test_user.id
        
        # Test incorrect password
        authenticated_user = auth_service.authenticate_user(test_user.username, "WrongPassword")
        assert authenticated_user is None
        
        # Test non-existent user
        authenticated_user = auth_service.authenticate_user("nonexistent", "password")
        assert authenticated_user is None
    
    def test_create_session(self, db_session: Session, auth_service: AuthService, test_user):
        """Test session creation."""
        session = auth_service.create_session(test_user)
        
        assert session.user_id == test_user.id
        assert session.is_active is True
        assert session.expires_at > session.created_at
        assert len(session.session_token) > 0
    
    def test_get_session(self, db_session: Session, auth_service: AuthService, test_user):
        """Test session retrieval."""
        session = auth_service.create_session(test_user)
        
        retrieved_session = auth_service.get_session(session.session_token)
        assert retrieved_session is not None
        assert retrieved_session.id == session.id
        
        # Test invalid token
        invalid_session = auth_service.get_session("invalid_token")
        assert invalid_session is None
    
    def test_invalidate_session(self, db_session: Session, auth_service: AuthService, test_user):
        """Test session invalidation."""
        session = auth_service.create_session(test_user)
        
        # Session should be active
        assert auth_service.get_session(session.session_token) is not None
        
        # Invalidate session
        success = auth_service.invalidate_session(session.session_token)
        assert success is True
        
        # Session should be inactive
        assert auth_service.get_session(session.session_token) is None

class TestAuthAPI:
    """Test authentication API endpoints."""
    
    def test_login_success(self, client: TestClient, test_user):
        """Test successful login."""
        response = client.post("/auth/login", json={
            "username": test_user.username,
            "password": "TestPassword123!"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["username"] == test_user.username
    
    def test_login_invalid_credentials(self, client: TestClient, test_user):
        """Test login with invalid credentials."""
        response = client.post("/auth/login", json={
            "username": test_user.username,
            "password": "WrongPassword"
        })
        
        assert response.status_code == 401
        assert "detail" in response.json()
    
    def test_get_current_user(self, client: TestClient, auth_headers):
        """Test getting current user info."""
        response = client.get("/auth/me", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "username" in data
        assert "email" in data
        assert "roles" in data
    
    def test_get_current_user_unauthorized(self, client: TestClient):
        """Test getting current user without authentication."""
        response = client.get("/auth/me")
        
        assert response.status_code == 401
    
    def test_create_user_admin(self, client: TestClient, admin_headers):
        """Test creating user as admin."""
        user_data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "full_name": "New User",
            "password": "NewPassword123!"
        }
        
        response = client.post("/auth/users", json=user_data, headers=admin_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == user_data["username"]
        assert data["email"] == user_data["email"]
    
    def test_create_user_non_admin(self, client: TestClient, auth_headers):
        """Test creating user as non-admin fails."""
        user_data = {
            "email": "newuser@example.com",
            "username": "newuser",
            "full_name": "New User",
            "password": "NewPassword123!"
        }
        
        response = client.post("/auth/users", json=user_data, headers=auth_headers)
        
        assert response.status_code == 403
    
    def test_get_users_admin(self, client: TestClient, admin_headers):
        """Test getting users list as admin."""
        response = client.get("/auth/users", headers=admin_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
    
    def test_get_users_non_admin(self, client: TestClient, auth_headers):
        """Test getting users list as non-admin fails."""
        response = client.get("/auth/users", headers=auth_headers)
        
        assert response.status_code == 403
    
    def test_change_password(self, client: TestClient, auth_headers):
        """Test changing password."""
        password_data = {
            "current_password": "TestPassword123!",
            "new_password": "NewPassword123!"
        }
        
        response = client.post("/auth/change-password", json=password_data, headers=auth_headers)
        
        assert response.status_code == 200
        assert "message" in response.json()
    
    def test_change_password_wrong_current(self, client: TestClient, auth_headers):
        """Test changing password with wrong current password."""
        password_data = {
            "current_password": "WrongPassword",
            "new_password": "NewPassword123!"
        }
        
        response = client.post("/auth/change-password", json=password_data, headers=auth_headers)
        
        assert response.status_code == 400
    
    def test_create_api_key(self, client: TestClient, auth_headers):
        """Test creating API key."""
        api_key_data = {
            "name": "Test API Key",
            "expires_at": None
        }
        
        response = client.post("/auth/api-keys", json=api_key_data, headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "api_key" in data
        assert "name" in data
        assert data["name"] == api_key_data["name"]
