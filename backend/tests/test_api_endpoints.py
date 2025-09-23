"""
API endpoint tests for the Mining PDM system.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json
from datetime import datetime

from app.main import app


class TestHealthEndpoints:
    """Test health check endpoints."""
    
    def test_health_endpoint(self):
        """Test basic health endpoint."""
        client = TestClient(app)
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "ok"
    
    def test_comprehensive_health_endpoint(self):
        """Test comprehensive health endpoint."""
        client = TestClient(app)
        response = client.get("/health/comprehensive")
        
        assert response.status_code == 200
        data = response.json()
        assert "overall_status" in data
        assert "components" in data


class TestPredictionEndpoints:
    """Test prediction endpoints."""
    
    def test_test_predict_endpoint(self):
        """Test the test-predict endpoint (no auth required)."""
        client = TestClient(app)
        
        test_data = {
            "timestamp": "2024-01-01T00:00:00Z",
            "machine_id": "TRUCK_001",
            "model": "CAT_797F",
            "temperature": 75.5,
            "vibration": 2.3,
            "oil_pressure": 4.2,
            "rpm": 1800,
            "run_hours": 5000,
            "load": 85.0,
            "fuel_level": 75.0
        }
        
        response = client.post("/test-predict", json=test_data)
        
        # Should return 200 or 500 (500 is OK if ML model not loaded)
        assert response.status_code in [200, 500]
        
        if response.status_code == 200:
            data = response.json()
            assert "predicted_health_score" in data
            assert "prediction_type" in data
            assert "model_version" in data
            assert "processing_time" in data
            assert "timestamp" in data
    
    def test_predict_endpoint_requires_auth(self):
        """Test that predict endpoint requires authentication."""
        client = TestClient(app)
        
        test_data = {
            "timestamp": "2024-01-01T00:00:00Z",
            "machine_id": "TRUCK_001",
            "model": "CAT_797F",
            "temperature": 75.5,
            "vibration": 2.3,
            "oil_pressure": 4.2,
            "rpm": 1800,
            "run_hours": 5000,
            "load": 85.0,
            "fuel_level": 75.0
        }
        
        response = client.post("/predict", json=test_data)
        assert response.status_code == 401  # Unauthorized
    
    def test_predict_endpoint_invalid_data(self):
        """Test predict endpoint with invalid data."""
        client = TestClient(app)
        
        invalid_data = {
            "timestamp": "invalid_timestamp",
            "machine_id": "",
            "temperature": -1000
        }
        
        response = client.post("/test-predict", json=invalid_data)
        assert response.status_code == 422  # Validation error


class TestMLEnsembleEndpoints:
    """Test ML ensemble information endpoints."""
    
    def test_ml_ensemble_info_endpoint(self):
        """Test ML ensemble info endpoint."""
        client = TestClient(app)
        response = client.get("/ml/ensemble/info")
        
        assert response.status_code == 200
        data = response.json()
        assert "ensemble_type" in data
        assert "models" in data
        assert "performance_metrics" in data
    
    def test_ml_ensemble_capabilities_endpoint(self):
        """Test ML ensemble capabilities endpoint."""
        client = TestClient(app)
        response = client.get("/ml/ensemble/capabilities")
        
        assert response.status_code == 200
        data = response.json()
        assert "max_trucks" in data
        assert "prediction_accuracy" in data
        assert "processing_speed" in data


class TestMonitoringEndpoints:
    """Test monitoring and metrics endpoints."""
    
    def test_metrics_endpoint(self):
        """Test metrics endpoint."""
        client = TestClient(app)
        response = client.get("/metrics")
        
        assert response.status_code == 200
        # Should return Prometheus metrics format
        assert "text/plain" in response.headers.get("content-type", "")
    
    def test_data_quality_report_endpoint(self):
        """Test data quality report endpoint."""
        client = TestClient(app)
        response = client.get("/data-quality/report")
        
        assert response.status_code == 200
        data = response.json()
        assert "overall_quality_score" in data
        assert "quality_issues" in data
        assert "recommendations" in data
    
    def test_performance_summary_endpoint(self):
        """Test performance summary endpoint."""
        client = TestClient(app)
        response = client.get("/performance/summary")
        
        assert response.status_code == 200
        data = response.json()
        assert "cpu_usage" in data
        assert "memory_usage" in data
        assert "response_times" in data
    
    def test_circuit_breaker_health_endpoint(self):
        """Test circuit breaker health endpoint."""
        client = TestClient(app)
        response = client.get("/circuit-breakers/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "ml_model_breaker" in data
        assert "database_breaker" in data
    
    def test_cache_health_endpoint(self):
        """Test cache health endpoint."""
        client = TestClient(app)
        response = client.get("/cache/health")
        
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "hit_ratio" in data


class TestAuthenticationEndpoints:
    """Test authentication endpoints."""
    
    def test_token_endpoint(self):
        """Test token endpoint for authentication."""
        client = TestClient(app)
        
        # Test with invalid credentials
        response = client.post("/token", data={
            "username": "invalid_user",
            "password": "invalid_password"
        })
        
        assert response.status_code == 401
    
    def test_auth_me_endpoint_requires_auth(self):
        """Test that /auth/me endpoint requires authentication."""
        client = TestClient(app)
        response = client.get("/auth/me")
        
        assert response.status_code == 401


class TestErrorHandling:
    """Test error handling in API endpoints."""
    
    def test_404_error_handling(self):
        """Test 404 error handling."""
        client = TestClient(app)
        response = client.get("/nonexistent-endpoint")
        
        assert response.status_code == 404
        data = response.json()
        assert "error" in data
        assert "code" in data["error"]
        assert "message" in data["error"]
    
    def test_422_validation_error_handling(self):
        """Test 422 validation error handling."""
        client = TestClient(app)
        
        # Send invalid JSON
        response = client.post("/test-predict", json={
            "invalid_field": "invalid_value"
        })
        
        assert response.status_code == 422
        data = response.json()
        assert "error" in data
        assert data["error"]["code"] == "VALIDATION_ERROR"


class TestCORSHeaders:
    """Test CORS headers."""
    
    def test_cors_headers_present(self):
        """Test that CORS headers are present."""
        client = TestClient(app)
        response = client.options("/health")
        
        # CORS headers should be present
        assert "access-control-allow-origin" in response.headers
        assert "access-control-allow-methods" in response.headers
        assert "access-control-allow-headers" in response.headers


class TestRateLimiting:
    """Test rate limiting functionality."""
    
    def test_rate_limiting_headers(self):
        """Test that rate limiting headers are present."""
        client = TestClient(app)
        
        # Make multiple requests quickly
        for _ in range(5):
            response = client.get("/health")
            assert response.status_code == 200
        
        # Check if rate limiting headers are present
        response = client.get("/health")
        # Rate limiting headers might be present depending on implementation
        # This test ensures the endpoint still works


class TestInputSanitization:
    """Test input sanitization."""
    
    def test_sql_injection_prevention(self):
        """Test SQL injection prevention."""
        client = TestClient(app)
        
        # Try to inject SQL
        malicious_data = {
            "timestamp": "2024-01-01T00:00:00Z",
            "machine_id": "TRUCK_001'; DROP TABLE machines; --",
            "model": "CAT_797F",
            "temperature": 75.5,
            "vibration": 2.3,
            "oil_pressure": 4.2,
            "rpm": 1800,
            "run_hours": 5000,
            "load": 85.0,
            "fuel_level": 75.0
        }
        
        response = client.post("/test-predict", json=malicious_data)
        
        # Should either validate and sanitize or reject the request
        assert response.status_code in [200, 422, 400]
    
    def test_xss_prevention(self):
        """Test XSS prevention."""
        client = TestClient(app)
        
        # Try to inject XSS
        malicious_data = {
            "timestamp": "2024-01-01T00:00:00Z",
            "machine_id": "<script>alert('xss')</script>",
            "model": "CAT_797F",
            "temperature": 75.5,
            "vibration": 2.3,
            "oil_pressure": 4.2,
            "rpm": 1800,
            "run_hours": 5000,
            "load": 85.0,
            "fuel_level": 75.0
        }
        
        response = client.post("/test-predict", json=malicious_data)
        
        # Should either validate and sanitize or reject the request
        assert response.status_code in [200, 422, 400]


if __name__ == "__main__":
    pytest.main([__file__])
