"""
Input validation and sanitization for secure data handling.
Critical for handling 450 trucks sending telemetry data.
"""

import re
import html
from typing import Any, Optional
from pydantic import BaseModel, validator, Field
from datetime import datetime

def sanitize_input(value: str) -> str:
    """Sanitize input to prevent SQL injection and XSS attacks."""
    if not isinstance(value, str):
        return str(value)
    
    # HTML escape to prevent XSS
    sanitized = html.escape(value)
    
    # Remove potentially dangerous SQL characters
    sanitized = re.sub(r'[;\\\'"`]', '', sanitized)
    
    # Remove script tags and javascript
    sanitized = re.sub(r'<script.*?</script>', '', sanitized, flags=re.IGNORECASE | re.DOTALL)
    sanitized = re.sub(r'javascript:', '', sanitized, flags=re.IGNORECASE)
    
    return sanitized.strip()

class SecureTelemetryInput(BaseModel):
    """Secure telemetry input with comprehensive validation for 450 trucks."""
    
    timestamp: str = Field(..., description="ISO timestamp")
    machine_id: str = Field(..., description="Machine identifier", max_length=50)
    model: str = Field(..., description="Machine model", max_length=100)
    temperature: float = Field(..., description="Temperature in Celsius")
    vibration: float = Field(..., description="Vibration in g")
    oil_pressure: float = Field(..., description="Oil pressure in bar")
    rpm: float = Field(..., description="Engine RPM")
    run_hours: float = Field(..., description="Total run hours")
    load: float = Field(..., description="Engine load percentage")
    fuel_level: float = Field(..., description="Fuel level percentage")
    
    @validator('machine_id')
    def validate_machine_id(cls, v):
        """Validate and sanitize machine ID."""
        if not isinstance(v, str):
            raise ValueError('Machine ID must be a string')
        
        # Apply comprehensive sanitization
        sanitized = sanitize_input(v)
        
        # Check format (uppercase letters, numbers, underscores, hyphens only)
        if not re.match(r'^[A-Z0-9_-]+$', sanitized):
            raise ValueError('Machine ID must contain only uppercase letters, numbers, underscores, and hyphens')
        
        if len(sanitized) > 50:
            raise ValueError('Machine ID too long (max 50 characters)')
        
        if len(sanitized) < 3:
            raise ValueError('Machine ID too short (min 3 characters)')
        
        # Additional security checks
        dangerous_patterns = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'SELECT', 'UNION', 'SCRIPT']
        if any(pattern in sanitized.upper() for pattern in dangerous_patterns):
            raise ValueError('Machine ID contains potentially dangerous content')
        
        return sanitized.upper()
    
    @validator('timestamp')
    def validate_timestamp(cls, v):
        """Validate timestamp format."""
        if not isinstance(v, str):
            raise ValueError('Timestamp must be a string')
        
        try:
            # Try to parse the timestamp
            datetime.fromisoformat(v.replace('Z', '+00:00'))
            return v
        except ValueError:
            raise ValueError('Timestamp must be in ISO format (e.g., 2024-01-15T10:30:00Z)')
    
    @validator('model')
    def validate_model(cls, v):
        """Validate and sanitize model name."""
        if not isinstance(v, str):
            raise ValueError('Model must be a string')
        
        # Apply comprehensive sanitization
        sanitized = sanitize_input(v)
        
        if len(sanitized) > 100:
            raise ValueError('Model name too long (max 100 characters)')
        
        if len(sanitized) < 2:
            raise ValueError('Model name too short (min 2 characters)')
        
        # Additional security checks
        dangerous_patterns = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'SELECT', 'UNION', 'SCRIPT']
        if any(pattern in sanitized.upper() for pattern in dangerous_patterns):
            raise ValueError('Model name contains potentially dangerous content')
        
        return sanitized
    
    @validator('temperature')
    def validate_temperature(cls, v):
        """Validate temperature is within realistic range."""
        if not isinstance(v, (int, float)):
            raise ValueError('Temperature must be a number')
        
        v = float(v)
        if not (-50 <= v <= 200):
            raise ValueError('Temperature must be between -50 and 200 degrees Celsius')
        
        return v
    
    @validator('vibration')
    def validate_vibration(cls, v):
        """Validate vibration is within realistic range."""
        if not isinstance(v, (int, float)):
            raise ValueError('Vibration must be a number')
        
        v = float(v)
        if not (0 <= v <= 100):
            raise ValueError('Vibration must be between 0 and 100 g')
        
        return v
    
    @validator('oil_pressure')
    def validate_oil_pressure(cls, v):
        """Validate oil pressure is within realistic range."""
        if not isinstance(v, (int, float)):
            raise ValueError('Oil pressure must be a number')
        
        v = float(v)
        if not (0 <= v <= 10):
            raise ValueError('Oil pressure must be between 0 and 10 bar')
        
        return v
    
    @validator('rpm')
    def validate_rpm(cls, v):
        """Validate RPM is within realistic range."""
        if not isinstance(v, (int, float)):
            raise ValueError('RPM must be a number')
        
        v = float(v)
        if not (0 <= v <= 3000):
            raise ValueError('RPM must be between 0 and 3000')
        
        return v
    
    @validator('run_hours')
    def validate_run_hours(cls, v):
        """Validate run hours is realistic."""
        if not isinstance(v, (int, float)):
            raise ValueError('Run hours must be a number')
        
        v = float(v)
        if not (0 <= v <= 100000):
            raise ValueError('Run hours must be between 0 and 100,000')
        
        return v
    
    @validator('load')
    def validate_load(cls, v):
        """Validate engine load percentage."""
        if not isinstance(v, (int, float)):
            raise ValueError('Load must be a number')
        
        v = float(v)
        if not (0 <= v <= 100):
            raise ValueError('Load must be between 0 and 100 percent')
        
        return v
    
    @validator('fuel_level')
    def validate_fuel_level(cls, v):
        """Validate fuel level percentage."""
        if not isinstance(v, (int, float)):
            raise ValueError('Fuel level must be a number')
        
        v = float(v)
        if not (0 <= v <= 100):
            raise ValueError('Fuel level must be between 0 and 100 percent')
        
        return v

