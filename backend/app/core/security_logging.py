"""
Comprehensive security event logging system.
"""
import json
import time
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import Request
from loguru import logger
import os
import hashlib

class SecurityLogger:
    """Centralized security event logging."""
    
    def __init__(self):
        self.log_file = os.getenv("SECURITY_LOG_FILE", "security_events.log")
        self.enable_file_logging = os.getenv("ENABLE_SECURITY_FILE_LOGGING", "true").lower() == "true"
        self.enable_console_logging = os.getenv("ENABLE_SECURITY_CONSOLE_LOGGING", "true").lower() == "true"
        
        # Configure security-specific logger
        if self.enable_file_logging:
            logger.add(
                self.log_file,
                format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level} | {message}",
                level="WARNING",
                filter=lambda record: "SECURITY_EVENT" in record["message"],
                rotation="1 day",
                retention="30 days",
                compression="zip"
            )
    
    def log_security_event(
        self,
        event_type: str,
        severity: str = "WARNING",
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None
    ):
        """Log a security event with comprehensive details."""
        
        # Extract request details if provided
        if request:
            ip_address = ip_address or request.client.host
            user_agent = user_agent or request.headers.get("User-Agent", "")
            path = request.url.path
            method = request.method
            headers = dict(request.headers)
        else:
            path = details.get("path") if details else None
            method = details.get("method") if details else None
            headers = details.get("headers") if details else {}
        
        # Create security event
        security_event = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "severity": severity,
            "user_id": user_id,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "path": path,
            "method": method,
            "details": details or {},
            "event_id": self._generate_event_id(event_type, ip_address, user_id)
        }
        
        # Log to console
        if self.enable_console_logging:
            log_message = f"SECURITY_EVENT: {event_type}"
            if user_id:
                log_message += f" - User: {user_id}"
            if ip_address:
                log_message += f" - IP: {ip_address}"
            if details:
                log_message += f" - Details: {json.dumps(details)}"
            
            if severity == "CRITICAL":
                logger.critical(log_message)
            elif severity == "ERROR":
                logger.error(log_message)
            elif severity == "WARNING":
                logger.warning(log_message)
            else:
                logger.info(log_message)
        
        # Log to file
        if self.enable_file_logging:
            with open(self.log_file, "a") as f:
                f.write(json.dumps(security_event) + "\n")
    
    def _generate_event_id(self, event_type: str, ip_address: Optional[str], user_id: Optional[str]) -> str:
        """Generate a unique event ID."""
        data = f"{event_type}_{ip_address}_{user_id}_{time.time()}"
        return hashlib.md5(data.encode()).hexdigest()[:16]
    
    # Specific security event methods
    def log_authentication_failure(self, ip_address: str, user_agent: str, details: Dict[str, Any]):
        """Log authentication failure."""
        self.log_security_event(
            event_type="authentication_failure",
            severity="WARNING",
            ip_address=ip_address,
            user_agent=user_agent,
            details=details
        )
    
    def log_authentication_success(self, user_id: str, ip_address: str, user_agent: str):
        """Log successful authentication."""
        self.log_security_event(
            event_type="authentication_success",
            severity="INFO",
            user_id=user_id,
            ip_address=ip_address,
            user_agent=user_agent
        )
    
    def log_rate_limit_exceeded(self, ip_address: str, user_id: Optional[str], limit_type: str):
        """Log rate limit exceeded."""
        self.log_security_event(
            event_type="rate_limit_exceeded",
            severity="WARNING",
            user_id=user_id,
            ip_address=ip_address,
            details={"limit_type": limit_type}
        )
    
    def log_suspicious_activity(self, event_type: str, ip_address: str, details: Dict[str, Any]):
        """Log suspicious activity."""
        self.log_security_event(
            event_type=f"suspicious_activity_{event_type}",
            severity="ERROR",
            ip_address=ip_address,
            details=details
        )
    
    def log_data_access(self, user_id: str, resource_type: str, action: str, details: Dict[str, Any]):
        """Log data access events."""
        self.log_security_event(
            event_type="data_access",
            severity="INFO",
            user_id=user_id,
            details={
                "resource_type": resource_type,
                "action": action,
                **details
            }
        )
    
    def log_privilege_escalation_attempt(self, user_id: str, ip_address: str, details: Dict[str, Any]):
        """Log privilege escalation attempts."""
        self.log_security_event(
            event_type="privilege_escalation_attempt",
            severity="CRITICAL",
            user_id=user_id,
            ip_address=ip_address,
            details=details
        )
    
    def log_session_anomaly(self, user_id: str, ip_address: str, anomaly_type: str, details: Dict[str, Any]):
        """Log session anomalies."""
        self.log_security_event(
            event_type="session_anomaly",
            severity="WARNING",
            user_id=user_id,
            ip_address=ip_address,
            details={
                "anomaly_type": anomaly_type,
                **details
            }
        )
    
    def log_input_validation_failure(self, ip_address: str, validation_errors: list, details: Dict[str, Any]):
        """Log input validation failures."""
        self.log_security_event(
            event_type="input_validation_failure",
            severity="WARNING",
            ip_address=ip_address,
            details={
                "validation_errors": validation_errors,
                **details
            }
        )
    
    def log_sql_injection_attempt(self, ip_address: str, user_agent: str, details: Dict[str, Any]):
        """Log SQL injection attempts."""
        self.log_security_event(
            event_type="sql_injection_attempt",
            severity="CRITICAL",
            ip_address=ip_address,
            user_agent=user_agent,
            details=details
        )
    
    def log_xss_attempt(self, ip_address: str, user_agent: str, details: Dict[str, Any]):
        """Log XSS attempts."""
        self.log_security_event(
            event_type="xss_attempt",
            severity="CRITICAL",
            ip_address=ip_address,
            user_agent=user_agent,
            details=details
        )
    
    def log_file_upload_attempt(self, user_id: str, ip_address: str, file_details: Dict[str, Any]):
        """Log file upload attempts."""
        self.log_security_event(
            event_type="file_upload",
            severity="INFO",
            user_id=user_id,
            ip_address=ip_address,
            details=file_details
        )
    
    def log_configuration_change(self, user_id: str, change_type: str, details: Dict[str, Any]):
        """Log configuration changes."""
        self.log_security_event(
            event_type="configuration_change",
            severity="WARNING",
            user_id=user_id,
            details={
                "change_type": change_type,
                **details
            }
        )

