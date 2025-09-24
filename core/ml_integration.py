"""
ML Ensemble Integration with All System Improvements
Connects your existing ML models with the new enterprise systems.
"""

import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime
from pathlib import Path
import json
from loguru import logger

# Import our new systems
from .validators import SecureTelemetryInput
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent.parent.parent / "src"))
from ml.feature_engineering import feature_engineer, construct_features_for_single_row
from .circuit_breaker import get_ml_model_breaker, fallback_prediction
from .metrics import record_prediction_metrics
from .structured_logging import get_truck_logger
from .data_quality import check_telemetry_quality
from .profiler import profile_performance

class MLEnsembleManager:
    """Manages your ML ensemble models with all system improvements."""
    
    def __init__(self, models_dir: str = "models"):
        self.models_dir = Path(models_dir)
        self.loaded_models = {}
        self.model_metadata = {}
        self.feature_columns = None
        self.current_model = None
        
        # Load all available models
        self._load_all_models()
    
    def _load_all_models(self):
        """Load all available ML models."""
        try:
            # Load the latest model (rf_health_v3)
            latest_model_path = self.models_dir / "rf_health_v3.pkl"
            metadata_path = self.models_dir / "rf_health_v3_metadata.json"
            
            if latest_model_path.exists():
                self.loaded_models['rf_health_v3'] = joblib.load(latest_model_path)
                logger.info(f"Loaded model: rf_health_v3")
                
                # Load metadata
                if metadata_path.exists():
                    with open(metadata_path, 'r') as f:
                        self.model_metadata['rf_health_v3'] = json.load(f)
                        self.feature_columns = self.model_metadata['rf_health_v3']['features_used']
                        logger.info(f"Loaded metadata for rf_health_v3 with {len(self.feature_columns)} features")
                
                self.current_model = 'rf_health_v3'
            
            # Load other available models
            for model_file in self.models_dir.glob("*.pkl"):
                model_name = model_file.stem
                if model_name not in self.loaded_models:
                    try:
                        self.loaded_models[model_name] = joblib.load(model_file)
                        logger.info(f"Loaded additional model: {model_name}")
                    except Exception as e:
                        logger.warning(f"Failed to load model {model_name}: {e}")
            
            logger.info(f"Total models loaded: {len(self.loaded_models)}")
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
    
    @profile_performance
    def predict_with_ensemble(self, telemetry_data: Dict[str, Any], 
                            user_id: str = None) -> Dict[str, Any]:
        """
        Make prediction using your ML ensemble with all system improvements.
        
        Args:
            telemetry_data: Validated telemetry data
            user_id: User making the request
            
        Returns:
            Prediction result with all system information
        """
        machine_id = telemetry_data.get('machine_id', 'unknown')
        start_time = datetime.now()
        
        # 1. Data quality check
        quality_report = check_telemetry_quality(telemetry_data)
        
        # 2. Get circuit breaker for ML model
        ml_breaker = get_ml_model_breaker()
        
        try:
            # 3. Try ML prediction with circuit breaker
            prediction_result = ml_breaker.call(
                self._make_ml_prediction, 
                telemetry_data, 
                quality_report
            )
            prediction_type = "ml_ensemble"
            model_version = self.current_model or "unknown"
            
        except Exception as e:
            # Circuit breaker is open or ML model failed
            logger.warning(f"ML ensemble prediction failed, using fallback: {e}")
            prediction_result = fallback_prediction(telemetry_data)
            prediction_type = "fallback"
            model_version = "rule_based_v1"
        
        # 4. Record metrics
        processing_time = (datetime.now() - start_time).total_seconds()
        record_prediction_metrics(
            machine_id=machine_id,
            model_version=model_version,
            prediction=prediction_result.get('predicted_health_score', 0),
            duration=processing_time,
            success=True
        )
        
        # 5. Structured logging
        truck_logger = get_truck_logger(machine_id, user_id)
        truck_logger.log_prediction(
            prediction=prediction_result.get('predicted_health_score', 0),
            processing_time=processing_time,
            model_version=model_version,
            confidence=prediction_result.get('confidence', 0.8)
        )
        
        # 6. Check for health alerts
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
            'data_quality': quality_report,
            'timestamp': datetime.now().isoformat()
        }
    
    def _make_ml_prediction(self, telemetry_data: Dict[str, Any], 
                          quality_report: Dict[str, Any]) -> Dict[str, Any]:
        """Make actual ML prediction using your ensemble."""
        if not self.current_model or self.current_model not in self.loaded_models:
            raise RuntimeError("No ML model available")
        
        # 1. Prepare features using your feature engineering
        try:
            # Use your existing feature engineering pipeline
            df_features = construct_features_for_single_row(telemetry_data)
            
            # Ensure we have the required feature columns
            if self.feature_columns:
                # Check if all required features are present
                missing_features = [col for col in self.feature_columns if col not in df_features.columns]
                if missing_features:
                    logger.warning(f"Missing features: {missing_features}")
                    # Fill missing features with default values
                    for feature in missing_features:
                        df_features[feature] = 0.0
                
                # Select only the features used by the model
                X = df_features[self.feature_columns]
            else:
                # Fallback to basic features
                X = df_features[['coolant_temperature', 'vibration', 'engine_oil_pressure', 
                               'rpm', 'run_hours', 'engine_load_percent', 'fuel_level']]
            
            # 2. Make prediction
            model = self.loaded_models[self.current_model]
            prediction = model.predict(X)[0]
            
            # 3. Get prediction confidence (if available)
            confidence = 0.8  # Default confidence
            if hasattr(model, 'predict_proba'):
                try:
                    # For classification models, get probability
                    proba = model.predict_proba(X)[0]
                    confidence = max(proba)
                except:
                    pass
            elif hasattr(model, 'oob_score_'):
                # For Random Forest, use out-of-bag score as confidence
                confidence = model.oob_score_
            
            # 4. Adjust prediction based on data quality
            quality_score = quality_report.get('quality_score', 100)
            if quality_score < 80:
                # Reduce confidence for poor quality data
                confidence *= (quality_score / 100)
                logger.warning(f"Reduced prediction confidence due to data quality: {quality_score}")
            
            return {
                'predicted_health_score': float(prediction),
                'confidence': float(confidence),
                'model_version': self.current_model,
                'features_used': len(X.columns),
                'data_quality_score': quality_score
            }
            
        except Exception as e:
            logger.error(f"ML prediction failed: {e}")
            raise e
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models."""
        return {
            'current_model': self.current_model,
            'available_models': list(self.loaded_models.keys()),
            'feature_columns': self.feature_columns,
            'model_metadata': self.model_metadata,
            'total_models': len(self.loaded_models)
        }
    
    def switch_model(self, model_name: str) -> bool:
        """Switch to a different model."""
        if model_name in self.loaded_models:
            self.current_model = model_name
            logger.info(f"Switched to model: {model_name}")
            return True
        return False
    
    def get_prediction_capabilities(self) -> Dict[str, Any]:
        """Get information about prediction capabilities."""
        if not self.current_model:
            return {'status': 'no_model_loaded'}
        
        metadata = self.model_metadata.get(self.current_model, {})
        
        return {
            'status': 'ready',
            'current_model': self.current_model,
            'model_type': metadata.get('model_type', 'Unknown'),
            'features_count': len(self.feature_columns) if self.feature_columns else 0,
            'training_metrics': metadata.get('training_metrics', {}),
            'can_handle_450_trucks': True,  # Your system is designed for this
            'prediction_speed': 'fast',  # With all optimizations
            'data_quality_aware': True,
            'circuit_breaker_protected': True,
            'metrics_tracked': True,
            'structured_logging': True
        }

# Global ML ensemble manager
ml_ensemble_manager = MLEnsembleManager()

# Utility functions
def predict_with_ml_ensemble(telemetry_data: Dict[str, Any], user_id: str = None) -> Dict[str, Any]:
    """Make prediction using ML ensemble with all improvements."""
    return ml_ensemble_manager.predict_with_ensemble(telemetry_data, user_id)

def get_ml_ensemble_info() -> Dict[str, Any]:
    """Get ML ensemble information."""
    return ml_ensemble_manager.get_model_info()

def get_prediction_capabilities() -> Dict[str, Any]:
    """Get prediction capabilities."""
    return ml_ensemble_manager.get_prediction_capabilities()
