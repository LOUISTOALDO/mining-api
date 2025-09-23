"""
Prediction router for AI-based health scoring.
"""

import sys
import logging
import os
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, Field, ValidationError
from sqlalchemy.orm import Session

# Add project root to path for ML imports
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

from ..db import get_db
from ..security import get_current_api_key
from ..utils.time import get_current_timestamp

# Import ML utilities
try:
    import sys
    from pathlib import Path
    
    # Get the project root directory (4 levels up from this file)
    project_root = Path(__file__).parent.parent.parent.parent
    ml_path = project_root / "ml"
    
    # Add both project root and ml directory to Python path
    if str(project_root) not in sys.path:
        sys.path.insert(0, str(project_root))
    if str(ml_path) not in sys.path:
        sys.path.insert(0, str(ml_path))
    
    # Now import from the ml module
    from ml.load_model import load_latest_model, get_model_status
    ML_AVAILABLE = True
    print(f"ML modules imported successfully from: {ml_path}")
except ImportError as e:
    ML_AVAILABLE = False
    print(f"ML import failed: {e}")
    print(f"Tried to import from: {ml_path}")

# Configure logging
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

# Create a dedicated logger for the predict API
predict_logger = logging.getLogger("predict_api")
predict_logger.setLevel(logging.INFO)

# Create file handler
file_handler = logging.FileHandler(log_dir / "predict_api.log")
file_handler.setLevel(logging.INFO)

# Create formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
file_handler.setFormatter(formatter)

# Add handler to logger
predict_logger.addHandler(file_handler)

# Prevent duplicate handlers
if not predict_logger.handlers:
    predict_logger.addHandler(file_handler)

router = APIRouter(prefix="/predict", tags=["prediction"])


# Note: Exception handling is done at the endpoint level for better control


class TelemetryInput(BaseModel):
    """Schema for telemetry input for prediction."""
    temperature: float = Field(..., ge=0, le=300, description="Temperature in Celsius")
    vibration: float = Field(..., ge=0, le=20, description="Vibration in g")
    oil_pressure: float = Field(..., ge=0, le=15, description="Oil pressure in bar")
    rpm: float = Field(..., ge=0, le=15000, description="RPM")
    load: float = Field(..., ge=0, le=100, description="Load percentage")
    run_hours: float = Field(..., ge=0, le=100000, description="Runtime hours")
    fuel_level: float = Field(..., ge=0, le=1000, description="Fuel level")
    fuel_usage: float = Field(..., ge=0, le=100, description="Fuel usage rate")
    
    class Config:
        """Pydantic configuration."""
        extra = "forbid"  # Reject any extra fields
        validate_assignment = True  # Validate on assignment


class PredictionResponse(BaseModel):
    """Schema for prediction response."""
    machine_id: str = Field(default="truck-001", description="Machine identifier")
    prediction: int = Field(..., description="Binary prediction (1=healthy, 0=maintenance needed)")
    is_healthy: bool = Field(..., description="Whether machine is healthy")
    confidence: float = Field(..., ge=0, le=1, description="Prediction confidence")
    health_score: float = Field(..., ge=0, le=1, description="Health probability score")
    maintenance_status: str = Field(..., description="Maintenance recommendation")
    risk_level: str = Field(..., description="Risk level assessment")
    model_timestamp: str = Field(..., description="When model was trained")
    features_used: list = Field(..., description="Features used for prediction")


@router.get("/status")
async def get_model_status_endpoint():
    """Get the status of the AI model."""
    try:
        if not ML_AVAILABLE:
            predict_logger.warning("Model status check: ML modules not available")
            return {
                "ml_available": False,
                "error": "ML modules not available",
                "timestamp": get_current_timestamp(),
                "status": "unavailable"
            }
        
        status = get_model_status()
        predict_logger.info("Model status check: Success")
        
        return {
            "ml_available": True,
            "model_status": status,
            "timestamp": get_current_timestamp(),
            "status": "available"
        }
        
    except Exception as e:
        error_msg = f"Model status check failed: {str(e)}"
        predict_logger.error(f"Model status check: {error_msg}")
        predict_logger.exception("Model status check: Full traceback:")
        
        return {
            "ml_available": False,
            "error": error_msg,
            "timestamp": get_current_timestamp(),
            "status": "error"
        }


