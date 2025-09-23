"""
Structured logging system for comprehensive debugging and monitoring.
Essential for tracking 450 trucks and debugging issues efficiently.
"""

import structlog
import json
import time
from typing import Dict, Any, Optional, List
from datetime import datetime
from contextvars import ContextVar
from loguru import logger

# Context variables for request tracking
request_id_var: ContextVar[Optional[str]] = ContextVar('request_id', default=None)
user_id_var: ContextVar[Optional[str]] = ContextVar('user_id', default=None)
machine_id_var: ContextVar[Optional[str]] = ContextVar('machine_id', default=None)

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

class StructuredLogger:
    """Enhanced structured logger with context awareness."""
    
    def __init__(self, name: str = "mining_pdm"):
        self.logger = structlog.get_logger(name)
        self._context = {}
    
    def bind_context(self, **kwargs) -> 'StructuredLogger':
        """Bind additional context to the logger."""
        new_logger = StructuredLogger()
        new_logger.logger = self.logger.bind(**kwargs)
        new_logger._context = {**self._context, **kwargs}
        return new_logger
    
    def info(self, message: str, **kwargs):
        """Log info message with structured data."""
        self.logger.info(message, **self._get_context(**kwargs))
    
    def warning(self, message: str, **kwargs):
        """Log warning message with structured data."""
        self.logger.warning(message, **self._get_context(**kwargs))
    
    def error(self, message: str, **kwargs):
        """Log error message with structured data."""
        self.logger.error(message, **self._get_context(**kwargs))
    
    def debug(self, message: str, **kwargs):
        """Log debug message with structured data."""
        self.logger.debug(message, **self._get_context(**kwargs))
    
    def _get_context(self, **kwargs) -> Dict[str, Any]:
        """Get full context including request, user, and machine info."""
        context = {
            **self._context,
            **kwargs,
            "request_id": request_id_var.get(),
            "user_id": user_id_var.get(),
            "machine_id": machine_id_var.get(),
            "timestamp": datetime.utcnow().isoformat()
        }
        return {k: v for k, v in context.items() if v is not None}

class TruckLogger:
    """Specialized logger for truck/machine operations."""
    
    def __init__(self, machine_id: str, user_id: Optional[str] = None):
        self.machine_id = machine_id
        self.user_id = user_id
        self.logger = StructuredLogger("truck_operations").bind_context(
            machine_id=machine_id,
            user_id=user_id
        )
    
    def log_telemetry_ingestion(self, data_points: int, processing_time: float, 
                               validation_status: str = "valid"):
        """Log telemetry data ingestion."""
        self.logger.info("Telemetry ingested successfully",
                        data_points=data_points,
                        processing_time_ms=round(processing_time * 1000, 2),
                        validation_status=validation_status,
                        event_type="telemetry_ingestion")
    
    def log_prediction(self, prediction: float, processing_time: float, 
                      model_version: str, confidence: Optional[float] = None):
        """Log prediction completion."""
        self.logger.info("Prediction completed",
                        prediction=round(prediction, 4),
                        processing_time_ms=round(processing_time * 1000, 2),
                        model_version=model_version,
                        confidence=confidence,
                        event_type="prediction")
    
    def log_alert_generated(self, alert_type: str, severity: str, 
                           threshold_value: float, actual_value: float):
        """Log alert generation."""
        self.logger.warning("Alert generated",
                           alert_type=alert_type,
                           severity=severity,
                           threshold_value=threshold_value,
                           actual_value=actual_value,
                           event_type="alert_generated")
    
    def log_maintenance_scheduled(self, maintenance_type: str, 
                                 scheduled_date: str, estimated_duration: int):
        """Log maintenance scheduling."""
        self.logger.info("Maintenance scheduled",
                        maintenance_type=maintenance_type,
                        scheduled_date=scheduled_date,
                        estimated_duration_hours=estimated_duration,
                        event_type="maintenance_scheduled")
    
    def log_error(self, error: str, error_type: str, operation: str):
        """Log operational errors."""
        self.logger.error("Operation failed",
                         error=error,
                         error_type=error_type,
                         operation=operation,
                         event_type="error")
    
    def log_performance_issue(self, metric: str, value: float, 
                             threshold: float, impact: str):
        """Log performance issues."""
        self.logger.warning("Performance issue detected",
                           metric=metric,
                           value=value,
                           threshold=threshold,
                           impact=impact,
                           event_type="performance_issue")

