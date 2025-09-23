"""
SQLAlchemy database models.
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .db import Base


class Machine(Base):
    """Machine model representing mining equipment."""
    
    __tablename__ = "machines"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    status = Column(String(50), default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    events = relationship("Event", back_populates="machine")


class Telemetry(Base):
    """Telemetry data from mining machines."""
    
    __tablename__ = "telemetry"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, index=True)
    machine_id = Column(String(255), nullable=False, index=True)
    temperature = Column(Float, nullable=True)
    vibration = Column(Float, nullable=True)
    rpm = Column(Float, nullable=True)
    hours = Column(Float, nullable=True)


class Event(Base):
    """Events and alerts from mining machines."""
    
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    machine_id = Column(Integer, ForeignKey("machines.id"), nullable=False, index=True)
    ts = Column(DateTime(timezone=True), nullable=False, index=True)
    kind = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    meta = Column(JSON, nullable=True)
    
    # Relationships
    machine = relationship("Machine", back_populates="events")
