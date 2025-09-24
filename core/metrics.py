"""
Custom metrics and monitoring system for tracking 450 trucks.
Provides comprehensive observability for system performance and business metrics.
"""

import time
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from prometheus_client import Counter, Histogram, Gauge, Summary, generate_latest, CollectorRegistry
from prometheus_client.core import REGISTRY
import threading
from collections import defaultdict, deque
from loguru import logger

# Create a custom registry for our metrics
metrics_registry = CollectorRegistry()

# Core API Metrics
API_REQUESTS_TOTAL = Counter(
    'api_requests_total',
    'Total number of API requests',
    ['method', 'endpoint', 'status_code'],
    registry=metrics_registry
)

API_REQUEST_DURATION = Histogram(
    'api_request_duration_seconds',
    'API request duration in seconds',
    ['method', 'endpoint'],
    buckets=[0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0],
    registry=metrics_registry
)

# Truck/Equipment Metrics
TELEMETRY_INGESTED_TOTAL = Counter(
    'telemetry_ingested_total',
    'Total telemetry records ingested',
    ['machine_id', 'status'],
    registry=metrics_registry
)

PREDICTIONS_TOTAL = Counter(
    'predictions_total',
    'Total predictions made',
    ['machine_id', 'model_version', 'status'],
    registry=metrics_registry
)

PREDICTION_DURATION = Histogram(
    'prediction_duration_seconds',
    'Prediction processing duration',
    ['model_version'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0],
    registry=metrics_registry
)

ACTIVE_MACHINES = Gauge(
    'active_machines_total',
    'Number of active machines sending data',
    registry=metrics_registry
)

MACHINE_HEALTH_SCORES = Gauge(
    'machine_health_score',
    'Current health score for each machine',
    ['machine_id'],
    registry=metrics_registry
)

# System Performance Metrics
DATABASE_OPERATIONS_TOTAL = Counter(
    'database_operations_total',
    'Total database operations',
    ['operation', 'table', 'status'],
    registry=metrics_registry
)

DATABASE_OPERATION_DURATION = Histogram(
    'database_operation_duration_seconds',
    'Database operation duration',
    ['operation', 'table'],
    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.0, 5.0],
    registry=metrics_registry
)

CACHE_OPERATIONS_TOTAL = Counter(
    'cache_operations_total',
    'Total cache operations',
    ['operation', 'status'],
    registry=metrics_registry
)

CACHE_HIT_RATIO = Gauge(
    'cache_hit_ratio',
    'Cache hit ratio percentage',
    registry=metrics_registry
)

# Business Metrics
ALERTS_GENERATED_TOTAL = Counter(
    'alerts_generated_total',
    'Total alerts generated',
    ['machine_id', 'alert_type', 'severity'],
    registry=metrics_registry
)

MAINTENANCE_EVENTS_TOTAL = Counter(
    'maintenance_events_total',
    'Total maintenance events',
    ['machine_id', 'maintenance_type', 'status'],
    registry=metrics_registry
)

COST_SAVINGS_ESTIMATED = Gauge(
    'cost_savings_estimated_dollars',
    'Estimated cost savings from predictive maintenance',
    registry=metrics_registry
)

# System Health Metrics
SYSTEM_UPTIME = Gauge(
    'system_uptime_seconds',
    'System uptime in seconds',
    registry=metrics_registry
)

MEMORY_USAGE = Gauge(
    'memory_usage_bytes',
    'Memory usage in bytes',
    ['type'],
    registry=metrics_registry
)

CPU_USAGE = Gauge(
    'cpu_usage_percent',
    'CPU usage percentage',
    registry=metrics_registry
)

