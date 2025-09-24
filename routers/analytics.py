"""
Analytics router for machine trends and analysis.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timedelta

from ..db import get_db
from ..models import Machine, Telemetry
from ..security import get_current_api_key
from ..utils.time import get_current_timestamp

router = APIRouter(prefix="/analytics", tags=["analytics"])


class MachineAnalytics(BaseModel):
    """Machine analytics data."""
    machine_id: str
    timestamps: List[str]
    temperature_trend: List[Optional[float]]
    vibration_trend: List[Optional[float]]
    rpm_trend: List[Optional[float]]
    hours_trend: List[Optional[float]]
    health_score_trend: List[float]


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


@router.get("/machine/{machine_id}", response_model=MachineAnalytics)
async def get_machine_analytics(
    machine_id: str,
    limit: int = Query(50, ge=1, le=1000),
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """Get analytics data for a machine."""
    # Build query
    query = db.query(Telemetry).filter(Telemetry.machine_id == machine_id)
    
    if start_time:
        query = query.filter(Telemetry.timestamp >= start_time)
    if end_time:
        query = query.filter(Telemetry.timestamp <= end_time)
    
    # Get telemetry data
    telemetry_data = query.order_by(Telemetry.timestamp.desc()).limit(limit).all()
    
    if not telemetry_data:
        return MachineAnalytics(
            machine_id=machine_id,
            timestamps=[],
            temperature_trend=[],
            vibration_trend=[],
            rpm_trend=[],
            hours_trend=[],
            health_score_trend=[]
        )
    
    # Reverse to get chronological order
    telemetry_data.reverse()
    
    timestamps = []
    temperature_trend = []
    vibration_trend = []
    rpm_trend = []
    hours_trend = []
    health_score_trend = []
    
    for telemetry in telemetry_data:
        timestamps.append(telemetry.timestamp.isoformat())
        temperature_trend.append(telemetry.temperature)
        vibration_trend.append(telemetry.vibration)
        rpm_trend.append(telemetry.rpm)
        hours_trend.append(telemetry.hours)
        
        health_score = calculate_health_score(
            telemetry.temperature,
            telemetry.vibration,
            telemetry.rpm,
            telemetry.hours
        )
        health_score_trend.append(health_score)
    
    return MachineAnalytics(
        machine_id=machine_id,
        timestamps=timestamps,
        temperature_trend=temperature_trend,
        vibration_trend=vibration_trend,
        rpm_trend=rpm_trend,
        hours_trend=hours_trend,
        health_score_trend=health_score_trend
    )
