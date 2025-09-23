"""
Telemetry router for data ingestion and retrieval.
"""

import random
from typing import List
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Telemetry
from ..schemas import TelemetryCreate, Telemetry as TelemetrySchema, TelemetryBatch
from ..security import get_current_api_key
from ..utils.time import get_current_timestamp

router = APIRouter(prefix="/telemetry", tags=["telemetry"])


@router.post("/batch", response_model=dict)
async def create_telemetry_batch(
    batch: TelemetryBatch,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Create telemetry data in batch.
    
    Args:
        batch: Batch of telemetry data
        db: Database session
        api_key: API key for authentication
        
    Returns:
        Batch creation result
    """
    created_count = 0
    
    for telemetry_data in batch.data:
        db_telemetry = Telemetry(**telemetry_data.model_dump())
        db.add(db_telemetry)
        created_count += 1
    
    db.commit()
    
    return {
        "message": f"Created {created_count} telemetry records",
        "created_count": created_count,
        "total_count": len(batch.data)
    }


@router.get("/{machine_id}", response_model=List[TelemetrySchema])
async def get_telemetry(
    machine_id: str,
    start_time: datetime = Query(None, description="Start time for filtering"),
    end_time: datetime = Query(None, description="End time for filtering"),
    limit: int = Query(100, le=1000, description="Maximum number of records"),
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Get telemetry data for a specific machine.
    
    Args:
        machine_id: Machine ID (string)
        start_time: Start time filter
        end_time: End time filter
        limit: Maximum number of records
        db: Database session
        api_key: API key for authentication
        
    Returns:
        List of telemetry records
    """
    # Build query
    query = db.query(Telemetry).filter(Telemetry.machine_id == machine_id)
    
    # Apply time filters
    if start_time:
        query = query.filter(Telemetry.timestamp >= start_time)
    if end_time:
        query = query.filter(Telemetry.timestamp <= end_time)
    
    # Order by timestamp and limit
    telemetry_data = query.order_by(Telemetry.timestamp.desc()).limit(limit).all()
    
    return telemetry_data


@router.get("/{machine_id}/latest", response_model=TelemetrySchema)
async def get_latest_telemetry(
    machine_id: str,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Get the latest telemetry data for a machine.
    
    Args:
        machine_id: Machine ID (string)
        db: Database session
        api_key: API key for authentication
        
    Returns:
        Latest telemetry record
        
    Raises:
        HTTPException: If no telemetry data found
    """
    # Get latest telemetry
    latest_telemetry = (
        db.query(Telemetry)
        .filter(Telemetry.machine_id == machine_id)
        .order_by(Telemetry.timestamp.desc())
        .first()
    )
    
    if not latest_telemetry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No telemetry data found for this machine"
        )
    
    return latest_telemetry


@router.post("/random", response_model=TelemetrySchema)
async def create_random_telemetry(
    machine_id: str = "truck-001",
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Generate and save random telemetry data.
    
    Args:
        machine_id: Machine identifier (string)
        db: Database session
        api_key: API key for authentication
        
    Returns:
        Generated telemetry record
    """
    # Generate random telemetry data
    temperature = random.uniform(40.0, 120.0)
    vibration = random.uniform(0.0, 5.0)
    rpm = random.randint(500, 5000)
    hours = random.randint(0, 20000)
    timestamp = datetime.now()
    
    # Create telemetry record
    telemetry_data = Telemetry(
        machine_id=machine_id,
        timestamp=timestamp,
        temperature=temperature,
        vibration=vibration,
        rpm=float(rpm),
        hours=float(hours)
    )
    
    db.add(telemetry_data)
    db.commit()
    db.refresh(telemetry_data)
    
    return telemetry_data


@router.get("/recent", response_model=List[TelemetrySchema])
async def get_recent_telemetry(
    limit: int = Query(10, ge=1, le=100, description="Number of recent records to return"),
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Get the most recent telemetry entries.
    
    Args:
        limit: Number of recent records to return (1-100)
        db: Database session
        api_key: API key for authentication
        
    Returns:
        List of recent telemetry records ordered by timestamp DESC
    """
    # Get recent telemetry records
    recent_telemetry = (
        db.query(Telemetry)
        .order_by(Telemetry.timestamp.desc())
        .limit(limit)
        .all()
    )
    
    return recent_telemetry