class MetricsCollector:
    """Centralized metrics collection and management."""
    
    def __init__(self):
        self.start_time = time.time()
        self.machine_stats = defaultdict(lambda: {
            'last_seen': None,
            'total_telemetry': 0,
            'total_predictions': 0,
            'avg_health_score': 0,
            'alerts_count': 0
        })
        self.system_stats = {
            'total_requests': 0,
            'total_errors': 0,
            'total_predictions': 0,
            'total_telemetry': 0
        }
        self._lock = threading.Lock()
    
    def record_api_request(self, method: str, endpoint: str, status_code: int, duration: float):
        """Record API request metrics."""
        with self._lock:
            API_REQUESTS_TOTAL.labels(
                method=method,
                endpoint=endpoint,
                status_code=str(status_code)
            ).inc()
            
            API_REQUEST_DURATION.labels(
                method=method,
                endpoint=endpoint
            ).observe(duration)
            
            self.system_stats['total_requests'] += 1
            if status_code >= 400:
                self.system_stats['total_errors'] += 1
    
    def record_telemetry_ingestion(self, machine_id: str, status: str = 'success'):
        """Record telemetry ingestion metrics."""
        with self._lock:
            TELEMETRY_INGESTED_TOTAL.labels(
                machine_id=machine_id,
                status=status
            ).inc()
            
            self.machine_stats[machine_id]['total_telemetry'] += 1
            self.machine_stats[machine_id]['last_seen'] = datetime.now()
            self.system_stats['total_telemetry'] += 1
    
    def record_prediction(self, machine_id: str, model_version: str, 
                         status: str, duration: float, health_score: float = None):
        """Record prediction metrics."""
        with self._lock:
            PREDICTIONS_TOTAL.labels(
                machine_id=machine_id,
                model_version=model_version,
                status=status
            ).inc()
            
            PREDICTION_DURATION.labels(
                model_version=model_version
            ).observe(duration)
            
            if health_score is not None:
                MACHINE_HEALTH_SCORES.labels(machine_id=machine_id).set(health_score)
            
            self.machine_stats[machine_id]['total_predictions'] += 1
            if health_score is not None:
                # Update average health score
                current_avg = self.machine_stats[machine_id]['avg_health_score']
                total_preds = self.machine_stats[machine_id]['total_predictions']
                new_avg = ((current_avg * (total_preds - 1)) + health_score) / total_preds
                self.machine_stats[machine_id]['avg_health_score'] = new_avg
            
            self.system_stats['total_predictions'] += 1
    
    def record_database_operation(self, operation: str, table: str, 
                                 status: str, duration: float):
        """Record database operation metrics."""
        DATABASE_OPERATIONS_TOTAL.labels(
            operation=operation,
            table=table,
            status=status
        ).inc()
        
        DATABASE_OPERATION_DURATION.labels(
            operation=operation,
            table=table
        ).observe(duration)
    
    def record_cache_operation(self, operation: str, status: str, hit: bool = None):
        """Record cache operation metrics."""
        CACHE_OPERATIONS_TOTAL.labels(
            operation=operation,
            status=status
        ).inc()
        
        if hit is not None:
            # Update cache hit ratio
            # This is a simplified calculation - in production you'd want more sophisticated tracking
            pass
    
    def record_alert(self, machine_id: str, alert_type: str, severity: str):
        """Record alert generation metrics."""
        ALERTS_GENERATED_TOTAL.labels(
            machine_id=machine_id,
            alert_type=alert_type,
            severity=severity
        ).inc()
        
        with self._lock:
            self.machine_stats[machine_id]['alerts_count'] += 1
    
    def record_maintenance_event(self, machine_id: str, maintenance_type: str, status: str):
        """Record maintenance event metrics."""
        MAINTENANCE_EVENTS_TOTAL.labels(
            machine_id=machine_id,
            maintenance_type=maintenance_type,
            status=status
        ).inc()
    
    def update_system_metrics(self):
        """Update system-level metrics."""
        # Update uptime
        uptime = time.time() - self.start_time
        SYSTEM_UPTIME.set(uptime)
        
        # Update active machines count
        active_machines = 0
        cutoff_time = datetime.now() - timedelta(minutes=5)  # Active within last 5 minutes
        
        with self._lock:
            for machine_id, stats in self.machine_stats.items():
                if stats['last_seen'] and stats['last_seen'] > cutoff_time:
                    active_machines += 1
        
        ACTIVE_MACHINES.set(active_machines)
        
        # Update cost savings (simplified calculation)
        # In production, this would be more sophisticated
        estimated_savings = self.system_stats['total_predictions'] * 1000  # $1000 per prediction
        COST_SAVINGS_ESTIMATED.set(estimated_savings)
    
    def get_machine_stats(self, machine_id: str) -> Dict[str, Any]:
        """Get statistics for a specific machine."""
        with self._lock:
            stats = self.machine_stats.get(machine_id, {})
            return {
                'machine_id': machine_id,
                'last_seen': stats.get('last_seen'),
                'total_telemetry': stats.get('total_telemetry', 0),
                'total_predictions': stats.get('total_predictions', 0),
                'avg_health_score': stats.get('avg_health_score', 0),
                'alerts_count': stats.get('alerts_count', 0)
            }
    
    def get_system_stats(self) -> Dict[str, Any]:
        """Get overall system statistics."""
        with self._lock:
            return {
                'total_requests': self.system_stats['total_requests'],
                'total_errors': self.system_stats['total_errors'],
                'total_predictions': self.system_stats['total_predictions'],
                'total_telemetry': self.system_stats['total_telemetry'],
                'active_machines': len([m for m in self.machine_stats.values() 
                                      if m['last_seen'] and m['last_seen'] > datetime.now() - timedelta(minutes=5)]),
                'uptime_seconds': time.time() - self.start_time
            }

