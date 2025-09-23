"""
Custom exceptions for the application.
"""
from typing import Any, Dict, Optional
from fastapi import HTTPException, status

class MiningPDMException(Exception):
    """Base exception for Mining PDM application."""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(self.message)

class EquipmentNotFoundError(MiningPDMException):
    """Raised when equipment is not found."""
    
    def __init__(self, machine_id: str):
        super().__init__(
            f"Equipment with machine ID '{machine_id}' not found",
            {"machine_id": machine_id}
        )

class TelemetryDataError(MiningPDMException):
    """Raised when telemetry data is invalid or missing."""
    
    def __init__(self, message: str, machine_id: Optional[str] = None):
        details = {"machine_id": machine_id} if machine_id else {}
        super().__init__(message, details)

class MaintenanceError(MiningPDMException):
    """Raised when maintenance operation fails."""
    
    def __init__(self, message: str, machine_id: Optional[str] = None):
        details = {"machine_id": machine_id} if machine_id else {}
        super().__init__(message, details)

class AlertError(MiningPDMException):
    """Raised when alert operation fails."""
    
    def __init__(self, message: str, alert_id: Optional[int] = None):
        details = {"alert_id": alert_id} if alert_id else {}
        super().__init__(message, details)

class AuthenticationError(MiningPDMException):
    """Raised when authentication fails."""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message)

class AuthorizationError(MiningPDMException):
    """Raised when authorization fails."""
    
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message)

class ValidationError(MiningPDMException):
    """Raised when data validation fails."""
    
    def __init__(self, message: str, field: Optional[str] = None):
        details = {"field": field} if field else {}
        super().__init__(message, details)

class DatabaseError(MiningPDMException):
    """Raised when database operation fails."""
    
    def __init__(self, message: str, operation: Optional[str] = None):
        details = {"operation": operation} if operation else {}
        super().__init__(message, details)

class ExternalServiceError(MiningPDMException):
    """Raised when external service call fails."""
    
    def __init__(self, message: str, service: Optional[str] = None):
        details = {"service": service} if service else {}
        super().__init__(message, details)

# HTTP Exception helpers
def create_http_exception(
    status_code: int,
    message: str,
    details: Optional[Dict[str, Any]] = None
) -> HTTPException:
    """Create HTTP exception with details."""
    return HTTPException(
        status_code=status_code,
        detail={
            "message": message,
            "details": details or {}
        }
    )

def equipment_not_found_exception(machine_id: str) -> HTTPException:
    """Create equipment not found HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_404_NOT_FOUND,
        message=f"Equipment with machine ID '{machine_id}' not found",
        details={"machine_id": machine_id}
    )

def telemetry_validation_exception(message: str, machine_id: Optional[str] = None) -> HTTPException:
    """Create telemetry validation HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_400_BAD_REQUEST,
        message=message,
        details={"machine_id": machine_id} if machine_id else {}
    )

def maintenance_exception(message: str, machine_id: Optional[str] = None) -> HTTPException:
    """Create maintenance HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_400_BAD_REQUEST,
        message=message,
        details={"machine_id": machine_id} if machine_id else {}
    )

def alert_not_found_exception(alert_id: int) -> HTTPException:
    """Create alert not found HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_404_NOT_FOUND,
        message=f"Alert with ID '{alert_id}' not found",
        details={"alert_id": alert_id}
    )

def authentication_exception(message: str = "Authentication failed") -> HTTPException:
    """Create authentication HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_401_UNAUTHORIZED,
        message=message
    )

def authorization_exception(message: str = "Insufficient permissions") -> HTTPException:
    """Create authorization HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_403_FORBIDDEN,
        message=message
    )

def validation_exception(message: str, field: Optional[str] = None) -> HTTPException:
    """Create validation HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message=message,
        details={"field": field} if field else {}
    )

def database_exception(message: str, operation: Optional[str] = None) -> HTTPException:
    """Create database HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message=message,
        details={"operation": operation} if operation else {}
    )

def external_service_exception(message: str, service: Optional[str] = None) -> HTTPException:
    """Create external service HTTP exception."""
    return create_http_exception(
        status_code=status.HTTP_502_BAD_GATEWAY,
        message=message,
        details={"service": service} if service else {}
    )
