"""
Data models package - imports models from equipment.py
"""

# Import models from equipment.py
from .equipment import (
    Equipment, 
    TelemetryData, 
    MaintenanceRecord, 
    Alert, 
    PerformanceMetrics,
    CostAnalysis,
    Report,
    AuditLog
)

# For backward compatibility, create aliases
Machine = Equipment  # Map old Machine to new Equipment
Telemetry = TelemetryData  # Map old Telemetry to new TelemetryData
Event = Alert  # Map old Event to new Alert

# Make models available at package level
__all__ = [
    "Equipment", "TelemetryData", "MaintenanceRecord", "Alert", 
    "PerformanceMetrics", "CostAnalysis", "Report", "AuditLog",
    "Machine", "Telemetry", "Event"  # Backward compatibility aliases
]