class MetricsMiddleware:
    """Middleware for automatic metrics collection."""
    
    def __init__(self, metrics_collector: MetricsCollector):
        self.metrics = metrics_collector
    
    async def process_request(self, request, call_next):
        """Process request and collect metrics."""
        start_time = time.time()
        
        try:
            response = await call_next(request)
            duration = time.time() - start_time
            
            # Record metrics
            self.metrics.record_api_request(
                method=request.method,
                endpoint=request.url.path,
                status_code=response.status_code,
                duration=duration
            )
            
            return response
            
        except Exception as e:
            duration = time.time() - start_time
            
            # Record error metrics
            self.metrics.record_api_request(
                method=request.method,
                endpoint=request.url.path,
                status_code=500,
                duration=duration
            )
            
            raise e

# Global metrics collector
metrics_collector = MetricsCollector()

# Utility functions for easy metrics recording
def record_prediction_metrics(machine_id: str, model_version: str, 
                            prediction: float, duration: float, 
                            success: bool = True):
    """Record prediction metrics."""
    status = 'success' if success else 'error'
    metrics_collector.record_prediction(
        machine_id=machine_id,
        model_version=model_version,
        status=status,
        duration=duration,
        health_score=prediction if success else None
    )

def record_telemetry_metrics(machine_id: str, success: bool = True):
    """Record telemetry ingestion metrics."""
    status = 'success' if success else 'error'
    metrics_collector.record_telemetry_ingestion(machine_id, status)

def record_alert_metrics(machine_id: str, alert_type: str, severity: str):
    """Record alert generation metrics."""
    metrics_collector.record_alert(machine_id, alert_type, severity)

def get_metrics_summary() -> Dict[str, Any]:
    """Get a summary of all metrics."""
    return {
        'system_stats': metrics_collector.get_system_stats(),
        'active_machines': metrics_collector.machine_stats,
        'timestamp': datetime.now().isoformat()
    }

def generate_prometheus_metrics() -> str:
    """Generate Prometheus metrics in text format."""
    # Update system metrics before generating
    metrics_collector.update_system_metrics()
    
    return generate_latest(metrics_registry).decode('utf-8')

# Health check endpoint for metrics
def get_metrics_health() -> Dict[str, Any]:
    """Get health status of metrics system."""
    try:
        # Test metrics generation
        metrics_data = generate_prometheus_metrics()
        
        return {
            "status": "healthy",
            "metrics_count": len(metrics_data.split('\n')),
            "system_stats": metrics_collector.get_system_stats(),
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
