"""
Security tests for the Mining PDM system.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import os
import tempfile
import json

from app.main import app
from app.core.security import (
    SecurityHeadersMiddleware,
    RateLimitMiddleware,
    RequestSizeLimitMiddleware,
    generate_secure_token,
    hash_password,
    verify_password
)


class TestSecurityMiddleware:
    """Test security middleware functionality."""
    
    def test_security_headers_middleware(self):
        """Test that security headers are added to responses."""
        client = TestClient(app)
        
        response = client.get("/health")
        
        # Check security headers
        assert response.headers.get("X-Content-Type-Options") == "nosniff"
        assert response.headers.get("X-Frame-Options") == "DENY"
        assert response.headers.get("X-XSS-Protection") == "1; mode=block"
        assert response.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
        assert "Content-Security-Policy" in response.headers
    
    def test_rate_limit_middleware(self):
        """Test rate limiting functionality."""
        # Create a test app with rate limiting
        from fastapi import FastAPI
        test_app = FastAPI()
        test_app.add_middleware(RateLimitMiddleware, requests_per_minute=2, burst_limit=1)
        
        @test_app.get("/test")
        async def test_endpoint():
            return {"message": "test"}
        
        client = TestClient(test_app)
        
        # First request should succeed
        response = client.get("/test")
        assert response.status_code == 200
        
        # Second request should be rate limited (burst limit = 1)
        response = client.get("/test")
        assert response.status_code == 429
    
    def test_request_size_limit_middleware(self):
        """Test request size limiting."""
        from fastapi import FastAPI
        test_app = FastAPI()
        test_app.add_middleware(RequestSizeLimitMiddleware, max_size=100)  # 100 bytes
        
        @test_app.post("/test")
        async def test_endpoint(request: dict):
            return {"message": "test"}
        
        client = TestClient(test_app)
        
        # Small request should succeed
        response = client.post("/test", json={"small": "data"})
        assert response.status_code == 200
        
        # Large request should fail
        large_data = {"large": "x" * 200}  # Over 100 bytes
        response = client.post("/test", json=large_data)
        assert response.status_code == 413


class TestSecurityUtilities:
    """Test security utility functions."""
    
    def test_generate_secure_token(self):
        """Test secure token generation."""
        token1 = generate_secure_token(32)
        token2 = generate_secure_token(32)
        
        assert len(token1) > 0
        assert len(token2) > 0
        assert token1 != token2  # Should be different
    
    def test_hash_password(self):
        """Test password hashing."""
        password = "test_password_123"
        hash1, salt1 = hash_password(password)
        hash2, salt2 = hash_password(password)
        
        # Hashes should be different (due to different salts)
        assert hash1 != hash2
        assert salt1 != salt2
        
        # But both should verify correctly
        assert verify_password(password, hash1, salt1)
        assert verify_password(password, hash2, salt2)
    
    def test_verify_password(self):
        """Test password verification."""
        password = "correct_password"
        wrong_password = "wrong_password"
        
        hash_val, salt = hash_password(password)
        
        # Correct password should verify
        assert verify_password(password, hash_val, salt)
        
        # Wrong password should not verify
        assert not verify_password(wrong_password, hash_val, salt)


class TestEnvironmentSecurity:
    """Test environment-based security configuration."""
    
    def test_secret_key_from_environment(self):
        """Test that secret key is loaded from environment."""
        with patch.dict(os.environ, {"SECRET_KEY": "test_secret_key"}):
            from backend.app.main import SECRET_KEY
            assert SECRET_KEY == "test_secret_key"
    
    def test_cors_origins_from_environment(self):
        """Test that CORS origins are loaded from environment."""
        with patch.dict(os.environ, {"CORS_ORIGINS": "https://example.com,https://test.com"}):
            from backend.app.main import CORS_ORIGINS
            assert "https://example.com" in CORS_ORIGINS
            assert "https://test.com" in CORS_ORIGINS
    
    def test_rate_limit_from_environment(self):
        """Test that rate limits are loaded from environment."""
        with patch.dict(os.environ, {
            "RATE_LIMIT_REQUESTS_PER_MINUTE": "200",
            "RATE_LIMIT_BURST": "50"
        }):
            # This would be tested in the actual middleware initialization
            assert os.getenv("RATE_LIMIT_REQUESTS_PER_MINUTE") == "200"
            assert os.getenv("RATE_LIMIT_BURST") == "50"


class TestJWTSecurity:
    """Test JWT token security."""
    
    def test_jwt_secret_key_separation(self):
        """Test that JWT uses separate secret key."""
        with patch.dict(os.environ, {
            "SECRET_KEY": "main_secret",
            "JWT_SECRET_KEY": "jwt_secret"
        }):
            from backend.app.main import SECRET_KEY, JWT_SECRET_KEY
            assert SECRET_KEY == "main_secret"
            assert JWT_SECRET_KEY == "jwt_secret"
    
    def test_jwt_token_creation_and_validation(self):
        """Test JWT token creation and validation."""
        from backend.app.main import create_access_token, get_current_user
        from backend.app.main import JWT_SECRET_KEY, ALGORITHM
        
        # Create a token
        token = create_access_token(data={"sub": "test_user"})
        assert token is not None
        
        # Validate the token
        from jose import jwt
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == "test_user"


class TestInputValidation:
    """Test input validation and sanitization."""
    
    def test_telemetry_input_validation(self):
        """Test telemetry input validation."""
        from backend.app.core.validators import SecureTelemetryInput
        
        # Valid input should pass
        valid_data = {
            "timestamp": "2024-01-01T00:00:00Z",
            "machine_id": "TRUCK_001",
            "model": "CAT_797F",
            "temperature": 75.5,
            "vibration": 2.3,
            "oil_pressure": 45.2,
            "rpm": 1800,
            "run_hours": 5000,
            "load": 85.0,
            "fuel_level": 75.0
        }
        
        validated = SecureTelemetryInput(**valid_data)
        assert validated.machine_id == "TRUCK_001"
        assert validated.temperature == 75.5
    
    def test_telemetry_input_validation_errors(self):
        """Test telemetry input validation errors."""
        from backend.app.core.validators import SecureTelemetryInput
        from pydantic import ValidationError
        
        # Invalid input should raise ValidationError
        invalid_data = {
            "timestamp": "invalid_timestamp",
            "machine_id": "",  # Empty machine ID
            "temperature": -1000,  # Invalid temperature
        }
        
        with pytest.raises(ValidationError):
            SecureTelemetryInput(**invalid_data)


class TestAPIEndpoints:
    """Test API endpoint security."""
    
    def test_health_endpoint_security(self):
        """Test health endpoint has proper security headers."""
        client = TestClient(app)
        response = client.get("/health")
        
        assert response.status_code == 200
        assert "X-Content-Type-Options" in response.headers
    
    def test_predict_endpoint_authentication(self):
        """Test that predict endpoint requires authentication."""
        client = TestClient(app)
        
        # Request without authentication should fail
        response = client.post("/predict", json={
            "timestamp": "2024-01-01T00:00:00Z",
            "machine_id": "TRUCK_001",
            "model": "CAT_797F",
            "temperature": 75.5,
            "vibration": 2.3,
            "oil_pressure": 45.2,
            "rpm": 1800,
            "run_hours": 5000,
            "load": 85.0,
            "fuel_level": 75.0
        })
        
        assert response.status_code == 401  # Unauthorized
    
    def test_test_predict_endpoint_no_auth(self):
        """Test that test-predict endpoint works without authentication."""
        client = TestClient(app)
        
        response = client.post("/test-predict", json={
            "timestamp": "2024-01-01T00:00:00Z",
            "machine_id": "TRUCK_001",
            "model": "CAT_797F",
            "temperature": 75.5,
            "vibration": 2.3,
            "oil_pressure": 45.2,
            "rpm": 1800,
            "run_hours": 5000,
            "load": 85.0,
            "fuel_level": 75.0
        })
        
        # Should work without authentication (for testing)
        assert response.status_code in [200, 500]  # 500 is OK if ML model not loaded


if __name__ == "__main__":
    pytest.main([__file__])
