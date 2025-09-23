"""
AI router for predictions and health checks.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Machine, Telemetry
from ..schemas import PredictionRequest, PredictionResponse, HealthResponse
from ..security import get_current_api_key
from ..ai.service import ai_service
from ..utils.time import get_current_timestamp

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/predict", response_model=PredictionResponse)
async def predict_maintenance(
    request: PredictionRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Predict maintenance needs for a machine.
    
    Args:
        request: Prediction request with machine features
        db: Database session
        api_key: API key for authentication
        
    Returns:
        Prediction result
        
    Raises:
        HTTPException: If machine not found or prediction fails
    """
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == request.machine_id).first()
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine not found"
        )
    
    try:
        # Make prediction
        prediction, confidence = ai_service.predict_maintenance(
            request.machine_id, 
            request.features
        )
        
        return PredictionResponse(
            machine_id=request.machine_id,
            prediction=prediction,
            confidence=confidence,
            timestamp=get_current_timestamp(),
            features_used=ai_service.get_features_used()
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@router.get("/health/{machine_id}", response_model=HealthResponse)
async def get_machine_health(
    machine_id: int,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Get health status for a machine based on latest telemetry.
    
    Args:
        machine_id: Machine ID
        db: Database session
        api_key: API key for authentication
        
    Returns:
        Machine health status
        
    Raises:
        HTTPException: If machine not found
    """
    # Verify machine exists
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if not machine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine not found"
        )
    
    # Get latest telemetry
    latest_telemetry = (
        db.query(Telemetry)
        .filter(Telemetry.machine_id == str(machine_id))
        .order_by(Telemetry.timestamp.desc())
        .first()
    )
    
    if not latest_telemetry:
        # Return stub health data if no telemetry exists
        return HealthResponse(
            status="healthy",
            timestamp=get_current_timestamp(),
            machine_id=machine_id
        )
    
    # Simple health assessment based on telemetry
    health_status = "healthy"
    
    # Check temperature
    if latest_telemetry.temperature and latest_telemetry.temperature > 85:
        health_status = "critical"
    elif latest_telemetry.temperature and latest_telemetry.temperature > 70:
        health_status = "warning"
    
    # Check vibration
    if latest_telemetry.vibration and latest_telemetry.vibration > 2.5:
        health_status = "critical"
    elif latest_telemetry.vibration and latest_telemetry.vibration > 1.5:
        health_status = "warning"
    
    # Check hours (as a proxy for maintenance needs)
    if latest_telemetry.hours and latest_telemetry.hours > 10000:
        health_status = "warning"
    
    return HealthResponse(
        status=health_status,
        timestamp=get_current_timestamp(),
        machine_id=machine_id
    )