@router.get("/health")
async def health_check():
    """Health check endpoint for the prediction service."""
    try:
        # Check if ML modules are available
        ml_ok = ML_AVAILABLE
        
        # Check if we can load a model
        model_ok = False
        model_info = None
        
        if ml_ok:
            try:
                model_info = get_model_status()
                model_ok = model_info.get('model_available', False)
            except Exception:
                model_ok = False
        
        # Determine overall health
        if ml_ok and model_ok:
            health_status = "healthy"
            status_code = 200
        elif ml_ok and not model_ok:
            health_status = "degraded"
            status_code = 200
        else:
            health_status = "unhealthy"
            status_code = 503
        
        response = {
            "status": health_status,
            "timestamp": get_current_timestamp(),
            "checks": {
                "ml_modules": ml_ok,
                "model_available": model_ok
            },
            "model_info": model_info if model_info else None
        }
        
        predict_logger.info(f"Health check: {health_status}")
        return response
        
    except Exception as e:
        predict_logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": get_current_timestamp(),
            "error": str(e),
            "checks": {
                "ml_modules": False,
                "model_available": False
            }
        }


@router.post("", response_model=PredictionResponse)
async def predict_health(
    request: Request,
    telemetry: TelemetryInput,
    machine_id: str = "truck-001",
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Predict machine health using trained AI model.
    
    Args:
        request: FastAPI request object for logging
        telemetry: Telemetry data for prediction
        machine_id: Machine identifier
        db: Database session
        api_key: API key for authentication
        
    Returns:
        AI-powered health prediction with detailed analysis
    """
    # Generate unique request ID for tracking
    request_id = f"req_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    
    # Log incoming request
    predict_logger.info(
        f"Request {request_id}: Prediction request for machine {machine_id} "
        f"from {request.client.host if request.client else 'unknown'}"
    )
    
    # Log input features (sanitized for security)
    feature_log = {
        'temperature': round(telemetry.temperature, 2),
        'vibration': round(telemetry.vibration, 2),
        'oil_pressure': round(telemetry.oil_pressure, 2),
        'rpm': round(telemetry.rpm, 1),
        'load': round(telemetry.load, 1),
        'run_hours': round(telemetry.run_hours, 1),
        'fuel_level': round(telemetry.fuel_level, 1),
        'fuel_usage': round(telemetry.fuel_usage, 2)
    }
    predict_logger.info(f"Request {request_id}: Input features: {feature_log}")
    
    # Check ML availability
    if not ML_AVAILABLE:
        error_msg = "AI prediction service not available. ML modules not found."
        predict_logger.error(f"Request {request_id}: {error_msg}")
        raise HTTPException(
            status_code=503,
            detail=error_msg
        )
    
    try:
        # Load the latest trained model
        predict_logger.info(f"Request {request_id}: Loading ML model...")
        model_loader = load_latest_model()
        
        if model_loader is None:
            error_msg = "No trained model available. Please run train_model.py first."
            predict_logger.error(f"Request {request_id}: {error_msg}")
            raise HTTPException(
                status_code=503,
                detail=error_msg
            )
        
        # Prepare features in the correct order
        features = [
            telemetry.temperature,
            telemetry.vibration,
            telemetry.oil_pressure,
            telemetry.rpm,
            telemetry.load,
            telemetry.run_hours,
            telemetry.fuel_level,
            telemetry.fuel_usage
        ]
        
        # Validate feature count
        if len(features) != 8:
            error_msg = f"Expected 8 features, got {len(features)}"
            predict_logger.error(f"Request {request_id}: {error_msg}")
            raise HTTPException(
                status_code=400,
                detail=error_msg
            )
        
        # Make prediction
        predict_logger.info(f"Request {request_id}: Making prediction...")
        prediction_result = model_loader.predict(features)
        
        # Add machine_id to response
        prediction_result['machine_id'] = machine_id
        
        # Log successful prediction
        predict_logger.info(
            f"Request {request_id}: Prediction successful - "
            f"Health: {prediction_result.get('is_healthy', 'Unknown')}, "
            f"Score: {prediction_result.get('health_score', 'Unknown'):.3f}, "
            f"Risk: {prediction_result.get('risk_level', 'Unknown')}"
        )
        
        return PredictionResponse(**prediction_result)
        
    except ValueError as e:
        error_msg = f"Invalid input data: {str(e)}"
        predict_logger.error(f"Request {request_id}: {error_msg}")
        raise HTTPException(
            status_code=400,
            detail=error_msg
        )
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        error_msg = f"Prediction failed: {str(e)}"
        predict_logger.error(f"Request {request_id}: Unexpected error: {error_msg}")
        predict_logger.exception(f"Request {request_id}: Full traceback:")
        
        # Return a safe error response
        raise HTTPException(
            status_code=500,
            detail=error_msg
        )


@router.post("/legacy", response_model=dict)
async def predict_health_legacy(
    request: Request,
    telemetry: TelemetryInput,
    machine_id: str = "truck-001",
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Legacy prediction endpoint using rule-based calculations.
    Kept for backward compatibility.
    """
    request_id = f"legacy_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    
    predict_logger.info(
        f"Request {request_id}: Legacy prediction for machine {machine_id} "
        f"from {request.client.host if request.client else 'unknown'}"
    )
    
    try:
        # Rule-based health scoring algorithm
        health_score = 100.0
        
        # Temperature impact (0-100°C is optimal, >100°C reduces score)
        if telemetry.temperature > 100:
            temp_penalty = (telemetry.temperature - 100) * 0.5
            health_score -= temp_penalty
        
        # Vibration impact (0-2g is optimal, >2g reduces score)
        if telemetry.vibration > 2:
            vib_penalty = (telemetry.vibration - 2) * 5
            health_score -= vib_penalty
        
        # RPM impact (800-2000 RPM is optimal)
        if telemetry.rpm < 800 or telemetry.rpm > 2000:
            rpm_penalty = abs(telemetry.rpm - 1400) * 0.01
            health_score -= rpm_penalty
        
        # Run hours impact (0-10000 hours is optimal, >10000 reduces score)
        if telemetry.run_hours > 10000:
            hours_penalty = (telemetry.run_hours - 10000) * 0.001
            health_score -= hours_penalty
        
        # Clamp health score to 0-100 range
        health_score = max(0.0, min(100.0, health_score))
        
        # Determine status based on health score
        if health_score >= 70:
            status = "Healthy"
            maintenance_needed = False
        elif health_score >= 40:
            status = "Needs Maintenance"
            maintenance_needed = True
        else:
            status = "Critical"
            maintenance_needed = True
        
        # Calculate confidence based on data quality
        confidence = max(0.5, min(0.95, 1.0 - (abs(telemetry.temperature - 75) / 100)))
        
        result = {
            "machine_id": machine_id,
            "health_score": round(health_score, 2),
            "status": status,
            "maintenance_needed": maintenance_needed,
            "confidence": round(confidence, 3),
            "method": "legacy_rule_based",
            "timestamp": get_current_timestamp(),
            "features_analyzed": {
                "temperature": round(telemetry.temperature, 2),
                "vibration": round(telemetry.vibration, 2),
                "rpm": round(telemetry.rpm, 1),
                "run_hours": round(telemetry.run_hours, 1)
            }
        }
        
        predict_logger.info(
            f"Request {request_id}: Legacy prediction successful - "
            f"Health: {health_score:.2f}, Status: {status}"
        )
        
        return result
        
    except Exception as e:
        error_msg = f"Legacy prediction failed: {str(e)}"
        predict_logger.error(f"Request {request_id}: {error_msg}")
        predict_logger.exception(f"Request {request_id}: Full traceback:")
        
        raise HTTPException(
            status_code=500,
            detail=error_msg
        )


# Additional utility endpoints for production use
@router.get("/features")
async def get_supported_features():
    """Get the list of supported telemetry features."""
    return {
        "features": [
            "temperature",
            "vibration", 
            "oil_pressure",
            "rpm",
            "load",
            "run_hours",
            "fuel_level",
            "fuel_usage"
        ],
        "feature_descriptions": {
            "temperature": "Temperature in Celsius (0-300°C)",
            "vibration": "Vibration in g (0-20g)",
            "oil_pressure": "Oil pressure in bar (0-15 bar)",
            "rpm": "Revolutions per minute (0-15000 RPM)",
            "load": "Load percentage (0-100%)",
            "run_hours": "Runtime hours (0-100000 hours)",
            "fuel_level": "Fuel level (0-1000L)",
            "fuel_usage": "Fuel usage rate (0-100L/h)"
        },
        "validation_ranges": {
            "temperature": {"min": 0, "max": 300},
            "vibration": {"min": 0, "max": 20},
            "oil_pressure": {"min": 0, "max": 15},
            "rpm": {"min": 0, "max": 15000},
            "load": {"min": 0, "max": 100},
            "run_hours": {"min": 0, "max": 100000},
            "fuel_level": {"min": 0, "max": 1000},
            "fuel_usage": {"min": 0, "max": 100}
        },
        "timestamp": get_current_timestamp()
    }


@router.get("/metrics")
async def get_prediction_metrics():
    """Get prediction service metrics."""
    try:
        # Read log file to get basic metrics
        log_file = Path("logs/predict_api.log")
        metrics = {
            "service_status": "operational",
            "log_file_exists": log_file.exists(),
            "log_file_size_bytes": log_file.stat().st_size if log_file.exists() else 0,
            "ml_available": ML_AVAILABLE,
            "timestamp": get_current_timestamp()
        }
        
        # Add model info if available
        if ML_AVAILABLE:
            try:
                model_status = get_model_status()
                metrics["model_available"] = model_status.get('model_available', False)
                metrics["model_type"] = model_status.get('model_type', 'Unknown')
                metrics["training_timestamp"] = model_status.get('training_timestamp', 'Unknown')
            except Exception:
                metrics["model_available"] = False
        
        return metrics
        
    except Exception as e:
        predict_logger.error(f"Failed to get metrics: {str(e)}")
        return {
            "service_status": "error",
            "error": str(e),
            "timestamp": get_current_timestamp()
        }
