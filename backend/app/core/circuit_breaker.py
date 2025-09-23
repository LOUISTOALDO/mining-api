"""
Circuit breaker pattern implementation for system reliability.
Prevents cascade failures when external services or ML models fail.
Critical for maintaining 99.9% uptime with 450 trucks.
"""

import time
import asyncio
from enum import Enum
from typing import Callable, Any, Optional, Dict, List
from dataclasses import dataclass
from loguru import logger
from datetime import datetime, timedelta

class CircuitState(Enum):
    """Circuit breaker states."""
    CLOSED = "closed"      # Normal operation
    OPEN = "open"          # Circuit is open, failing fast
    HALF_OPEN = "half_open"  # Testing if service is back

@dataclass
class CircuitBreakerConfig:
    """Configuration for circuit breaker."""
    failure_threshold: int = 5        # Number of failures before opening
    timeout: int = 60                 # Time in seconds before trying again
    success_threshold: int = 3        # Successes needed to close from half-open
    expected_exception: type = Exception  # Exception type to catch

class CircuitBreaker:
    """Circuit breaker implementation with configurable thresholds."""
    
    def __init__(self, name: str, config: CircuitBreakerConfig = None):
        self.name = name
        self.config = config or CircuitBreakerConfig()
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = None
        self.last_success_time = None
        self.total_requests = 0
        self.total_failures = 0
        self.total_successes = 0
        
        # Statistics
        self.stats = {
            'total_requests': 0,
            'total_failures': 0,
            'total_successes': 0,
            'circuit_opens': 0,
            'circuit_closes': 0,
            'last_reset': datetime.now()
        }
    
    def call(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection."""
        self.total_requests += 1
        self.stats['total_requests'] += 1
        
        # Check if circuit is open
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
                logger.info(f"Circuit breaker {self.name} transitioning to HALF_OPEN")
            else:
                self.stats['total_failures'] += 1
                raise Exception(f"Circuit breaker {self.name} is OPEN")
        
        try:
            # Execute the function
            result = func(*args, **kwargs)
            self._on_success()
            return result
            
        except self.config.expected_exception as e:
            self._on_failure()
            raise e
        except Exception as e:
            # Unexpected exceptions don't count toward circuit breaker
            logger.warning(f"Unexpected exception in circuit breaker {self.name}: {e}")
            raise e
    
    async def call_async(self, func: Callable, *args, **kwargs) -> Any:
        """Execute async function with circuit breaker protection."""
        self.total_requests += 1
        self.stats['total_requests'] += 1
        
        # Check if circuit is open
        if self.state == CircuitState.OPEN:
            if self._should_attempt_reset():
                self.state = CircuitState.HALF_OPEN
                logger.info(f"Circuit breaker {self.name} transitioning to HALF_OPEN")
            else:
                self.stats['total_failures'] += 1
                raise Exception(f"Circuit breaker {self.name} is OPEN")
        
        try:
            # Execute the async function
            result = await func(*args, **kwargs)
            self._on_success()
            return result
            
        except self.config.expected_exception as e:
            self._on_failure()
            raise e
        except Exception as e:
            # Unexpected exceptions don't count toward circuit breaker
            logger.warning(f"Unexpected exception in circuit breaker {self.name}: {e}")
            raise e
    
    def _should_attempt_reset(self) -> bool:
        """Check if enough time has passed to attempt reset."""
        if self.last_failure_time is None:
            return True
        
        time_since_failure = time.time() - self.last_failure_time
        return time_since_failure >= self.config.timeout
    
    def _on_success(self):
        """Handle successful execution."""
        self.last_success_time = time.time()
        self.total_successes += 1
        self.stats['total_successes'] += 1
        
        if self.state == CircuitState.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.config.success_threshold:
                self._close_circuit()
        elif self.state == CircuitState.CLOSED:
            # Reset failure count on success
            self.failure_count = 0
    
    def _on_failure(self):
        """Handle failed execution."""
        self.last_failure_time = time.time()
        self.failure_count += 1
        self.total_failures += 1
        self.stats['total_failures'] += 1
        
        if self.state == CircuitState.HALF_OPEN:
            # Any failure in half-open state opens the circuit
            self._open_circuit()
        elif self.state == CircuitState.CLOSED:
            if self.failure_count >= self.config.failure_threshold:
                self._open_circuit()
    
    def _open_circuit(self):
        """Open the circuit breaker."""
        self.state = CircuitState.OPEN
        self.success_count = 0
        self.stats['circuit_opens'] += 1
        logger.warning(f"Circuit breaker {self.name} opened after {self.failure_count} failures")
    
    def _close_circuit(self):
        """Close the circuit breaker."""
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.stats['circuit_closes'] += 1
        self.stats['last_reset'] = datetime.now()
        logger.info(f"Circuit breaker {self.name} closed after {self.config.success_threshold} successes")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get circuit breaker statistics."""
        success_rate = (self.total_successes / self.total_requests * 100) if self.total_requests > 0 else 0
        
        return {
            'name': self.name,
            'state': self.state.value,
            'failure_count': self.failure_count,
            'success_count': self.success_count,
            'total_requests': self.total_requests,
            'total_failures': self.total_failures,
            'total_successes': self.total_successes,
            'success_rate': round(success_rate, 2),
            'last_failure_time': self.last_failure_time,
            'last_success_time': self.last_success_time,
            'stats': self.stats
        }
    
    def reset(self):
        """Manually reset the circuit breaker."""
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = None
        self.stats['last_reset'] = datetime.now()
        logger.info(f"Circuit breaker {self.name} manually reset")

class CircuitBreakerManager:
    """Manages multiple circuit breakers."""
    
    def __init__(self):
        self.breakers: Dict[str, CircuitBreaker] = {}
    
    def get_breaker(self, name: str, config: CircuitBreakerConfig = None) -> CircuitBreaker:
        """Get or create a circuit breaker."""
        if name not in self.breakers:
            self.breakers[name] = CircuitBreaker(name, config)
        return self.breakers[name]
    
    def get_all_stats(self) -> Dict[str, Dict[str, Any]]:
        """Get statistics for all circuit breakers."""
        return {name: breaker.get_stats() for name, breaker in self.breakers.items()}
    
    def reset_all(self):
        """Reset all circuit breakers."""
        for breaker in self.breakers.values():
            breaker.reset()
    
    def reset_breaker(self, name: str):
        """Reset a specific circuit breaker."""
        if name in self.breakers:
            self.breakers[name].reset()

# Global circuit breaker manager
circuit_manager = CircuitBreakerManager()

# Pre-configured circuit breakers for common services
def get_ml_model_breaker() -> CircuitBreaker:
    """Get circuit breaker for ML model operations."""
    config = CircuitBreakerConfig(
        failure_threshold=3,
        timeout=30,
        success_threshold=2,
        expected_exception=Exception
    )
    return circuit_manager.get_breaker("ml_model", config)

def get_database_breaker() -> CircuitBreaker:
    """Get circuit breaker for database operations."""
    config = CircuitBreakerConfig(
        failure_threshold=5,
        timeout=60,
        success_threshold=3,
        expected_exception=Exception
    )
    return circuit_manager.get_breaker("database", config)

def get_external_api_breaker() -> CircuitBreaker:
    """Get circuit breaker for external API calls."""
    config = CircuitBreakerConfig(
        failure_threshold=3,
        timeout=120,
        success_threshold=2,
        expected_exception=Exception
    )
    return circuit_manager.get_breaker("external_api", config)

# Fallback functions for when circuit breakers are open
def fallback_prediction(telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
    """Fallback prediction when ML model circuit breaker is open."""
    logger.warning("Using fallback prediction due to ML model circuit breaker being open")
    
    # Simple rule-based prediction
    health_score = 100.0
    
    # Temperature-based health deduction
    temp = telemetry_data.get('temperature', 80)
    if temp > 90:
        health_score -= 20
    elif temp > 85:
        health_score -= 10
    
    # Vibration-based health deduction
    vibration = telemetry_data.get('vibration', 1.5)
    if vibration > 5:
        health_score -= 25
    elif vibration > 3:
        health_score -= 15
    
    # Oil pressure-based health deduction
    oil_pressure = telemetry_data.get('oil_pressure', 3.5)
    if oil_pressure < 2:
        health_score -= 30
    elif oil_pressure < 3:
        health_score -= 15
    
    # Fuel level-based health deduction
    fuel_level = telemetry_data.get('fuel_level', 75)
    if fuel_level < 10:
        health_score -= 20
    elif fuel_level < 25:
        health_score -= 10
    
    return {
        "predicted_health_score": max(0, health_score),
        "prediction_type": "fallback",
        "model_version": "rule_based_v1",
        "confidence": 0.6,
        "circuit_breaker_active": True
    }

def fallback_telemetry_processing(telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
    """Fallback telemetry processing when database circuit breaker is open."""
    logger.warning("Using fallback telemetry processing due to database circuit breaker being open")
    
    # Basic validation and processing without database storage
    processed_data = {
        "machine_id": telemetry_data.get('machine_id'),
        "timestamp": telemetry_data.get('timestamp'),
        "processed_at": datetime.now().isoformat(),
        "status": "processed_fallback",
        "data_quality": "unknown"
    }
    
    return processed_data

# Decorator for automatic circuit breaker protection
def with_circuit_breaker(breaker_name: str, fallback_func: Callable = None, config: CircuitBreakerConfig = None):
    """Decorator to add circuit breaker protection to functions."""
    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            breaker = circuit_manager.get_breaker(breaker_name, config)
            try:
                return await breaker.call_async(func, *args, **kwargs)
            except Exception as e:
                if fallback_func and breaker.state == CircuitState.OPEN:
                    logger.warning(f"Using fallback for {func.__name__} due to circuit breaker")
                    return fallback_func(*args, **kwargs)
                raise e
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            breaker = circuit_manager.get_breaker(breaker_name, config)
            try:
                return breaker.call(func, *args, **kwargs)
            except Exception as e:
                if fallback_func and breaker.state == CircuitState.OPEN:
                    logger.warning(f"Using fallback for {func.__name__} due to circuit breaker")
                    return fallback_func(*args, **kwargs)
                raise e
        
        return async_wrapper if asyncio.iscoroutinefunction(func) else sync_wrapper
    return decorator

# Health check endpoint for circuit breakers
def get_circuit_breaker_health() -> Dict[str, Any]:
    """Get health status of all circuit breakers."""
    all_stats = circuit_manager.get_all_stats()
    
    overall_health = "healthy"
    open_breakers = []
    
    for name, stats in all_stats.items():
        if stats['state'] == 'open':
            overall_health = "degraded"
            open_breakers.append(name)
    
    return {
        "overall_health": overall_health,
        "open_breakers": open_breakers,
        "total_breakers": len(all_stats),
        "breaker_stats": all_stats
    }