class InputSanitizer:
    """Utility class for sanitizing various input types."""
    
    @staticmethod
    def sanitize_string(value: str, max_length: int = 255, allowed_chars: str = None) -> str:
        """Sanitize string input by removing dangerous characters."""
        if not isinstance(value, str):
            raise ValueError("Expected string input")
        
        # Remove potentially dangerous characters
        if allowed_chars is None:
            allowed_chars = r'[<>"\';\\]'
        
        sanitized = re.sub(allowed_chars, '', value.strip())
        
        if len(sanitized) > max_length:
            raise ValueError(f"String too long (max {max_length} characters)")
        
        return sanitized
    
    @staticmethod
    def validate_numeric_range(value: float, min_val: float, max_val: float, field_name: str = "value") -> float:
        """Validate numeric input is within specified range."""
        if not isinstance(value, (int, float)):
            raise ValueError(f"{field_name} must be a number")
        
        v = float(value)
        if not (min_val <= v <= max_val):
            raise ValueError(f"{field_name} must be between {min_val} and {max_val}")
        
        return v
    
    @staticmethod
    def validate_positive_number(value: float, field_name: str = "value") -> float:
        """Validate that a number is positive."""
        if not isinstance(value, (int, float)):
            raise ValueError(f"{field_name} must be a number")
        
        v = float(value)
        if v < 0:
            raise ValueError(f"{field_name} must be positive")
        
        return v

# Legacy compatibility - keep existing TelemetryInput for backward compatibility
class TelemetryInput(SecureTelemetryInput):
    """Legacy TelemetryInput for backward compatibility."""
    pass
