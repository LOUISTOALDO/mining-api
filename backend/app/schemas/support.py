"""
Support system Pydantic schemas for Mining PDM.
"""

from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from ..models.support import TicketStatus, TicketPriority, TicketCategory

class TicketCreate(BaseModel):
    """Schema for creating a support ticket."""
    customer_id: str
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str
    priority: TicketPriority = TicketPriority.MEDIUM
    category: TicketCategory = TicketCategory.TECHNICAL
    tags: Optional[List[str]] = None

class TicketUpdate(BaseModel):
    """Schema for updating a support ticket."""
    status: Optional[TicketStatus] = None
    priority: Optional[TicketPriority] = None
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    customer_satisfaction: Optional[int] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None

class TicketResponse(BaseModel):
    """Schema for ticket response."""
    id: str
    customer_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    priority: TicketPriority
    status: TicketStatus
    category: TicketCategory
    created_at: datetime
    updated_at: datetime
    assigned_to: Optional[str] = None
    resolution: Optional[str] = None
    sla_deadline: Optional[datetime] = None
    response_time: Optional[datetime] = None
    resolution_time: Optional[datetime] = None
    customer_satisfaction: Optional[int] = None
    tags: Optional[List[str]] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class TicketListResponse(BaseModel):
    """Schema for ticket list response."""
    tickets: List[TicketResponse]
    total: int
    page: int
    size: int
    has_next: bool
    has_prev: bool

class TicketHistoryResponse(BaseModel):
    """Schema for ticket history response."""
    id: str
    ticket_id: str
    action: str
    description: str
    user: str
    timestamp: datetime
    old_value: Optional[str] = None
    new_value: Optional[str] = None

    class Config:
        from_attributes = True

class TicketNoteResponse(BaseModel):
    """Schema for ticket note response."""
    id: str
    ticket_id: str
    note: str
    user: str
    timestamp: datetime
    is_internal: bool

    class Config:
        from_attributes = True

class SLAResponse(BaseModel):
    """Schema for SLA compliance response."""
    total_tickets: int
    sla_violations: int
    response_time_violations: int
    resolution_time_violations: int
    violations: List[Dict[str, Any]]

class SupportStatsResponse(BaseModel):
    """Schema for support statistics response."""
    total_tickets: int
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    average_response_time_minutes: float
    average_resolution_time_hours: float
    queue_size: int

class SupportAgentResponse(BaseModel):
    """Schema for support agent response."""
    id: str
    name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    skills: Optional[List[str]] = None
    max_tickets: int
    current_tickets: int

    class Config:
        from_attributes = True

class CustomerFeedbackResponse(BaseModel):
    """Schema for customer feedback response."""
    id: str
    ticket_id: str
    customer_id: str
    rating: int
    comment: Optional[str] = None
    timestamp: datetime
    is_public: bool

    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    """Schema for creating customer feedback."""
    ticket_id: str
    customer_id: str
    rating: int
    comment: Optional[str] = None
    is_public: bool = False

class TicketSearchResponse(BaseModel):
    """Schema for ticket search response."""
    tickets: List[TicketResponse]
    total_results: int
    query: str
    filters: Dict[str, Any]

class EscalationResponse(BaseModel):
    """Schema for ticket escalation response."""
    ticket_id: str
    escalated_from: TicketPriority
    escalated_to: TicketPriority
    reason: str
    timestamp: datetime
    escalated_by: str

class NotificationResponse(BaseModel):
    """Schema for notification response."""
    id: str
    type: str
    title: str
    message: str
    recipient: str
    sent_at: datetime
    status: str  # sent, failed, pending

    class Config:
        from_attributes = True
