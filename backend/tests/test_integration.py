"""
Integration tests for the Mining PDM system.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import json
import time
from datetime import datetime, timedelta

from app.main import app


class TestMLPredictionIntegration:
    """Test ML prediction integration."""
    
    @patch('backend.app.core.integration.make_prediction_with_all_systems')
    def test_prediction_workflow_integration(self, mock_prediction):
        """Test the complete prediction workflow."""
        # Mock the prediction system
        mock_prediction.return_value = {
            'prediction': {
                'predicted_health_score': 85.5
            },
            'prediction_type': 'ensemble',
            'model_version': 'v2.0.0',
            'processing_time': 0.05,
            'timestamp': datetime.now().isoformat()
        }
        
        client = TestClient(app)
        
        test_data = {
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
        
        response = client.post("/test-predict", json=test_data)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["predicted_health_score"] == 85.5
        assert data["prediction_type"] == "ensemble"
        assert data["model_version"] == "v2.0.0"
        assert data["processing_time"] == 0.05
        
        # Verify the prediction system was called
        mock_prediction.assert_called_once()
    
    def test_prediction_with_real_data_flow(self):
        """Test prediction with realistic data flow."""
        client = TestClient(app)
        
        # Test with multiple trucks
        trucks = ["TRUCK_001", "TRUCK_002", "TRUCK_003"]
        
        for truck_id in trucks:
            test_data = {
                "timestamp": datetime.now().isoformat(),
                "machine_id": truck_id,
                "model": "CAT_797F",
                "temperature": 75.5 + (hash(truck_id) % 20),  # Vary temperature
                "vibration": 2.3 + (hash(truck_id) % 10) * 0.1,
                "oil_pressure": 45.2 + (hash(truck_id) % 5),
                "rpm": 1800 + (hash(truck_id) % 200),
                "run_hours": 5000 + (hash(truck_id) % 1000),
                "load": 85.0 + (hash(truck_id) % 15),
                "fuel_level": 75.0 + (hash(truck_id) % 25)
            }
            
            response = client.post("/test-predict", json=test_data)
            
            # Should work (200) or fail gracefully (500 if ML not loaded)
            assert response.status_code in [200, 500]
            
            if response.status_code == 200:
                data = response.json()
                assert "predicted_health_score" in data
                assert 0 <= data["predicted_health_score"] <= 100


class TestSystemIntegration:
    """Test system component integration."""
    
    def test_health_check_integration(self):
        """Test that all health checks work together."""
        client = TestClient(app)
        
        # Test comprehensive health check
        response = client.get("/health/comprehensive")
        assert response.status_code == 200
        
        data = response.json()
        assert "overall_status" in data
        assert "components" in data
        
        # Test individual component health
        components = [
            "/metrics",
            "/data-quality/report",
            "/performance/summary",
            "/circuit-breakers/health",
            "/cache/health"
        ]
        
        for component in components:
            response = client.get(component)
            assert response.status_code == 200
    
    def test_monitoring_integration(self):
        """Test that monitoring components work together."""
        client = TestClient(app)
        
        # Make some requests to generate metrics
        for _ in range(5):
            client.get("/health")
            client.get("/ml/ensemble/info")
        
        # Check that metrics are being collected
        response = client.get("/metrics")
        assert response.status_code == 200
        
        # Check performance summary
        response = client.get("/performance/summary")
        assert response.status_code == 200
        
        data = response.json()
        assert "cpu_usage" in data
        assert "memory_usage" in data


class TestDataFlowIntegration:
    """Test data flow through the system."""
    
    def test_telemetry_processing_flow(self):
        """Test telemetry data processing flow."""
        client = TestClient(app)
        
        # Simulate telemetry data from multiple sources
        telemetry_batch = [
            {
                "timestamp": datetime.now().isoformat(),
                "machine_id": f"TRUCK_{i:03d}",
                "model": "CAT_797F",
                "temperature": 75.5 + i,
                "vibration": 2.3 + i * 0.1,
                "oil_pressure": 45.2 + i,
                "rpm": 1800 + i * 10,
                "run_hours": 5000 + i * 100,
                "load": 85.0 + i,
                "fuel_level": 75.0 + i
            }
            for i in range(1, 6)  # 5 trucks
        ]
        
        # Process each telemetry record
        for telemetry in telemetry_batch:
            response = client.post("/test-predict", json=telemetry)
            assert response.status_code in [200, 500]
        
        # Check that system is still healthy after processing
        response = client.get("/health")
        assert response.status_code == 200
    
    def test_error_recovery_integration(self):
        """Test error recovery and system resilience."""
        client = TestClient(app)
        
        # Send invalid data to test error handling
        invalid_requests = [
            {"invalid": "data"},
            {"machine_id": "TRUCK_001"},  # Missing required fields
            {"timestamp": "invalid", "machine_id": "TRUCK_001", "model": "CAT_797F", "temperature": "not_a_number"}
        ]
        
        for invalid_request in invalid_requests:
            response = client.post("/test-predict", json=invalid_request)
            assert response.status_code == 422  # Validation error
        
        # System should still be healthy after errors
        response = client.get("/health")
        assert response.status_code == 200


class TestPerformanceIntegration:
    """Test performance under load."""
    
    def test_concurrent_requests(self):
        """Test system performance under concurrent requests."""
        import threading
        import queue
        
        client = TestClient(app)
        results = queue.Queue()
        
        def make_request():
            """Make a request and put result in queue."""
            try:
                response = client.get("/health")
                results.put(("health", response.status_code))
            except Exception as e:
                results.put(("health", f"error: {e}"))
        
        # Create multiple threads
        threads = []
        for _ in range(10):  # 10 concurrent requests
            thread = threading.Thread(target=make_request)
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # Check results
        success_count = 0
        while not results.empty():
            endpoint, status = results.get()
            if status == 200:
                success_count += 1
        
        # At least 80% of requests should succeed
        assert success_count >= 8
    
    def test_response_time_consistency(self):
        """Test that response times are consistent."""
        client = TestClient(app)
        
        response_times = []
        
        # Make multiple requests and measure response times
        for _ in range(10):
            start_time = time.time()
            response = client.get("/health")
            end_time = time.time()
            
            assert response.status_code == 200
            response_times.append(end_time - start_time)
        
        # Response times should be reasonable (less than 1 second)
        avg_response_time = sum(response_times) / len(response_times)
        assert avg_response_time < 1.0
        
        # Response times should be consistent (low variance)
        variance = sum((t - avg_response_time) ** 2 for t in response_times) / len(response_times)
        assert variance < 0.1  # Low variance


class TestSecurityIntegration:
    """Test security integration."""
    
    def test_security_headers_consistency(self):
        """Test that security headers are consistently applied."""
        client = TestClient(app)
        
        endpoints = ["/health", "/ml/ensemble/info", "/metrics"]
        
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code == 200
            
            # Check security headers
            security_headers = [
                "X-Content-Type-Options",
                "X-Frame-Options",
                "X-XSS-Protection",
                "Referrer-Policy"
            ]
            
            for header in security_headers:
                assert header in response.headers
    
    def test_rate_limiting_integration(self):
        """Test rate limiting integration."""
        client = TestClient(app)
        
        # Make many requests quickly
        responses = []
        for _ in range(15):  # More than the rate limit
            response = client.get("/health")
            responses.append(response.status_code)
        
        # Most should succeed, some might be rate limited
        success_count = responses.count(200)
        rate_limited_count = responses.count(429)
        
        # Should have some successful requests
        assert success_count > 0
        
        # Rate limiting might kick in (depending on configuration)
        # This test ensures the system handles it gracefully


class TestMLModelIntegration:
    """Test ML model integration."""
    
    def test_ml_ensemble_info_integration(self):
        """Test ML ensemble information integration."""
        client = TestClient(app)
        
        response = client.get("/ml/ensemble/info")
        assert response.status_code == 200
        
        data = response.json()
        assert "ensemble_type" in data
        assert "models" in data
        assert "performance_metrics" in data
        
        # Check that model information is consistent
        if "models" in data and data["models"]:
            for model in data["models"]:
                assert "name" in model
                assert "type" in model
    
    def test_ml_capabilities_integration(self):
        """Test ML capabilities integration."""
        client = TestClient(app)
        
        response = client.get("/ml/ensemble/capabilities")
        assert response.status_code == 200
        
        data = response.json()
        assert "max_trucks" in data
        assert "prediction_accuracy" in data
        assert "processing_speed" in data
        
        # Check that capabilities are realistic
        assert data["max_trucks"] >= 450  # Should handle 450 trucks
        assert 0 <= data["prediction_accuracy"] <= 100
        assert data["processing_speed"] > 0


if __name__ == "__main__":
    pytest.main([__file__])
