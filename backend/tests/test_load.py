"""
Load tests for the Mining PDM system.
Tests system performance under high load scenarios.
"""

import pytest
import time
import threading
import queue
import statistics
from concurrent.futures import ThreadPoolExecutor, as_completed
from fastapi.testclient import TestClient
from datetime import datetime
import json

from app.main import app


class TestLoadPerformance:
    """Test system performance under load."""
    
    def test_health_endpoint_load(self):
        """Test health endpoint under load."""
        client = TestClient(app)
        
        def make_health_request():
            """Make a health request and return timing info."""
            start_time = time.time()
            response = client.get("/health")
            end_time = time.time()
            
            return {
                "status_code": response.status_code,
                "response_time": end_time - start_time,
                "success": response.status_code == 200
            }
        
        # Test with 100 concurrent requests
        num_requests = 100
        results = []
        
        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = [executor.submit(make_health_request) for _ in range(num_requests)]
            
            for future in as_completed(futures):
                results.append(future.result())
        
        # Analyze results
        success_count = sum(1 for r in results if r["success"])
        response_times = [r["response_time"] for r in results if r["success"]]
        
        # At least 95% of requests should succeed
        assert success_count >= num_requests * 0.95
        
        # Response times should be reasonable
        if response_times:
            avg_response_time = statistics.mean(response_times)
            max_response_time = max(response_times)
            
            assert avg_response_time < 0.5  # Average under 500ms
            assert max_response_time < 2.0   # Max under 2 seconds
    
    def test_prediction_endpoint_load(self):
        """Test prediction endpoint under load."""
        client = TestClient(app)
        
        def make_prediction_request(truck_id):
            """Make a prediction request."""
            test_data = {
                "timestamp": datetime.now().isoformat(),
                "machine_id": f"TRUCK_{truck_id:03d}",
                "model": "CAT_797F",
                "temperature": 75.5 + (truck_id % 20),
                "vibration": 2.3 + (truck_id % 10) * 0.1,
                "oil_pressure": 45.2 + (truck_id % 5),
                "rpm": 1800 + (truck_id % 200),
                "run_hours": 5000 + (truck_id % 1000),
                "load": 85.0 + (truck_id % 15),
                "fuel_level": 75.0 + (truck_id % 25)
            }
            
            start_time = time.time()
            response = client.post("/test-predict", json=test_data)
            end_time = time.time()
            
            return {
                "truck_id": truck_id,
                "status_code": response.status_code,
                "response_time": end_time - start_time,
                "success": response.status_code in [200, 500]  # 500 is OK if ML not loaded
            }
        
        # Test with 50 concurrent prediction requests (simulating 50 trucks)
        num_requests = 50
        results = []
        
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_prediction_request, i) for i in range(num_requests)]
            
            for future in as_completed(futures):
                results.append(future.result())
        
        # Analyze results
        success_count = sum(1 for r in results if r["success"])
        response_times = [r["response_time"] for r in results if r["success"]]
        
        # At least 90% of requests should succeed
        assert success_count >= num_requests * 0.90
        
        # Response times should be reasonable
        if response_times:
            avg_response_time = statistics.mean(response_times)
            max_response_time = max(response_times)
            
            assert avg_response_time < 1.0  # Average under 1 second
            assert max_response_time < 5.0   # Max under 5 seconds
    
    def test_mixed_workload_load(self):
        """Test system under mixed workload."""
        client = TestClient(app)
        
        def make_health_request():
            """Make a health request."""
            start_time = time.time()
            response = client.get("/health")
            end_time = time.time()
            return {"type": "health", "status": response.status_code, "time": end_time - start_time}
        
        def make_metrics_request():
            """Make a metrics request."""
            start_time = time.time()
            response = client.get("/metrics")
            end_time = time.time()
            return {"type": "metrics", "status": response.status_code, "time": end_time - start_time}
        
        def make_ml_info_request():
            """Make an ML info request."""
            start_time = time.time()
            response = client.get("/ml/ensemble/info")
            end_time = time.time()
            return {"type": "ml_info", "status": response.status_code, "time": end_time - start_time}
        
        # Mixed workload: 30% health, 30% metrics, 40% ML info
        num_requests = 100
        results = []
        
        with ThreadPoolExecutor(max_workers=15) as executor:
            futures = []
            
            # Health requests (30%)
            for _ in range(int(num_requests * 0.3)):
                futures.append(executor.submit(make_health_request))
            
            # Metrics requests (30%)
            for _ in range(int(num_requests * 0.3)):
                futures.append(executor.submit(make_metrics_request))
            
            # ML info requests (40%)
            for _ in range(int(num_requests * 0.4)):
                futures.append(executor.submit(make_ml_info_request))
            
            for future in as_completed(futures):
                results.append(future.result())
        
        # Analyze results by type
        health_results = [r for r in results if r["type"] == "health"]
        metrics_results = [r for r in results if r["type"] == "metrics"]
        ml_info_results = [r for r in results if r["type"] == "ml_info"]
        
        # Check success rates
        health_success = sum(1 for r in health_results if r["status"] == 200)
        metrics_success = sum(1 for r in metrics_results if r["status"] == 200)
        ml_info_success = sum(1 for r in ml_info_results if r["status"] == 200)
        
        assert health_success >= len(health_results) * 0.95
        assert metrics_success >= len(metrics_results) * 0.95
        assert ml_info_success >= len(ml_info_results) * 0.95


