"""
Pydantic schemas for request/response models.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


# Machine Schemas
class MachineBase(BaseModel):
    """Base machine schema."""
    name: str = Field(..., min_length=1, max_length=255)
    type: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=1, max_length=255)
    status: str = Field(default="active", max_length=50)


class MachineCreate(MachineBase):
    """Schema for creating a machine."""
    pass


class Machine(MachineBase):
    """Schema for machine response."""
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# Telemetry Schemas
class TelemetryBase(BaseModel):
    """Base telemetry schema."""
    machine_id: str
    timestamp: datetime
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    rpm: Optional[float] = None
    hours: Optional[float] = None


class TelemetryCreate(TelemetryBase):
    """Schema for creating telemetry data."""
    pass


class Telemetry(TelemetryBase):
    """Schema for telemetry response."""
    id: int
    
    class Config:
        from_attributes = True


class TelemetryBatch(BaseModel):
    """Schema for batch telemetry upload."""
    data: List[TelemetryCreate] = Field(..., min_items=1, max_items=1000)


# Event Schemas
class EventBase(BaseModel):
    """Base event schema."""
    machine_id: int
    ts: datetime
    kind: str = Field(..., min_length=1, max_length=100)
    severity: str = Field(..., min_length=1, max_length=50)
    message: str = Field(..., min_length=1)
    meta: Optional[Dict[str, Any]] = None


class EventCreate(EventBase):
    """Schema for creating an event."""
    pass


class Event(EventBase):
    """Schema for event response."""
    id: int
    
    class Config:
        from_attributes = True


# Health Check Schemas
class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    timestamp: datetime
    machine_id: Optional[int] = None


# AI Prediction Schemas
class PredictionRequest(BaseModel):
    """Schema for AI prediction request."""
    machine_id: int
    features: Dict[str, float] = Field(..., description="Machine features for prediction")


class PredictionResponse(BaseModel):
    """Schema for AI prediction response."""
    machine_id: int
    prediction: str
    confidence: float
    timestamp: datetime
    features_used: List[str]


# API Response Schemas
class MessageResponse(BaseModel):
    """Generic message response."""
    message: str


class ErrorResponse(BaseModel):
    """Error response schema."""
    error: str
    detail: Optional[str] = None
