"""
Support system database models for Mining PDM.
"""

from sqlalchemy import Column, String, Text, DateTime, Enum, Integer, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()

class TicketStatus(enum.Enum):
    """Support ticket status."""
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    WAITING_CUSTOMER = "waiting_customer"
    RESOLVED = "resolved"
    CLOSED = "closed"

class TicketPriority(enum.Enum):
    """Support ticket priority."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class TicketCategory(enum.Enum):
    """Support ticket category."""
    TECHNICAL = "technical"
    BILLING = "billing"
    FEATURE_REQUEST = "feature_request"
    BUG_REPORT = "bug_report"
    GENERAL = "general"

class SupportTicket(Base):
    """Support ticket model."""
    __tablename__ = "support_tickets"
    
    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, nullable=False, index=True)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False, index=True)
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(Enum(TicketPriority), nullable=False, default=TicketPriority.MEDIUM)
    status = Column(Enum(TicketStatus), nullable=False, default=TicketStatus.OPEN)
    category = Column(Enum(TicketCategory), nullable=False, default=TicketCategory.TECHNICAL)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    assigned_to = Column(String, nullable=True)
    resolution = Column(Text, nullable=True)
    sla_deadline = Column(DateTime, nullable=True)
    response_time = Column(DateTime, nullable=True)
    resolution_time = Column(DateTime, nullable=True)
    customer_satisfaction = Column(Integer, nullable=True)
    tags = Column(JSON, nullable=True, default=list)
    notes = Column(Text, nullable=True)

class TicketHistory(Base):
    """Ticket history model for tracking changes."""
    __tablename__ = "ticket_history"
    
    id = Column(String, primary_key=True, index=True)
    ticket_id = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    user = Column(String, nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)

class TicketNote(Base):
    """Ticket notes model."""
    __tablename__ = "ticket_notes"
    
    id = Column(String, primary_key=True, index=True)
    ticket_id = Column(String, nullable=False, index=True)
    note = Column(Text, nullable=False)
    user = Column(String, nullable=False)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    is_internal = Column(String, nullable=False, default="false")

class SLAMetrics(Base):
    """SLA metrics model for tracking compliance."""
    __tablename__ = "sla_metrics"
    
    id = Column(String, primary_key=True, index=True)
    ticket_id = Column(String, nullable=False, index=True)
    metric_type = Column(String, nullable=False)  # response_time, resolution_time
    target_value = Column(Integer, nullable=False)  # in minutes or hours
    actual_value = Column(Integer, nullable=False)  # in minutes or hours
    is_violated = Column(String, nullable=False, default="false")
    violation_reason = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False)

class SupportAgent(Base):
    """Support agent model."""
    __tablename__ = "support_agents"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True, index=True)
    role = Column(String, nullable=False)  # agent, supervisor, manager
    is_active = Column(String, nullable=False, default="true")
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    skills = Column(JSON, nullable=True, default=list)
    max_tickets = Column(Integer, nullable=False, default=10)
    current_tickets = Column(Integer, nullable=False, default=0)

class CustomerFeedback(Base):
    """Customer feedback model."""
    __tablename__ = "customer_feedback"
    
    id = Column(String, primary_key=True, index=True)
    ticket_id = Column(String, nullable=False, index=True)
    customer_id = Column(String, nullable=False, index=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=func.now(), nullable=False)
    is_public = Column(String, nullable=False, default="false")
