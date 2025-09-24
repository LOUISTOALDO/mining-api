"""
Equipment management API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from ..db import get_db
from ..services.equipment_service import EquipmentService
from ..schemas.equipment import (
    EquipmentCreate, EquipmentUpdate, EquipmentResponse, EquipmentListResponse,
    TelemetryDataCreate, TelemetryDataResponse, TelemetryListResponse,
    MaintenanceRecordCreate, MaintenanceRecordResponse,
    AlertCreate, AlertResponse, AlertListResponse,
    PerformanceMetricsCreate, PerformanceMetricsResponse,
    CostAnalysisCreate, CostAnalysisResponse,
    FleetSummary, EquipmentWithTelemetry, TelemetrySummary
)
from ..auth.dependencies import get_current_active_user, require_read_machines, require_write_machines

router = APIRouter(prefix="/equipment", tags=["equipment"])

def get_equipment_service(db: Session = Depends(get_db)) -> EquipmentService:
    """Get equipment service instance."""
    return EquipmentService(db)

# Equipment Management Endpoints
@router.post("/", response_model=EquipmentResponse)
async def create_equipment(
    equipment_data: EquipmentCreate,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Create new equipment."""
    # Check if equipment already exists
    existing = equipment_service.get_equipment(equipment_data.machine_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Equipment with this machine ID already exists"
        )
    
    equipment = equipment_service.create_equipment(equipment_data.dict())
    return equipment

