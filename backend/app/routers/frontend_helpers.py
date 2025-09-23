"""
Frontend helpers router for consolidated data endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

from ..db import get_db
from ..models import Machine, Telemetry
from ..security import get_current_api_key
from ..utils.time import get_current_timestamp

router = APIRouter(prefix="/frontend", tags=["frontend"])


class MachineSummary(BaseModel):
    """Machine summary for frontend."""
    machine_id: str
    health_score: float
    status: str
    last_updated: datetime
    latest_telemetry: Optional[dict] = None
    alert_count: int = 0


def calculate_health_score(temperature: Optional[float], vibration: Optional[float], 
                          rpm: Optional[float], hours: Optional[float]) -> float:
    """Calculate health score based on telemetry with more realistic penalties."""
    health_score = 100.0
    
    # Temperature penalties (more granular)
    if temperature:
        if temperature > 120:
            health_score -= 25  # Critical overheating
        elif temperature > 110:
            health_score -= 15  # High temperature
        elif temperature > 100:
            health_score -= 8   # Elevated temperature
    
    # Vibration penalties (more severe)
    if vibration:
        if vibration > 4.5:
            health_score -= 30  # Critical vibration
        elif vibration > 4.0:
            health_score -= 20  # High vibration
        elif vibration > 3.5:
            health_score -= 15  # Elevated vibration
        elif vibration > 3.0:
            health_score -= 10  # Moderate vibration
    
    # Hours penalties (wear and tear)
    if hours:
        if hours > 18000:
            health_score -= 20  # Critical hours
        elif hours > 15000:
            health_score -= 15  # High hours
        elif hours > 12000:
            health_score -= 10  # Elevated hours
        elif hours > 10000:
            health_score -= 5   # Moderate hours
    
    # RPM penalties (if outside normal range)
    if rpm:
        if rpm > 2000 or rpm < 300:
            health_score -= 10  # Abnormal RPM
    
    return max(0.0, min(100.0, health_score))


def get_health_status(health_score: float) -> str:
    """Get health status based on score."""
    if health_score >= 80:
        return "Healthy"
    elif health_score >= 50:
        return "Needs Maintenance"
    else:
        return "Critical"


@router.get("/machine_summary/{machine_id}", response_model=MachineSummary)
async def get_machine_summary(
    machine_id: str,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """Get machine summary for frontend."""
    # Get latest telemetry
    latest_telemetry = (
        db.query(Telemetry)
        .filter(Telemetry.machine_id == machine_id)
        .order_by(Telemetry.timestamp.desc())
        .first()
    )
    
    if not latest_telemetry:
        return MachineSummary(
            machine_id=machine_id,
            health_score=100.0,
            status="Healthy",
            last_updated=get_current_timestamp(),
            alert_count=0
        )
    
    # Calculate health score
    health_score = calculate_health_score(
        latest_telemetry.temperature,
        latest_telemetry.vibration,
        latest_telemetry.rpm,
        latest_telemetry.hours
    )
    
    status = get_health_status(health_score)
    
    return MachineSummary(
        machine_id=machine_id,
        health_score=health_score,
        status=status,
        last_updated=latest_telemetry.timestamp,
        latest_telemetry={
            "temperature": latest_telemetry.temperature,
            "vibration": latest_telemetry.vibration,
            "rpm": latest_telemetry.rpm,
            "hours": latest_telemetry.hours
        },
        alert_count=0  # TODO: Implement alert counting
    )
