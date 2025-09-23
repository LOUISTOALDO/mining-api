"""
Support system API endpoints for Mining PDM.
Handles support tickets, SLA monitoring, and customer communication.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from ..database import get_db
from ..models.support import SupportTicket, TicketStatus, TicketPriority, TicketCategory
from ..schemas.support import (
    TicketCreate, 
    TicketUpdate, 
    TicketResponse, 
    TicketListResponse,
    SLAResponse,
    SupportStatsResponse
)
from ..core.auth import get_current_user
from ..core.support_system import SupportSystem
from ..core.sla_monitor import SLAMonitor

router = APIRouter(prefix="/support", tags=["support"])

# Initialize support system
support_system = SupportSystem()
sla_monitor = SLAMonitor()

@router.post("/tickets", response_model=TicketResponse)
async def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Create a new support ticket."""
    try:
        # Create ticket in database
        db_ticket = SupportTicket(
            id=str(uuid.uuid4()),
            customer_id=ticket_data.customer_id,
            customer_name=ticket_data.customer_name,
            customer_email=ticket_data.customer_email,
            subject=ticket_data.subject,
            description=ticket_data.description,
            priority=ticket_data.priority,
            status=TicketStatus.OPEN,
            category=ticket_data.category,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            tags=ticket_data.tags or []
        )
        
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        
        # Add to support system
        support_system.create_ticket(
            customer_id=ticket_data.customer_id,
            customer_name=ticket_data.customer_name,
            customer_email=ticket_data.customer_email,
            subject=ticket_data.subject,
            description=ticket_data.description,
            priority=ticket_data.priority,
            category=ticket_data.category,
            tags=ticket_data.tags or []
        )
        
        return TicketResponse.from_orm(db_ticket)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create ticket: {str(e)}"
        )

@router.get("/tickets", response_model=List[TicketResponse])
async def get_tickets(
    skip: int = 0,
    limit: int = 100,
    status: Optional[TicketStatus] = None,
    priority: Optional[TicketPriority] = None,
    category: Optional[TicketCategory] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get support tickets with optional filtering."""
    try:
        query = db.query(SupportTicket)
        
        if status:
            query = query.filter(SupportTicket.status == status)
        if priority:
            query = query.filter(SupportTicket.priority == priority)
        if category:
            query = query.filter(SupportTicket.category == category)
        
        tickets = query.offset(skip).limit(limit).all()
        return [TicketResponse.from_orm(ticket) for ticket in tickets]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve tickets: {str(e)}"
        )

@router.get("/tickets/{ticket_id}", response_model=TicketResponse)
async def get_ticket(
    ticket_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get a specific support ticket."""
    try:
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        
        return TicketResponse.from_orm(ticket)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve ticket: {str(e)}"
        )

@router.put("/tickets/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: str,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Update a support ticket."""
    try:
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        
        # Update ticket fields
        for field, value in ticket_update.dict(exclude_unset=True).items():
            setattr(ticket, field, value)
        
        ticket.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(ticket)
        
        # Update in support system
        support_system.update_ticket_status(
            ticket_id=ticket_id,
            status=ticket.status,
            resolution=ticket.resolution
        )
        
        return TicketResponse.from_orm(ticket)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update ticket: {str(e)}"
        )

@router.post("/tickets/{ticket_id}/assign")
async def assign_ticket(
    ticket_id: str,
    assignee: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Assign a ticket to a support agent."""
    try:
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        
        ticket.assigned_to = assignee
        ticket.status = TicketStatus.IN_PROGRESS
        ticket.updated_at = datetime.utcnow()
        
        db.commit()
        
        # Update in support system
        support_system.assign_ticket(ticket_id, assignee)
        
        return {"message": "Ticket assigned successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to assign ticket: {str(e)}"
        )

@router.get("/stats", response_model=SupportStatsResponse)
async def get_support_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get support system statistics."""
    try:
        stats = support_system.get_ticket_statistics()
        
        # Get additional stats from database
        total_tickets = db.query(SupportTicket).count()
        open_tickets = db.query(SupportTicket).filter(SupportTicket.status == TicketStatus.OPEN).count()
        in_progress_tickets = db.query(SupportTicket).filter(SupportTicket.status == TicketStatus.IN_PROGRESS).count()
        resolved_tickets = db.query(SupportTicket).filter(SupportTicket.status == TicketStatus.RESOLVED).count()
        
        return SupportStatsResponse(
            total_tickets=total_tickets,
            open_tickets=open_tickets,
            in_progress_tickets=in_progress_tickets,
            resolved_tickets=resolved_tickets,
            average_response_time_minutes=stats.get('average_response_time_minutes', 0),
            average_resolution_time_hours=stats.get('average_resolution_time_hours', 0),
            queue_size=stats.get('queue_size', 0)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve support stats: {str(e)}"
        )

@router.get("/sla", response_model=SLAResponse)
async def get_sla_status(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get SLA compliance status."""
    try:
        compliance_report = support_system.check_sla_compliance()
        
        return SLAResponse(
            total_tickets=compliance_report['total_tickets'],
            sla_violations=compliance_report['sla_violations'],
            response_time_violations=compliance_report['response_time_violations'],
            resolution_time_violations=compliance_report['resolution_time_violations'],
            violations=compliance_report['violations']
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve SLA status: {str(e)}"
        )

@router.get("/tickets/{ticket_id}/history")
async def get_ticket_history(
    ticket_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get ticket history and updates."""
    try:
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        
        # This would typically come from a separate ticket_history table
        # For now, return basic history
        history = [
            {
                "timestamp": ticket.created_at.isoformat(),
                "action": "ticket_created",
                "description": "Ticket created",
                "user": "system"
            },
            {
                "timestamp": ticket.updated_at.isoformat(),
                "action": "ticket_updated",
                "description": "Ticket updated",
                "user": "system"
            }
        ]
        
        return {"ticket_id": ticket_id, "history": history}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve ticket history: {str(e)}"
        )

@router.post("/tickets/{ticket_id}/notes")
async def add_ticket_note(
    ticket_id: str,
    note: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Add a note to a support ticket."""
    try:
        ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found"
            )
        
        # This would typically be stored in a separate ticket_notes table
        # For now, append to the description
        ticket.description += f"\n\nNote ({datetime.utcnow().isoformat()}): {note}"
        ticket.updated_at = datetime.utcnow()
        
        db.commit()
        
        return {"message": "Note added successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add note: {str(e)}"
        )

@router.get("/search")
async def search_tickets(
    query: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Search support tickets."""
    try:
        # Simple text search - in production, you'd use full-text search
        tickets = db.query(SupportTicket).filter(
            SupportTicket.subject.contains(query) |
            SupportTicket.description.contains(query) |
            SupportTicket.customer_name.contains(query)
        ).all()
        
        return [TicketResponse.from_orm(ticket) for ticket in tickets]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search tickets: {str(e)}"
        )
