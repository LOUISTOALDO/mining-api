"""
Pydantic schemas for equipment and telemetry data.
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum

class EquipmentStatus(str, Enum):
    """Equipment status enumeration."""
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    INACTIVE = "inactive"

class EquipmentType(str, Enum):
    """Equipment type enumeration."""
    EXCAVATOR = "excavator"
    HAUL_TRUCK = "haul-truck"
    CRUSHER = "crusher"
    LOADER = "loader"
    DRILL = "drill"
    BULLDOZER = "bulldozer"
    GRADER = "grader"

class AlertSeverity(str, Enum):
    """Alert severity enumeration."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertType(str, Enum):
    """Alert type enumeration."""
    MAINTENANCE = "maintenance"
    PERFORMANCE = "performance"
    SAFETY = "safety"
    SYSTEM = "system"

class MaintenanceType(str, Enum):
    """Maintenance type enumeration."""
    PREVENTIVE = "preventive"
    CORRECTIVE = "corrective"
    EMERGENCY = "emergency"
    PREDICTIVE = "predictive"

# Equipment Schemas
class EquipmentBase(BaseModel):
    """Base equipment schema."""
    machine_id: str = Field(..., min_length=1, max_length=100, description="Unique machine identifier")
    name: str = Field(..., min_length=1, max_length=255, description="Equipment name")
    type: EquipmentType = Field(..., description="Equipment type")
    model: Optional[str] = Field(None, max_length=100, description="Equipment model")
    manufacturer: Optional[str] = Field(None, max_length=100, description="Manufacturer")
    serial_number: Optional[str] = Field(None, max_length=100, description="Serial number")
    location: Optional[str] = Field(None, max_length=255, description="Location")
    status: EquipmentStatus = Field(EquipmentStatus.ACTIVE, description="Equipment status")
    installation_date: Optional[date] = Field(None, description="Installation date")
    last_maintenance: Optional[date] = Field(None, description="Last maintenance date")
    next_maintenance: Optional[date] = Field(None, description="Next maintenance date")

class EquipmentCreate(EquipmentBase):
    """Schema for creating equipment."""
    pass