# Global security logger instance
security_logger = SecurityLogger()

# Convenience functions
def log_auth_failure(ip_address: str, user_agent: str, details: Dict[str, Any]):
    """Log authentication failure."""
    security_logger.log_authentication_failure(ip_address, user_agent, details)

def log_auth_success(user_id: str, ip_address: str, user_agent: str):
    """Log successful authentication."""
    security_logger.log_authentication_success(user_id, ip_address, user_agent)

def log_rate_limit(ip_address: str, user_id: Optional[str], limit_type: str):
    """Log rate limit exceeded."""
    security_logger.log_rate_limit_exceeded(ip_address, user_id, limit_type)

def log_suspicious_activity(event_type: str, ip_address: str, details: Dict[str, Any]):
    """Log suspicious activity."""
    security_logger.log_suspicious_activity(event_type, ip_address, details)

def log_data_access(user_id: str, resource_type: str, action: str, details: Dict[str, Any]):
    """Log data access."""
    security_logger.log_data_access(user_id, resource_type, action, details)

def log_privilege_escalation(user_id: str, ip_address: str, details: Dict[str, Any]):
    """Log privilege escalation attempt."""
    security_logger.log_privilege_escalation_attempt(user_id, ip_address, details)

def log_session_anomaly(user_id: str, ip_address: str, anomaly_type: str, details: Dict[str, Any]):
    """Log session anomaly."""
    security_logger.log_session_anomaly(user_id, ip_address, anomaly_type, details)

def log_input_validation_failure(ip_address: str, validation_errors: list, details: Dict[str, Any]):
    """Log input validation failure."""
    security_logger.log_input_validation_failure(ip_address, validation_errors, details)

def log_sql_injection(ip_address: str, user_agent: str, details: Dict[str, Any]):
    """Log SQL injection attempt."""
    security_logger.log_sql_injection_attempt(ip_address, user_agent, details)

def log_xss_attempt(ip_address: str, user_agent: str, details: Dict[str, Any]):
    """Log XSS attempt."""
    security_logger.log_xss_attempt(ip_address, user_agent, details)