class APILogger:
    """Specialized logger for API operations."""
    
    def __init__(self, endpoint: str, method: str, user_id: Optional[str] = None):
        self.endpoint = endpoint
        self.method = method
        self.user_id = user_id
        self.logger = StructuredLogger("api_operations").bind_context(
            endpoint=endpoint,
            method=method,
            user_id=user_id
        )
    
    def log_request_start(self, request_id: str, **kwargs):
        """Log API request start."""
        self.logger.info("API request started",
                        request_id=request_id,
                        event_type="request_start",
                        **kwargs)
    
    def log_request_complete(self, request_id: str, status_code: int, 
                           processing_time: float, **kwargs):
        """Log API request completion."""
        self.logger.info("API request completed",
                        request_id=request_id,
                        status_code=status_code,
                        processing_time_ms=round(processing_time * 1000, 2),
                        event_type="request_complete",
                        **kwargs)
    
    def log_request_error(self, request_id: str, error: str, 
                         status_code: int, processing_time: float):
        """Log API request errors."""
        self.logger.error("API request failed",
                         request_id=request_id,
                         error=error,
                         status_code=status_code,
                         processing_time_ms=round(processing_time * 1000, 2),
                         event_type="request_error")
    
    def log_rate_limit_hit(self, request_id: str, limit_type: str, 
                          remaining_requests: int):
        """Log rate limiting events."""
        self.logger.warning("Rate limit exceeded",
                           request_id=request_id,
                           limit_type=limit_type,
                           remaining_requests=remaining_requests,
                           event_type="rate_limit_hit")

class SystemLogger:
    """Specialized logger for system operations."""
    
    def __init__(self):
        self.logger = StructuredLogger("system_operations")
    
    def log_database_operation(self, operation: str, table: str, 
                              duration: float, rows_affected: int = 0):
        """Log database operations."""
        self.logger.info("Database operation completed",
                        operation=operation,
                        table=table,
                        duration_ms=round(duration * 1000, 2),
                        rows_affected=rows_affected,
                        event_type="database_operation")
    
    def log_cache_operation(self, operation: str, key: str, 
                           hit: bool, duration: float):
        """Log cache operations."""
        self.logger.info("Cache operation completed",
                        operation=operation,
                        cache_key=key,
                        cache_hit=hit,
                        duration_ms=round(duration * 1000, 2),
                        event_type="cache_operation")
    
    def log_model_operation(self, operation: str, model_version: str, 
                           duration: float, success: bool):
        """Log ML model operations."""
        self.logger.info("Model operation completed",
                        operation=operation,
                        model_version=model_version,
                        duration_ms=round(duration * 1000, 2),
                        success=success,
                        event_type="model_operation")
    
    def log_system_health(self, component: str, status: str, 
                         metrics: Dict[str, Any]):
        """Log system health status."""
        self.logger.info("System health check",
                        component=component,
                        status=status,
                        metrics=metrics,
                        event_type="system_health")

class LoggingMiddleware:
    """Middleware for automatic request logging."""
    
    def __init__(self):
        self.logger = StructuredLogger("request_middleware")
    
    async def log_request(self, request, call_next):
        """Log incoming requests and responses."""
        request_id = f"req_{int(time.time() * 1000)}"
        request_id_var.set(request_id)
        
        start_time = time.time()
        
        # Log request start
        api_logger = APILogger(
            endpoint=request.url.path,
            method=request.method,
            user_id=getattr(request.state, 'user_id', None)
        )
        
        api_logger.log_request_start(request_id)
        
        try:
            response = await call_next(request)
            processing_time = time.time() - start_time
            
            # Log successful completion
            api_logger.log_request_complete(
                request_id=request_id,
                status_code=response.status_code,
                processing_time=processing_time
            )
            
            return response
            
        except Exception as e:
            processing_time = time.time() - start_time
            
            # Log error
            api_logger.log_request_error(
                request_id=request_id,
                error=str(e),
                status_code=500,
                processing_time=processing_time
            )
            
            raise

# Global logger instances
system_logger = SystemLogger()
structured_logger = StructuredLogger()

def get_truck_logger(machine_id: str, user_id: Optional[str] = None) -> TruckLogger:
    """Get a truck-specific logger."""
    return TruckLogger(machine_id, user_id)

def get_api_logger(endpoint: str, method: str, user_id: Optional[str] = None) -> APILogger:
    """Get an API-specific logger."""
    return APILogger(endpoint, method, user_id)

def log_feature_engineering_completion(features_count: int, processing_time: float, 
                                     machine_id: Optional[str] = None):
    """Log feature engineering completion with context."""
    logger = structured_logger.bind_context(
        machine_id=machine_id,
        event_type="feature_engineering"
    )
    
    logger.info("Feature engineering completed",
               features_count=features_count,
               processing_time_ms=round(processing_time * 1000, 2))

def log_prediction_metrics(prediction: float, confidence: float, 
                          model_version: str, processing_time: float,
                          machine_id: str, user_id: Optional[str] = None):
    """Log prediction metrics with full context."""
    logger = structured_logger.bind_context(
        machine_id=machine_id,
        user_id=user_id,
        event_type="prediction_metrics"
    )
    
    logger.info("Prediction metrics",
               prediction=round(prediction, 4),
               confidence=round(confidence, 4),
               model_version=model_version,
               processing_time_ms=round(processing_time * 1000, 2))