@router.get("/", response_model=EquipmentListResponse)
async def get_equipment_list(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of items to return"),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get list of all equipment."""
    equipment_list = equipment_service.get_all_equipment(skip=skip, limit=limit)
    total = len(equipment_list)  # In production, you'd want a proper count query
    
    return EquipmentListResponse(
        items=equipment_list,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit
    )

@router.get("/{machine_id}", response_model=EquipmentWithTelemetry)
async def get_equipment(
    machine_id: str,
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get equipment by machine ID with latest telemetry."""
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    # Get latest telemetry
    latest_telemetry = equipment_service.get_latest_telemetry(machine_id)
    
    # Get active alerts
    active_alerts = equipment_service.get_active_alerts(machine_id)
    
    # Check if maintenance is due
    maintenance_due = equipment.next_maintenance and equipment.next_maintenance <= datetime.now().date()
    
    return EquipmentWithTelemetry(
        **equipment.__dict__,
        latest_telemetry=latest_telemetry,
        active_alerts=active_alerts,
        maintenance_due=maintenance_due
    )

@router.put("/{machine_id}", response_model=EquipmentResponse)
async def update_equipment(
    machine_id: str,
    equipment_data: EquipmentUpdate,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Update equipment information."""
    equipment = equipment_service.update_equipment(machine_id, equipment_data.dict(exclude_unset=True))
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    return equipment

@router.delete("/{machine_id}")
async def delete_equipment(
    machine_id: str,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Delete equipment."""
    success = equipment_service.delete_equipment(machine_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    return {"message": "Equipment deleted successfully"}

# Telemetry Endpoints
@router.post("/{machine_id}/telemetry", response_model=TelemetryDataResponse)
async def add_telemetry_data(
    machine_id: str,
    telemetry_data: TelemetryDataCreate,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Add telemetry data for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    telemetry = equipment_service.add_telemetry_data(machine_id, telemetry_data.dict(exclude={'machine_id'}))
    return telemetry

@router.get("/{machine_id}/telemetry", response_model=TelemetryListResponse)
async def get_telemetry_history(
    machine_id: str,
    hours: int = Query(24, ge=1, le=168, description="Hours of history to retrieve"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get telemetry history for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    telemetry_list = equipment_service.get_telemetry_history(machine_id, hours)
    total = len(telemetry_list)
    
    # Apply pagination
    paginated_telemetry = telemetry_list[skip:skip + limit]
    
    return TelemetryListResponse(
        items=paginated_telemetry,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit
    )

@router.get("/{machine_id}/telemetry/summary", response_model=TelemetrySummary)
async def get_telemetry_summary(
    machine_id: str,
    days: int = Query(7, ge=1, le=30, description="Days of data to summarize"),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get telemetry summary for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    summary = equipment_service.get_telemetry_summary(machine_id, days)
    return TelemetrySummary(
        machine_id=machine_id,
        period_hours=days * 24,
        **summary
    )

# Maintenance Endpoints
@router.post("/{machine_id}/maintenance", response_model=MaintenanceRecordResponse)
async def create_maintenance_record(
    machine_id: str,
    maintenance_data: MaintenanceRecordCreate,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Create maintenance record for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    maintenance = equipment_service.create_maintenance_record(machine_id, maintenance_data.dict(exclude={'machine_id'}))
    return maintenance

@router.get("/{machine_id}/maintenance", response_model=List[MaintenanceRecordResponse])
async def get_maintenance_history(
    machine_id: str,
    limit: int = Query(50, ge=1, le=200, description="Number of records to return"),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get maintenance history for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    maintenance_history = equipment_service.get_maintenance_history(machine_id, limit)
    return maintenance_history

@router.get("/maintenance/upcoming", response_model=List[EquipmentResponse])
async def get_upcoming_maintenance(
    days: int = Query(30, ge=1, le=90, description="Days ahead to check for maintenance"),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get equipment with upcoming maintenance."""
    upcoming_maintenance = equipment_service.get_upcoming_maintenance(days)
    return upcoming_maintenance

# Alert Endpoints
@router.post("/{machine_id}/alerts", response_model=AlertResponse)
async def create_alert(
    machine_id: str,
    alert_data: AlertCreate,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Create alert for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    alert = equipment_service.create_alert(machine_id, alert_data.dict(exclude={'machine_id'}))
    return alert

@router.get("/alerts", response_model=AlertListResponse)
async def get_active_alerts(
    machine_id: Optional[str] = Query(None, description="Filter by machine ID"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get active alerts."""
    alerts = equipment_service.get_active_alerts(machine_id)
    total = len(alerts)
    
    # Apply pagination
    paginated_alerts = alerts[skip:skip + limit]
    
    return AlertListResponse(
        items=paginated_alerts,
        total=total,
        page=skip // limit + 1,
        size=limit,
        pages=(total + limit - 1) // limit
    )

@router.put("/alerts/{alert_id}/acknowledge", response_model=AlertResponse)
async def acknowledge_alert(
    alert_id: int,
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Acknowledge an alert."""
    alert = equipment_service.acknowledge_alert(alert_id, current_user.id)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    return alert

@router.put("/alerts/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    alert_id: int,
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Resolve an alert."""
    alert = equipment_service.resolve_alert(alert_id)
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    return alert

# Performance Metrics Endpoints
@router.post("/{machine_id}/performance", response_model=PerformanceMetricsResponse)
async def create_performance_metrics(
    machine_id: str,
    metrics_data: PerformanceMetricsCreate,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Create performance metrics for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    metrics = equipment_service.create_performance_metrics(machine_id, metrics_data.dict(exclude={'machine_id'}))
    return metrics

@router.get("/{machine_id}/performance", response_model=List[PerformanceMetricsResponse])
async def get_performance_metrics(
    machine_id: str,
    days: int = Query(30, ge=1, le=365, description="Days of metrics to retrieve"),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get performance metrics for equipment."""
    # Verify equipment exists
    equipment = equipment_service.get_equipment(machine_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found"
        )
    
    metrics = equipment_service.get_performance_metrics(machine_id, days)
    return metrics

# Fleet Management Endpoints
@router.get("/fleet/summary", response_model=FleetSummary)
async def get_fleet_summary(
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get fleet-wide performance summary."""
    summary = equipment_service.get_fleet_performance_summary()
    return FleetSummary(**summary)

# Cost Analysis Endpoints
@router.post("/cost-analysis", response_model=CostAnalysisResponse)
async def create_cost_analysis(
    cost_data: CostAnalysisCreate,
    current_user = Depends(require_write_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Create cost analysis record."""
    cost_analysis = equipment_service.create_cost_analysis(cost_data.dict())
    return cost_analysis

@router.get("/cost-analysis/latest", response_model=CostAnalysisResponse)
async def get_latest_cost_analysis(
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get latest cost analysis."""
    cost_analysis = equipment_service.get_latest_cost_analysis()
    if not cost_analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No cost analysis found"
        )
    return cost_analysis

@router.get("/cost-analysis/trends", response_model=List[CostAnalysisResponse])
async def get_cost_trends(
    months: int = Query(12, ge=1, le=24, description="Months of trends to retrieve"),
    current_user = Depends(require_read_machines),
    equipment_service: EquipmentService = Depends(get_equipment_service)
):
    """Get cost analysis trends."""
    trends = equipment_service.get_cost_trends(months)
    return trends
