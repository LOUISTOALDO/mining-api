"""
Equipment service for managing mining equipment data.
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import json

from ..models.equipment import (
    Equipment, TelemetryData, MaintenanceRecord, Alert, 
    PerformanceMetrics, CostAnalysis
)
from ..auth.models import User

class EquipmentService:
    """Service class for equipment management."""
    
    def __init__(self, db: Session):
        self.db = db
    
    # Equipment Management
    def create_equipment(self, equipment_data: Dict[str, Any]) -> Equipment:
        """Create new equipment."""
        equipment = Equipment(**equipment_data)
        self.db.add(equipment)
        self.db.commit()
        self.db.refresh(equipment)
        return equipment
    
    def get_equipment(self, machine_id: str) -> Optional[Equipment]:
        """Get equipment by machine ID."""
        return self.db.query(Equipment).filter(Equipment.machine_id == machine_id).first()
    
    def get_all_equipment(self, skip: int = 0, limit: int = 100) -> List[Equipment]:
        """Get all equipment with pagination."""
        return self.db.query(Equipment).offset(skip).limit(limit).all()
    
    def update_equipment(self, machine_id: str, equipment_data: Dict[str, Any]) -> Optional[Equipment]:
        """Update equipment information."""
        equipment = self.get_equipment(machine_id)
        if not equipment:
            return None
        
        for field, value in equipment_data.items():
            if hasattr(equipment, field):
                setattr(equipment, field, value)
        
        self.db.commit()
        self.db.refresh(equipment)
        return equipment
    
    def delete_equipment(self, machine_id: str) -> bool:
        """Delete equipment."""
        equipment = self.get_equipment(machine_id)
        if not equipment:
            return False
        
        self.db.delete(equipment)
        self.db.commit()
        return True
    
    # Telemetry Data
    def add_telemetry_data(self, machine_id: str, telemetry_data: Dict[str, Any]) -> TelemetryData:
        """Add new telemetry data."""
        telemetry = TelemetryData(
            machine_id=machine_id,
            **telemetry_data
        )
        self.db.add(telemetry)
        self.db.commit()
        self.db.refresh(telemetry)
        return telemetry
    
    def get_latest_telemetry(self, machine_id: str) -> Optional[TelemetryData]:
        """Get latest telemetry data for equipment."""
        return self.db.query(TelemetryData).filter(
            TelemetryData.machine_id == machine_id
        ).order_by(desc(TelemetryData.timestamp)).first()
    
    def get_telemetry_history(self, machine_id: str, hours: int = 24) -> List[TelemetryData]:
        """Get telemetry history for equipment."""
        since = datetime.utcnow() - timedelta(hours=hours)
        return self.db.query(TelemetryData).filter(
            and_(
                TelemetryData.machine_id == machine_id,
                TelemetryData.timestamp >= since
            )
        ).order_by(desc(TelemetryData.timestamp)).all()
    
    def get_telemetry_summary(self, machine_id: str, days: int = 7) -> Dict[str, Any]:
        """Get telemetry summary statistics."""
        since = datetime.utcnow() - timedelta(days=days)
        
        result = self.db.query(
            func.avg(TelemetryData.vibration_g).label('avg_vibration'),
            func.avg(TelemetryData.temperature_c).label('avg_temperature'),
            func.avg(TelemetryData.pressure_psi).label('avg_pressure'),
            func.avg(TelemetryData.rpm).label('avg_rpm'),
            func.avg(TelemetryData.fuel_level).label('avg_fuel_level'),
            func.avg(TelemetryData.efficiency_score).label('avg_efficiency'),
            func.avg(TelemetryData.health_score).label('avg_health'),
            func.count(TelemetryData.id).label('data_points')
        ).filter(
            and_(
                TelemetryData.machine_id == machine_id,
                TelemetryData.timestamp >= since
            )
        ).first()
        
        return {
            'avg_vibration': float(result.avg_vibration) if result.avg_vibration else 0,
            'avg_temperature': float(result.avg_temperature) if result.avg_temperature else 0,
            'avg_pressure': float(result.avg_pressure) if result.avg_pressure else 0,
            'avg_rpm': float(result.avg_rpm) if result.avg_rpm else 0,
            'avg_fuel_level': float(result.avg_fuel_level) if result.avg_fuel_level else 0,
            'avg_efficiency': float(result.avg_efficiency) if result.avg_efficiency else 0,
            'avg_health': float(result.avg_health) if result.avg_health else 0,
            'data_points': result.data_points or 0
        }
    
    # Maintenance Records
    def create_maintenance_record(self, machine_id: str, maintenance_data: Dict[str, Any]) -> MaintenanceRecord:
        """Create maintenance record."""
        maintenance = MaintenanceRecord(
            machine_id=machine_id,
            **maintenance_data
        )
        self.db.add(maintenance)
        self.db.commit()
        self.db.refresh(maintenance)
        return maintenance
    
    def get_maintenance_history(self, machine_id: str, limit: int = 50) -> List[MaintenanceRecord]:
        """Get maintenance history for equipment."""
        return self.db.query(MaintenanceRecord).filter(
            MaintenanceRecord.machine_id == machine_id
        ).order_by(desc(MaintenanceRecord.performed_at)).limit(limit).all()
    
    def get_upcoming_maintenance(self, days: int = 30) -> List[Equipment]:
        """Get equipment with upcoming maintenance."""
        target_date = date.today() + timedelta(days=days)
        return self.db.query(Equipment).filter(
            and_(
                Equipment.next_maintenance <= target_date,
                Equipment.next_maintenance >= date.today(),
                Equipment.status == 'active'
            )
        ).all()
    
    # Alerts
    def create_alert(self, machine_id: str, alert_data: Dict[str, Any]) -> Alert:
        """Create new alert."""
        alert = Alert(
            machine_id=machine_id,
            **alert_data
        )
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        return alert
    
    def get_active_alerts(self, machine_id: Optional[str] = None) -> List[Alert]:
        """Get active alerts."""
        query = self.db.query(Alert).filter(Alert.status == 'active')
        if machine_id:
            query = query.filter(Alert.machine_id == machine_id)
        return query.order_by(desc(Alert.created_at)).all()
    
    def acknowledge_alert(self, alert_id: int, user_id: int) -> Optional[Alert]:
        """Acknowledge an alert."""
        alert = self.db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return None
        
        alert.status = 'acknowledged'
        alert.acknowledged_at = datetime.utcnow()
        alert.acknowledged_by = user_id
        
        self.db.commit()
        self.db.refresh(alert)
        return alert
    
    def resolve_alert(self, alert_id: int) -> Optional[Alert]:
        """Resolve an alert."""
        alert = self.db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            return None
        
        alert.status = 'resolved'
        alert.resolved_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(alert)
        return alert
    
    # Performance Metrics
    def create_performance_metrics(self, machine_id: str, metrics_data: Dict[str, Any]) -> PerformanceMetrics:
        """Create daily performance metrics."""
        metrics = PerformanceMetrics(
            machine_id=machine_id,
            **metrics_data
        )
        self.db.add(metrics)
        self.db.commit()
        self.db.refresh(metrics)
        return metrics
    
    def get_performance_metrics(self, machine_id: str, days: int = 30) -> List[PerformanceMetrics]:
        """Get performance metrics for equipment."""
        since = date.today() - timedelta(days=days)
        return self.db.query(PerformanceMetrics).filter(
            and_(
                PerformanceMetrics.machine_id == machine_id,
                PerformanceMetrics.date >= since
            )
        ).order_by(desc(PerformanceMetrics.date)).all()
    
    def get_fleet_performance_summary(self) -> Dict[str, Any]:
        """Get fleet-wide performance summary."""
        # Get total equipment count
        total_equipment = self.db.query(Equipment).filter(Equipment.status == 'active').count()
        
        # Get active alerts count
        active_alerts = self.db.query(Alert).filter(Alert.status == 'active').count()
        
        # Get average health score from latest telemetry
        latest_telemetry = self.db.query(
            func.avg(TelemetryData.health_score).label('avg_health')
        ).join(Equipment).filter(
            and_(
                Equipment.status == 'active',
                TelemetryData.timestamp >= datetime.utcnow() - timedelta(hours=1)
            )
        ).first()
        
        # Get maintenance due count
        maintenance_due = self.db.query(Equipment).filter(
            and_(
                Equipment.next_maintenance <= date.today() + timedelta(days=7),
                Equipment.status == 'active'
            )
        ).count()
        
        return {
            'total_equipment': total_equipment,
            'active_alerts': active_alerts,
            'avg_health_score': float(latest_telemetry.avg_health) if latest_telemetry.avg_health else 0,
            'maintenance_due': maintenance_due,
            'fleet_status': 'healthy' if active_alerts < 3 and maintenance_due < 2 else 'attention_needed'
        }
    
    # Cost Analysis
    def create_cost_analysis(self, cost_data: Dict[str, Any]) -> CostAnalysis:
        """Create cost analysis record."""
        cost_analysis = CostAnalysis(**cost_data)
        self.db.add(cost_analysis)
        self.db.commit()
        self.db.refresh(cost_analysis)
        return cost_analysis
    
    def get_latest_cost_analysis(self) -> Optional[CostAnalysis]:
        """Get latest cost analysis."""
        return self.db.query(CostAnalysis).order_by(desc(CostAnalysis.created_at)).first()
    
    def get_cost_trends(self, months: int = 12) -> List[CostAnalysis]:
        """Get cost analysis trends."""
        since = date.today() - timedelta(days=months * 30)
        return self.db.query(CostAnalysis).filter(
            CostAnalysis.period_start >= since
        ).order_by(desc(CostAnalysis.period_start)).all()
    
    # Data Cleanup and Maintenance
    def cleanup_old_telemetry(self, days: int = 90) -> int:
        """Clean up old telemetry data."""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        deleted_count = self.db.query(TelemetryData).filter(
            TelemetryData.timestamp < cutoff_date
        ).delete()
        self.db.commit()
        return deleted_count
    
    def archive_resolved_alerts(self, days: int = 30) -> int:
        """Archive old resolved alerts."""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        archived_count = self.db.query(Alert).filter(
            and_(
                Alert.status == 'resolved',
                Alert.resolved_at < cutoff_date
            )
        ).delete()
        self.db.commit()
        return archived_count