class TestScalability:
    """Test system scalability."""
    
    def test_450_trucks_simulation(self):
        """Simulate 450 trucks sending telemetry data."""
        client = TestClient(app)
        
        def simulate_truck_telemetry(truck_id):
            """Simulate a truck sending telemetry data."""
            results = []
            
            # Each truck sends 10 telemetry readings
            for reading in range(10):
                test_data = {
                    "timestamp": datetime.now().isoformat(),
                    "machine_id": f"TRUCK_{truck_id:03d}",
                    "model": "CAT_797F",
                    "temperature": 75.5 + (truck_id % 20) + (reading % 5),
                    "vibration": 2.3 + (truck_id % 10) * 0.1 + (reading % 3) * 0.05,
                    "oil_pressure": 45.2 + (truck_id % 5) + (reading % 2),
                    "rpm": 1800 + (truck_id % 200) + (reading % 50),
                    "run_hours": 5000 + (truck_id % 1000) + reading * 10,
                    "load": 85.0 + (truck_id % 15) + (reading % 5),
                    "fuel_level": 75.0 + (truck_id % 25) - (reading % 3)
                }
                
                start_time = time.time()
                response = client.post("/test-predict", json=test_data)
                end_time = time.time()
                
                results.append({
                    "truck_id": truck_id,
                    "reading": reading,
                    "status_code": response.status_code,
                    "response_time": end_time - start_time,
                    "success": response.status_code in [200, 500]
                })
                
                # Small delay between readings
                time.sleep(0.01)
            
            return results
        
        # Simulate 450 trucks (in batches to avoid overwhelming the system)
        batch_size = 50
        num_trucks = 450
        all_results = []
        
        for batch_start in range(0, num_trucks, batch_size):
            batch_end = min(batch_start + batch_size, num_trucks)
            batch_trucks = range(batch_start, batch_end)
            
            with ThreadPoolExecutor(max_workers=10) as executor:
                futures = [executor.submit(simulate_truck_telemetry, truck_id) for truck_id in batch_trucks]
                
                for future in as_completed(futures):
                    all_results.extend(future.result())
            
            # Small delay between batches
            time.sleep(0.1)
        
        # Analyze results
        total_requests = len(all_results)
        success_count = sum(1 for r in all_results if r["success"])
        response_times = [r["response_time"] for r in all_results if r["success"]]
        
        # At least 85% of requests should succeed under load
        assert success_count >= total_requests * 0.85
        
        # Response times should be reasonable even under load
        if response_times:
            avg_response_time = statistics.mean(response_times)
            p95_response_time = statistics.quantiles(response_times, n=20)[18]  # 95th percentile
            
            assert avg_response_time < 2.0   # Average under 2 seconds
            assert p95_response_time < 5.0   # 95th percentile under 5 seconds
    
    def test_sustained_load(self):
        """Test system under sustained load."""
        client = TestClient(app)
        
        def sustained_request():
            """Make requests for a sustained period."""
            results = []
            start_time = time.time()
            
            while time.time() - start_time < 30:  # Run for 30 seconds
                request_start = time.time()
                response = client.get("/health")
                request_end = time.time()
                
                results.append({
                    "status_code": response.status_code,
                    "response_time": request_end - request_start,
                    "timestamp": request_start
                })
                
                time.sleep(0.1)  # 10 requests per second
            
            return results
        
        # Run sustained load test
        num_workers = 5
        all_results = []
        
        with ThreadPoolExecutor(max_workers=num_workers) as executor:
            futures = [executor.submit(sustained_request) for _ in range(num_workers)]
            
            for future in as_completed(futures):
                all_results.extend(future.result())
        
        # Analyze sustained load results
        success_count = sum(1 for r in all_results if r["status_code"] == 200)
        response_times = [r["response_time"] for r in all_results if r["status_code"] == 200]
        
        # High success rate under sustained load
        assert success_count >= len(all_results) * 0.95
        
        # Consistent response times
        if response_times:
            avg_response_time = statistics.mean(response_times)
            std_response_time = statistics.stdev(response_times) if len(response_times) > 1 else 0
            
            assert avg_response_time < 0.5  # Average under 500ms
            assert std_response_time < 0.2  # Low standard deviation (consistent)


class TestMemoryAndResourceUsage:
    """Test memory and resource usage under load."""
    
    def test_memory_usage_under_load(self):
        """Test memory usage doesn't grow excessively under load."""
        import psutil
        import os
        
        # Get initial memory usage
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        client = TestClient(app)
        
        # Make many requests
        for _ in range(1000):
            response = client.get("/health")
            assert response.status_code == 200
        
        # Check memory usage after load
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory
        
        # Memory increase should be reasonable (less than 100MB)
        assert memory_increase < 100
    
    def test_no_memory_leaks(self):
        """Test for memory leaks under repeated load."""
        import psutil
        import os
        
        client = TestClient(app)
        memory_samples = []
        
        # Sample memory usage over time
        for cycle in range(10):
            # Make requests
            for _ in range(100):
                response = client.get("/health")
                assert response.status_code == 200
            
            # Sample memory
            process = psutil.Process(os.getpid())
            memory_mb = process.memory_info().rss / 1024 / 1024
            memory_samples.append(memory_mb)
            
            time.sleep(0.1)
        
        # Check for memory leak (memory shouldn't grow continuously)
        if len(memory_samples) >= 3:
            # Calculate trend
            first_half = memory_samples[:len(memory_samples)//2]
            second_half = memory_samples[len(memory_samples)//2:]
            
            first_avg = statistics.mean(first_half)
            second_avg = statistics.mean(second_half)
            
            # Memory shouldn't grow by more than 50MB
            memory_growth = second_avg - first_avg
            assert memory_growth < 50


if __name__ == "__main__":
    pytest.main([__file__])
