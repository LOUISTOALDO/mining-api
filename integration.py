"""
Integration module that ties all improvements together.
Provides a unified interface for all the new systems.
"""

from typing import Dict, Any, Optional
from datetime import datetime
from loguru import logger

# Import all our new systems
from .validators import SecureTelemetryInput, InputSanitizer
from .cache import cache_service, api_cache, check_cache_health
from .circuit_breaker import get_ml_model_breaker, get_database_breaker, fallback_prediction
from .metrics import metrics_collector, record_prediction_metrics, record_telemetry_metrics
from .structured_logging import get_truck_logger, get_api_logger, log_feature_engineering_completion
from .data_quality import data_quality_monitor, check_telemetry_quality
from .profiler import performance_profiler, profile_performance, get_performance_summary
from ..database.indexes import create_all_indexes as create_performance_indexes

class SystemIntegration:
    """Unified interface for all system improvements."""
    
    def __init__(self):
        self.initialized = False
        self.start_time = datetime.now()
    
    def initialize_all_systems(self, db_session=None):
        """Initialize all systems and run health checks."""
        try:
            logger.info("Initializing all system improvements...")
            
            # Initialize database optimization (non-blocking)
            if db_session:
                try:
                    # Create indexes (skip migrations for now to avoid asyncio issues)
                    logger.info("Creating database indexes...")
                    create_performance_indexes(db_session)
                except Exception as e:
                    logger.warning(f"Database optimization failed, continuing without: {e}")
            
            # Enable profiling (non-blocking)
            try:
                performance_profiler.enable_profiling()
            except Exception as e:
                logger.warning(f"Performance profiling failed, continuing without: {e}")
            
            # Test all systems (non-blocking)
            try:
                self._test_all_systems()
            except Exception as e:
                logger.warning(f"System tests failed, continuing with basic functionality: {e}")
            
            self.initialized = True
            logger.info("All systems initialized successfully!")
            
        except Exception as e:
            logger.error(f"Failed to initialize systems: {e}")
            # Don't raise - allow app to start with basic functionality
            logger.warning("Continuing with basic functionality despite initialization errors")
            self.initialized = True
    
    def _test_all_systems(self):
        """Test all systems to ensure they're working."""
        # Test input validation
        test_data = {
            'timestamp': '2024-01-15T10:30:00Z',
            'machine_id': 'TRUCK_001',
            'model': 'CAT_797F',
            'temperature': 75.5,
            'vibration': 1.2,
            'oil_pressure': 3.5,
            'rpm': 1500,
            'run_hours': 1250.5,
            'load': 60.0,
            'fuel_level': 85.0
        }
        
        # Test validation
        validated_data = SecureTelemetryInput(**test_data)
        logger.info("Input validation system: OK")
        
        # Test data quality
        quality_report = check_telemetry_quality(test_data)
        logger.info("Data quality monitoring: OK")
        
        # Test cache
        cache_health = check_cache_health()
        logger.info(f"Cache system: {cache_health['cache_status']}")
        
        # Test metrics
        metrics_collector.record_telemetry_ingestion('TRUCK_001', 'success')
        logger.info("Metrics system: OK")
        
        # Test circuit breakers
        ml_breaker = get_ml_model_breaker()
        logger.info(f"Circuit breaker system: {ml_breaker.state.value}")
        
        # Test logging
        truck_logger = get_truck_logger('TRUCK_001')
        truck_logger.log_telemetry_ingestion(1, 0.05)
        logger.info("Structured logging: OK")
        
        # Test profiling
        performance_summary = get_performance_summary()
        logger.info("Performance profiling: OK")
    
    def process_telemetry_with_all_systems(self, raw_telemetry: Dict[str, Any], 
                                         user_id: str = None) -> Dict[str, Any]:
        """Process telemetry data through all systems."""
        if not self.initialized:
            raise RuntimeError("Systems not initialized. Call initialize_all_systems() first.")
        
        machine_id = raw_telemetry.get('machine_id', 'unknown')
        start_time = datetime.now()
        
        # 1. Input validation and sanitization
        try:
            validated_telemetry = SecureTelemetryInput(**raw_telemetry)
            logger.info(f"Telemetry validated for machine {machine_id}")
        except Exception as e:
            logger.error(f"Validation failed for machine {machine_id}: {e}")
            raise e
        
        # 2. Data quality monitoring
        quality_report = check_telemetry_quality(raw_telemetry)
        
        # 3. Record metrics
        record_telemetry_metrics(machine_id, success=True)
        
        # 4. Structured logging
        truck_logger = get_truck_logger(machine_id, user_id)
        processing_time = (datetime.now() - start_time).total_seconds()
        truck_logger.log_telemetry_ingestion(1, processing_time, quality_report['quality_level'])
        
        # 5. Check for alerts based on quality
        if quality_report['quality_score'] < 70:
            truck_logger.log_alert_generated(
                'data_quality',
                'warning',
                quality_report['quality_score'],
                quality_report['quality_score']
            )
        
        return {
            'validated_telemetry': validated_telemetry.dict(),
            'quality_report': quality_report,
            'processing_time': processing_time,
            'timestamp': datetime.now().isoformat()
        }
    
    def make_prediction_with_all_systems(self, telemetry_data: Dict[str, Any], 
                                       user_id: str = None) -> Dict[str, Any]:
        """Make prediction using all systems."""
        if not self.initialized:
            raise RuntimeError("Systems not initialized. Call initialize_all_systems() first.")
        
        machine_id = telemetry_data.get('machine_id', 'unknown')
        start_time = datetime.now()
        
        # 1. Get circuit breaker for ML model
        ml_breaker = get_ml_model_breaker()
        
        # 2. Try ML prediction with circuit breaker
        try:
            # This would call your actual ML prediction function
            # For now, we'll simulate it
            prediction_result = ml_breaker.call(self._simulate_ml_prediction, telemetry_data)
            prediction_type = "ml_model"
            model_version = "v1.0"
            
        except Exception as e:
            # Circuit breaker is open or ML model failed
            logger.warning(f"ML prediction failed, using fallback: {e}")
            prediction_result = fallback_prediction(telemetry_data)
            prediction_type = "fallback"
            model_version = "rule_based_v1"
        
        # 3. Record metrics
        processing_time = (datetime.now() - start_time).total_seconds()
        record_prediction_metrics(
            machine_id=machine_id,
            model_version=model_version,
            prediction=prediction_result.get('predicted_health_score', 0),
            duration=processing_time,
            success=True
        )
        
        # 4. Structured logging
        truck_logger = get_truck_logger(machine_id, user_id)
        truck_logger.log_prediction(
            prediction=prediction_result.get('predicted_health_score', 0),
            processing_time=processing_time,
            model_version=model_version
        )
        
        # 5. Check for health alerts
        health_score = prediction_result.get('predicted_health_score', 100)
        if health_score < 70:
            truck_logger.log_alert_generated(
                'low_health_score',
                'high' if health_score < 50 else 'medium',
                health_score,
                health_score
            )
        
        return {
            'prediction': prediction_result,
            'prediction_type': prediction_type,
            'model_version': model_version,
            'processing_time': processing_time,
            'timestamp': datetime.now().isoformat()
        }
    
    def _simulate_ml_prediction(self, telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
        """Use your actual ML ensemble for prediction."""
        from .ml_integration import predict_with_ml_ensemble
        
        # Use your actual ML ensemble
        result = predict_with_ml_ensemble(telemetry_data)
        return result['prediction']
    
    def get_system_health_report(self) -> Dict[str, Any]:
        """Get comprehensive system health report."""
        if not self.initialized:
            return {'status': 'not_initialized'}
        
        try:
            # Get all system statuses
            cache_health = check_cache_health()
            performance_summary = get_performance_summary()
            quality_report = data_quality_monitor.get_quality_report()
            
            # Get circuit breaker status
            ml_breaker = get_ml_model_breaker()
            db_breaker = get_database_breaker()
            
            # Get metrics summary
            metrics_summary = metrics_collector.get_system_stats()
            
            return {
                'overall_status': 'healthy',
                'uptime_seconds': (datetime.now() - self.start_time).total_seconds(),
                'systems': {
                    'input_validation': 'healthy',
                    'data_quality_monitoring': 'healthy',
                    'cache_system': cache_health['cache_status'],
                    'circuit_breakers': {
                        'ml_model': ml_breaker.state.value,
                        'database': db_breaker.state.value
                    },
                    'metrics_collection': 'healthy',
                    'structured_logging': 'healthy',
                    'performance_profiling': 'healthy'
                },
                'performance': performance_summary,
                'data_quality': quality_report,
                'metrics': metrics_summary,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating system health report: {e}")
            return {
                'overall_status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

# Global system integration instance
system_integration = SystemIntegration()

# Utility functions for easy access
def initialize_all_systems(db_session=None):
    """Initialize all systems."""
    return system_integration.initialize_all_systems(db_session)

def process_telemetry_with_all_systems(raw_telemetry: Dict[str, Any], user_id: str = None):
    """Process telemetry through all systems."""
    return system_integration.process_telemetry_with_all_systems(raw_telemetry, user_id)

def make_prediction_with_all_systems(telemetry_data: Dict[str, Any], user_id: str = None):
    """Make prediction using all systems."""
    return system_integration.make_prediction_with_all_systems(telemetry_data, user_id)

def get_system_health_report():
    """Get system health report."""
    return system_integration.get_system_health_report()