class EquipmentUpdate(BaseModel):
    """Schema for updating equipment."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    type: Optional[EquipmentType] = None
    model: Optional[str] = Field(None, max_length=100)
    manufacturer: Optional[str] = Field(None, max_length=100)
    serial_number: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=255)
    status: Optional[EquipmentStatus] = None
    installation_date: Optional[date] = None
    last_maintenance: Optional[date] = None
    next_maintenance: Optional[date] = None

class EquipmentResponse(EquipmentBase):
    """Schema for equipment response."""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Telemetry Schemas
class TelemetryDataBase(BaseModel):
    """Base telemetry data schema."""
    vibration_g: Optional[float] = Field(None, ge=0, le=50, description="Vibration in g-force")
    temperature_c: Optional[float] = Field(None, ge=-50, le=200, description="Temperature in Celsius")
    pressure_psi: Optional[float] = Field(None, ge=0, le=1000, description="Pressure in PSI")
    rpm: Optional[int] = Field(None, ge=0, le=10000, description="Rotations per minute")
    fuel_level: Optional[float] = Field(None, ge=0, le=100, description="Fuel level percentage")
    runtime_hours: Optional[float] = Field(None, ge=0, description="Total runtime hours")
    load_percentage: Optional[float] = Field(None, ge=0, le=100, description="Current load percentage")
    efficiency_score: Optional[float] = Field(None, ge=0, le=1, description="Efficiency score")
    health_score: Optional[float] = Field(None, ge=0, le=1, description="Health score")

class TelemetryDataCreate(TelemetryDataBase):
    """Schema for creating telemetry data."""
    machine_id: str = Field(..., description="Machine ID")

class TelemetryDataResponse(TelemetryDataBase):
    """Schema for telemetry data response."""
    id: int
    machine_id: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

class TelemetrySummary(BaseModel):
    """Schema for telemetry summary."""
    machine_id: str
    avg_vibration: float
    avg_temperature: float
    avg_pressure: float
    avg_rpm: float
    avg_fuel_level: float
    avg_efficiency: float
    avg_health: float
    data_points: int
    period_hours: int

# Maintenance Schemas
class MaintenanceRecordBase(BaseModel):
    """Base maintenance record schema."""
    maintenance_type: MaintenanceType = Field(..., description="Type of maintenance")
    description: Optional[str] = Field(None, description="Maintenance description")
    performed_by: Optional[str] = Field(None, max_length=255, description="Performed by")
    cost: Optional[float] = Field(None, ge=0, description="Maintenance cost")
    parts_used: Optional[str] = Field(None, description="Parts used (JSON string)")
    notes: Optional[str] = Field(None, description="Additional notes")

class MaintenanceRecordCreate(MaintenanceRecordBase):
    """Schema for creating maintenance record."""
    machine_id: str = Field(..., description="Machine ID")

class MaintenanceRecordResponse(MaintenanceRecordBase):
    """Schema for maintenance record response."""
    id: int
    machine_id: str
    performed_at: datetime
    
    class Config:
        from_attributes = True

# Alert Schemas
class AlertBase(BaseModel):
    """Base alert schema."""
    alert_type: AlertType = Field(..., description="Type of alert")
    severity: AlertSeverity = Field(..., description="Alert severity")
    message: str = Field(..., min_length=1, description="Alert message")

class AlertCreate(AlertBase):
    """Schema for creating alert."""
    machine_id: str = Field(..., description="Machine ID")

class AlertResponse(AlertBase):
    """Schema for alert response."""
    id: int
    machine_id: str
    status: str
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    acknowledged_by: Optional[int] = None
    resolved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    """Schema for updating alert."""
    status: Optional[str] = Field(None, description="Alert status")

# Performance Metrics Schemas
class PerformanceMetricsBase(BaseModel):
    """Base performance metrics schema."""
    date: date = Field(..., description="Date of metrics")
    total_runtime_hours: Optional[float] = Field(None, ge=0, description="Total runtime hours")
    average_efficiency: Optional[float] = Field(None, ge=0, le=1, description="Average efficiency")
    fuel_consumption: Optional[float] = Field(None, ge=0, description="Fuel consumption")
    maintenance_cost: Optional[float] = Field(None, ge=0, description="Maintenance cost")
    production_volume: Optional[float] = Field(None, ge=0, description="Production volume")
    downtime_hours: Optional[float] = Field(None, ge=0, description="Downtime hours")

class PerformanceMetricsCreate(PerformanceMetricsBase):
    """Schema for creating performance metrics."""
    machine_id: str = Field(..., description="Machine ID")

class PerformanceMetricsResponse(PerformanceMetricsBase):
    """Schema for performance metrics response."""
    id: int
    machine_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Cost Analysis Schemas
class CostAnalysisBase(BaseModel):
    """Base cost analysis schema."""
    period_start: date = Field(..., description="Period start date")
    period_end: date = Field(..., description="Period end date")
    total_operational_cost: Optional[float] = Field(None, ge=0, description="Total operational cost")
    fuel_cost: Optional[float] = Field(None, ge=0, description="Fuel cost")
    maintenance_cost: Optional[float] = Field(None, ge=0, description="Maintenance cost")
    labor_cost: Optional[float] = Field(None, ge=0, description="Labor cost")
    cost_per_hour: Optional[float] = Field(None, ge=0, description="Cost per hour")
    cost_per_ton: Optional[float] = Field(None, ge=0, description="Cost per ton")
    efficiency_savings: Optional[float] = Field(None, description="Efficiency savings")
    roi_percentage: Optional[float] = Field(None, description="ROI percentage")

class CostAnalysisCreate(CostAnalysisBase):
    """Schema for creating cost analysis."""
    pass

class CostAnalysisResponse(CostAnalysisBase):
    """Schema for cost analysis response."""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Fleet Summary Schemas
class FleetSummary(BaseModel):
    """Schema for fleet summary."""
    total_equipment: int
    active_alerts: int
    avg_health_score: float
    maintenance_due: int
    fleet_status: str

# Equipment with Telemetry
class EquipmentWithTelemetry(EquipmentResponse):
    """Equipment with latest telemetry data."""
    latest_telemetry: Optional[TelemetryDataResponse] = None
    active_alerts: List[AlertResponse] = []
    maintenance_due: bool = False

# Pagination Schemas
class PaginatedResponse(BaseModel):
    """Base paginated response schema."""
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int

class EquipmentListResponse(PaginatedResponse):
    """Paginated equipment list response."""
    items: List[EquipmentResponse]

class TelemetryListResponse(PaginatedResponse):
    """Paginated telemetry list response."""
    items: List[TelemetryDataResponse]

class AlertListResponse(PaginatedResponse):
    """Paginated alert list response."""
    items: List[AlertResponse]

# Validation helpers
class EquipmentValidator:
    """Equipment validation helpers."""
    
    @staticmethod
    def validate_machine_id(machine_id: str) -> bool:
        """Validate machine ID format."""
        # Basic validation - can be extended
        return len(machine_id) >= 3 and machine_id.replace('-', '').replace('_', '').isalnum()
    
    @staticmethod
    def validate_maintenance_dates(installation_date: Optional[date], 
                                 last_maintenance: Optional[date], 
                                 next_maintenance: Optional[date]) -> bool:
        """Validate maintenance date logic."""
        if installation_date and last_maintenance and last_maintenance < installation_date:
            return False
        if last_maintenance and next_maintenance and next_maintenance < last_maintenance:
            return False
        return True
