"""
Equipment and telemetry data models.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, date
from typing import Optional, List
from ..db import Base

class Equipment(Base):
    """Equipment model for mining machinery."""
    
    __tablename__ = "equipment"
    
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)  # excavator, haul-truck, crusher, etc.
    model = Column(String(100))
    manufacturer = Column(String(100))
    serial_number = Column(String(100))
    location = Column(String(255))
    status = Column(String(50), default="active")  # active, maintenance, inactive
    installation_date = Column(Date)
    last_maintenance = Column(Date)
    next_maintenance = Column(Date)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    telemetry_data = relationship("TelemetryData", back_populates="equipment")
    maintenance_records = relationship("MaintenanceRecord", back_populates="equipment")
    alerts = relationship("Alert", back_populates="equipment")
    performance_metrics = relationship("PerformanceMetrics", back_populates="equipment")

class TelemetryData(Base):
    """Real-time telemetry data from equipment."""
    
    __tablename__ = "telemetry_data"
    
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(100), ForeignKey("equipment.machine_id"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Sensor data
    vibration_g = Column(Float)  # Vibration in g-force
    temperature_c = Column(Float)  # Temperature in Celsius
    pressure_psi = Column(Float)  # Pressure in PSI
    rpm = Column(Integer)  # Rotations per minute
    fuel_level = Column(Float)  # Fuel level percentage
    runtime_hours = Column(Float)  # Total runtime hours
    load_percentage = Column(Float)  # Current load percentage
    
    # Calculated metrics
    efficiency_score = Column(Float)  # Efficiency score (0-1)
    health_score = Column(Float)  # Health score (0-1)
    
    # Relationships
    equipment = relationship("Equipment", back_populates="telemetry_data")

class MaintenanceRecord(Base):
    """Maintenance history and records."""
    
    __tablename__ = "maintenance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(100), ForeignKey("equipment.machine_id"), nullable=False)
    maintenance_type = Column(String(100), nullable=False)  # preventive, corrective, emergency
    description = Column(Text)
    performed_by = Column(String(255))
    performed_at = Column(DateTime(timezone=True), server_default=func.now())
    cost = Column(Float)
    parts_used = Column(Text)  # JSON string of parts
    notes = Column(Text)
    
    # Relationships
    equipment = relationship("Equipment", back_populates="maintenance_records")

class Alert(Base):
    """System alerts and notifications."""
    
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(100), ForeignKey("equipment.machine_id"), nullable=False)
    alert_type = Column(String(100), nullable=False)  # maintenance, performance, safety
    severity = Column(String(50), nullable=False)  # low, medium, high, critical
    message = Column(Text, nullable=False)
    status = Column(String(50), default="active")  # active, acknowledged, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    acknowledged_at = Column(DateTime(timezone=True))
    acknowledged_by = Column(Integer, ForeignKey("users.id"))
    resolved_at = Column(DateTime(timezone=True))
    
    # Relationships
    equipment = relationship("Equipment", back_populates="alerts")
    acknowledged_user = relationship("User", foreign_keys=[acknowledged_by])

class PerformanceMetrics(Base):
    """Daily performance metrics for equipment."""
    
    __tablename__ = "performance_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(String(100), ForeignKey("equipment.machine_id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    
    # Daily metrics
    total_runtime_hours = Column(Float)
    average_efficiency = Column(Float)
    fuel_consumption = Column(Float)
    maintenance_cost = Column(Float)
    production_volume = Column(Float)
    downtime_hours = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    equipment = relationship("Equipment", back_populates="performance_metrics")
    
    # Unique constraint
    __table_args__ = (
        {"sqlite_autoincrement": True},
    )

class CostAnalysis(Base):
    """Cost analysis and financial metrics."""
    
    __tablename__ = "cost_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    
    # Cost breakdown
    total_operational_cost = Column(Float)
    fuel_cost = Column(Float)
    maintenance_cost = Column(Float)
    labor_cost = Column(Float)
    
    # Efficiency metrics
    cost_per_hour = Column(Float)
    cost_per_ton = Column(Float)
    efficiency_savings = Column(Float)
    roi_percentage = Column(Float)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Report(Base):
    """Generated reports and documents."""
    
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(String(100), nullable=False)  # performance, maintenance, cost
    title = Column(String(255), nullable=False)
    description = Column(Text)
    parameters = Column(Text)  # JSON string of report parameters
    generated_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    file_path = Column(String(500))  # Path to generated file
    status = Column(String(50), default="generated")  # generated, failed, processing
    
    # Relationships
    generator = relationship("User")

class AuditLog(Base):
    """Audit trail for system activities."""
    
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(String(100), nullable=False)  # create, update, delete, login, etc.
    resource_type = Column(String(100))  # user, equipment, telemetry, etc.
    resource_id = Column(String(100))  # ID of the affected resource
    details = Column(Text)  # Additional details about the action
    ip_address = Column(String(45))  # IPv6 compatible
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    user = relationship("User")
