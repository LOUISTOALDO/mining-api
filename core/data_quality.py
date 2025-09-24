"""
Data quality monitoring system for detecting sensor failures and data anomalies.
Critical for maintaining data integrity with 450 trucks sending telemetry data.
"""

import numpy as np
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from collections import defaultdict, deque
from loguru import logger
import threading
from enum import Enum

class DataQualityLevel(Enum):
    """Data quality levels."""
    EXCELLENT = "excellent"    # 90-100%
    GOOD = "good"             # 80-89%
    FAIR = "fair"             # 70-79%
    POOR = "poor"             # 60-69%
    CRITICAL = "critical"     # <60%

@dataclass
class QualityIssue:
    """Represents a data quality issue."""
    machine_id: str
    issue_type: str
    severity: str
    description: str
    value: Any
    expected_range: Tuple[float, float]
    timestamp: datetime
    confidence: float = 1.0

@dataclass
class MachineDataProfile:
    """Data profile for a machine to detect anomalies."""
    machine_id: str
    temperature_stats: Dict[str, float]
    vibration_stats: Dict[str, float]
    oil_pressure_stats: Dict[str, float]
    rpm_stats: Dict[str, float]
    sample_count: int
    last_updated: datetime

class DataQualityMonitor:
    """Comprehensive data quality monitoring system."""
    
    def __init__(self):
        self.machine_profiles: Dict[str, MachineDataProfile] = {}
        self.quality_issues: Dict[str, List[QualityIssue]] = defaultdict(list)
        self.alert_thresholds = {
            'temperature': {'min': -20, 'max': 150, 'std_threshold': 3.0},
            'vibration': {'min': 0, 'max': 50, 'std_threshold': 3.0},
            'oil_pressure': {'min': 0, 'max': 10, 'std_threshold': 3.0},
            'rpm': {'min': 0, 'max': 3000, 'std_threshold': 3.0},
            'fuel_level': {'min': 0, 'max': 100, 'std_threshold': 3.0}
        }
        self._lock = threading.Lock()
        
        # Quality metrics
        self.quality_metrics = {
            'total_checks': 0,
            'issues_detected': 0,
            'machines_monitored': 0,
            'avg_quality_score': 100.0
        }
    
    def check_telemetry_quality(self, telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
        """Comprehensive telemetry data quality check."""
        machine_id = telemetry_data.get('machine_id', 'unknown')
        timestamp = datetime.now()
        
        with self._lock:
            self.quality_metrics['total_checks'] += 1
        
        issues = []
        quality_score = 100.0
        
        # Check for impossible values
        impossible_issues = self._check_impossible_values(telemetry_data, timestamp)
        issues.extend(impossible_issues)
        
        # Check for data drift
        drift_issues = self._check_data_drift(telemetry_data, timestamp)
        issues.extend(drift_issues)
        
        # Check for missing data patterns
        missing_issues = self._check_missing_data_patterns(telemetry_data, timestamp)
        issues.extend(missing_issues)
        
        # Check for sensor correlation anomalies
        correlation_issues = self._check_sensor_correlations(telemetry_data, timestamp)
        issues.extend(correlation_issues)
        
        # Calculate quality score
        quality_score = self._calculate_quality_score(issues)
        
        # Store issues
        if issues:
            with self._lock:
                self.quality_issues[machine_id].extend(issues)
                self.quality_metrics['issues_detected'] += len(issues)
        
        # Update machine profile
        self._update_machine_profile(telemetry_data)
        
        return {
            'machine_id': machine_id,
            'quality_score': quality_score,
            'quality_level': self._get_quality_level(quality_score),
            'issues_count': len(issues),
            'issues': [self._issue_to_dict(issue) for issue in issues],
            'is_healthy': len(issues) == 0,
            'timestamp': timestamp.isoformat()
        }
    
    def _check_impossible_values(self, data: Dict[str, Any], timestamp: datetime) -> List[QualityIssue]:
        """Check for physically impossible values."""
        issues = []
        machine_id = data.get('machine_id', 'unknown')
        
        # Temperature checks
        temp = data.get('temperature')
        if temp is not None:
            if temp < -50 or temp > 200:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='impossible_temperature',
                    severity='critical',
                    description=f'Temperature {temp}°C is outside physically possible range',
                    value=temp,
                    expected_range=(-50, 200),
                    timestamp=timestamp
                ))
        
        # Vibration checks
        vibration = data.get('vibration')
        if vibration is not None:
            if vibration < 0 or vibration > 100:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='impossible_vibration',
                    severity='critical',
                    description=f'Vibration {vibration}g is outside possible range',
                    value=vibration,
                    expected_range=(0, 100),
                    timestamp=timestamp
                ))
        
        # Oil pressure checks
        oil_pressure = data.get('oil_pressure')
        if oil_pressure is not None:
            if oil_pressure < 0 or oil_pressure > 15:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='impossible_oil_pressure',
                    severity='critical',
                    description=f'Oil pressure {oil_pressure}bar is outside possible range',
                    value=oil_pressure,
                    expected_range=(0, 15),
                    timestamp=timestamp
                ))
        
        # RPM checks
        rpm = data.get('rpm')
        if rpm is not None:
            if rpm < 0 or rpm > 4000:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='impossible_rpm',
                    severity='critical',
                    description=f'RPM {rpm} is outside possible range',
                    value=rpm,
                    expected_range=(0, 4000),
                    timestamp=timestamp
                ))
        
        return issues
    
    def _check_data_drift(self, data: Dict[str, Any], timestamp: datetime) -> List[QualityIssue]:
        """Check for data drift using statistical analysis."""
        issues = []
        machine_id = data.get('machine_id', 'unknown')
        
        if machine_id not in self.machine_profiles:
            return issues
        
        profile = self.machine_profiles[machine_id]
        
        # Check temperature drift
        temp = data.get('temperature')
        if temp is not None and 'mean' in profile.temperature_stats:
            temp_mean = profile.temperature_stats['mean']
            temp_std = profile.temperature_stats.get('std', 5.0)
            
            if abs(temp - temp_mean) > 3 * temp_std:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='temperature_drift',
                    severity='warning',
                    description=f'Temperature {temp}°C deviates significantly from historical mean {temp_mean:.1f}°C',
                    value=temp,
                    expected_range=(temp_mean - 3*temp_std, temp_mean + 3*temp_std),
                    timestamp=timestamp,
                    confidence=0.8
                ))
        
        # Check vibration drift
        vibration = data.get('vibration')
        if vibration is not None and 'mean' in profile.vibration_stats:
            vib_mean = profile.vibration_stats['mean']
            vib_std = profile.vibration_stats.get('std', 1.0)
            
            if abs(vibration - vib_mean) > 3 * vib_std:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='vibration_drift',
                    severity='warning',
                    description=f'Vibration {vibration}g deviates significantly from historical mean {vib_mean:.1f}g',
                    value=vibration,
                    expected_range=(vib_mean - 3*vib_std, vib_mean + 3*vib_std),
                    timestamp=timestamp,
                    confidence=0.8
                ))
        
        return issues
    
    def _check_missing_data_patterns(self, data: Dict[str, Any], timestamp: datetime) -> List[QualityIssue]:
        """Check for patterns in missing data that might indicate sensor failure."""
        issues = []
        machine_id = data.get('machine_id', 'unknown')
        
        # Check for null or zero values in critical sensors
        critical_sensors = ['temperature', 'vibration', 'oil_pressure', 'rpm']
        
        for sensor in critical_sensors:
            value = data.get(sensor)
            if value is None or value == 0:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='missing_sensor_data',
                    severity='high',
                    description=f'{sensor} sensor data is missing or zero',
                    value=value,
                    expected_range=(0.1, 1000),  # Placeholder range
                    timestamp=timestamp
                ))
        
        return issues
    
    def _check_sensor_correlations(self, data: Dict[str, Any], timestamp: datetime) -> List[QualityIssue]:
        """Check for sensor correlation anomalies."""
        issues = []
        machine_id = data.get('machine_id', 'unknown')
        
        # Check temperature vs RPM correlation
        temp = data.get('temperature')
        rpm = data.get('rpm')
        
        if temp is not None and rpm is not None:
            # High RPM should generally correlate with higher temperature
            if rpm > 2000 and temp < 60:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='sensor_correlation_anomaly',
                    severity='medium',
                    description=f'High RPM ({rpm}) with low temperature ({temp}°C) - possible sensor issue',
                    value={'rpm': rpm, 'temperature': temp},
                    expected_range=(60, 200),
                    timestamp=timestamp,
                    confidence=0.6
                ))
        
        # Check oil pressure vs temperature correlation
        oil_pressure = data.get('oil_pressure')
        if temp is not None and oil_pressure is not None:
            # Oil pressure should be relatively stable regardless of temperature
            if temp > 100 and oil_pressure < 1.0:
                issues.append(QualityIssue(
                    machine_id=machine_id,
                    issue_type='oil_pressure_temperature_anomaly',
                    severity='high',
                    description=f'High temperature ({temp}°C) with very low oil pressure ({oil_pressure}bar)',
                    value={'temperature': temp, 'oil_pressure': oil_pressure},
                    expected_range=(1.0, 10.0),
                    timestamp=timestamp,
                    confidence=0.9
                ))
        
        return issues
    
    def _update_machine_profile(self, data: Dict[str, Any]):
        """Update machine data profile for drift detection."""
        machine_id = data.get('machine_id', 'unknown')
        
        if machine_id not in self.machine_profiles:
            self.machine_profiles[machine_id] = MachineDataProfile(
                machine_id=machine_id,
                temperature_stats={},
                vibration_stats={},
                oil_pressure_stats={},
                rpm_stats={},
                sample_count=0,
                last_updated=datetime.now()
            )
        
        profile = self.machine_profiles[machine_id]
        profile.sample_count += 1
        profile.last_updated = datetime.now()
        
        # Update temperature statistics
        temp = data.get('temperature')
        if temp is not None:
            self._update_statistics(profile.temperature_stats, temp)
        
        # Update vibration statistics
        vibration = data.get('vibration')
        if vibration is not None:
            self._update_statistics(profile.vibration_stats, vibration)
        
        # Update oil pressure statistics
        oil_pressure = data.get('oil_pressure')
        if oil_pressure is not None:
            self._update_statistics(profile.oil_pressure_stats, oil_pressure)
        
        # Update RPM statistics
        rpm = data.get('rpm')
        if rpm is not None:
            self._update_statistics(profile.rpm_stats, rpm)
    
    def _update_statistics(self, stats: Dict[str, float], value: float):
        """Update running statistics for a sensor."""
        if 'mean' not in stats:
            stats['mean'] = value
            stats['std'] = 0.0
            stats['min'] = value
            stats['max'] = value
            stats['count'] = 1
        else:
            # Update running mean and std (simplified Welford's algorithm)
            count = stats['count']
            old_mean = stats['mean']
            
            stats['count'] += 1
            stats['mean'] = (old_mean * count + value) / (count + 1)
            
            # Update min/max
            stats['min'] = min(stats['min'], value)
            stats['max'] = max(stats['max'], value)
            
            # Simplified std calculation (not exact but good enough for drift detection)
            if count > 1:
                stats['std'] = abs(value - old_mean) * 0.1 + stats['std'] * 0.9
    
    def _calculate_quality_score(self, issues: List[QualityIssue]) -> float:
        """Calculate overall quality score based on issues."""
        if not issues:
            return 100.0
        
        score = 100.0
        for issue in issues:
            if issue.severity == 'critical':
                score -= 25
            elif issue.severity == 'high':
                score -= 15
            elif issue.severity == 'medium':
                score -= 10
            elif issue.severity == 'warning':
                score -= 5
        
        return max(0, score)
    
    def _get_quality_level(self, score: float) -> str:
        """Get quality level based on score."""
        if score >= 90:
            return DataQualityLevel.EXCELLENT.value
        elif score >= 80:
            return DataQualityLevel.GOOD.value
        elif score >= 70:
            return DataQualityLevel.FAIR.value
        elif score >= 60:
            return DataQualityLevel.POOR.value
        else:
            return DataQualityLevel.CRITICAL.value
    
    def _issue_to_dict(self, issue: QualityIssue) -> Dict[str, Any]:
        """Convert QualityIssue to dictionary."""
        return {
            'type': issue.issue_type,
            'severity': issue.severity,
            'description': issue.description,
            'value': issue.value,
            'expected_range': issue.expected_range,
            'timestamp': issue.timestamp.isoformat(),
            'confidence': issue.confidence
        }
    
    def get_quality_report(self) -> Dict[str, Any]:
        """Get comprehensive data quality report."""
        with self._lock:
            total_machines = len(self.machine_profiles)
            machines_with_issues = len(self.quality_issues)
            
            # Calculate average quality score
            if total_machines > 0:
                total_issues = sum(len(issues) for issues in self.quality_issues.values())
                avg_quality_score = max(0, 100 - (total_issues / total_machines * 10))
            else:
                avg_quality_score = 100.0
            
            # Get recent issues (last 24 hours)
            recent_cutoff = datetime.now() - timedelta(hours=24)
            recent_issues = []
            
            for machine_id, issues in self.quality_issues.items():
                for issue in issues:
                    if issue.timestamp > recent_cutoff:
                        recent_issues.append(self._issue_to_dict(issue))
            
            # Sort by severity and timestamp
            severity_order = {'critical': 0, 'high': 1, 'medium': 2, 'warning': 3}
            recent_issues.sort(key=lambda x: (severity_order.get(x['severity'], 4), x['timestamp']))
            
            return {
                'overall_quality_score': round(avg_quality_score, 2),
                'quality_level': self._get_quality_level(avg_quality_score),
                'total_machines': total_machines,
                'machines_with_issues': machines_with_issues,
                'total_issues': sum(len(issues) for issues in self.quality_issues.values()),
                'recent_issues': recent_issues[-20:],  # Last 20 issues
                'quality_metrics': self.quality_metrics,
                'timestamp': datetime.now().isoformat()
            }
    
    def get_machine_quality_history(self, machine_id: str, hours: int = 24) -> Dict[str, Any]:
        """Get quality history for a specific machine."""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        machine_issues = []
        if machine_id in self.quality_issues:
            for issue in self.quality_issues[machine_id]:
                if issue.timestamp > cutoff_time:
                    machine_issues.append(self._issue_to_dict(issue))
        
        # Get machine profile
        profile = self.machine_profiles.get(machine_id)
        profile_data = None
        if profile:
            profile_data = {
                'sample_count': profile.sample_count,
                'last_updated': profile.last_updated.isoformat(),
                'temperature_stats': profile.temperature_stats,
                'vibration_stats': profile.vibration_stats,
                'oil_pressure_stats': profile.oil_pressure_stats,
                'rpm_stats': profile.rpm_stats
            }
        
        return {
            'machine_id': machine_id,
            'issues_count': len(machine_issues),
            'issues': machine_issues,
            'profile': profile_data,
            'time_range_hours': hours,
            'timestamp': datetime.now().isoformat()
        }
    
    def clear_old_issues(self, hours: int = 168):  # Default 1 week
        """Clear old quality issues to prevent memory buildup."""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        with self._lock:
            for machine_id in list(self.quality_issues.keys()):
                self.quality_issues[machine_id] = [
                    issue for issue in self.quality_issues[machine_id]
                    if issue.timestamp > cutoff_time
                ]
                
                # Remove empty entries
                if not self.quality_issues[machine_id]:
                    del self.quality_issues[machine_id]

# Global data quality monitor
data_quality_monitor = DataQualityMonitor()

# Utility functions
def check_telemetry_quality(telemetry_data: Dict[str, Any]) -> Dict[str, Any]:
    """Check quality of telemetry data."""
    return data_quality_monitor.check_telemetry_quality(telemetry_data)

def get_data_quality_report() -> Dict[str, Any]:
    """Get data quality report."""
    return data_quality_monitor.get_quality_report()

def get_machine_quality_history(machine_id: str, hours: int = 24) -> Dict[str, Any]:
    """Get quality history for a machine."""
    return data_quality_monitor.get_machine_quality_history(machine_id, hours)
