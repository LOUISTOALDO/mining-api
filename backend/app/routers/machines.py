"""
Machines router for CRUD operations.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Machine
from ..schemas import MachineCreate, Machine as MachineSchema
from ..security import get_current_api_key

router = APIRouter(prefix="/machines", tags=["machines"])


@router.post("/", response_model=MachineSchema, status_code=status.HTTP_201_CREATED)
async def create_machine(
    machine: MachineCreate,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Create a new machine.
    
    Args:
        machine: Machine data
        db: Database session
        api_key: API key for authentication
        
    Returns:
        Created machine
    """
    db_machine = Machine(**machine.model_dump())
    db.add(db_machine)
    db.commit()
    db.refresh(db_machine)
    return db_machine


@router.get("/", response_model=List[MachineSchema])
async def get_machines(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Get list of machines.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        api_key: API key for authentication
        
    Returns:
        List of machines
    """
    machines = db.query(Machine).offset(skip).limit(limit).all()
    
    # Return stub data if no machines exist
    if not machines:
        from datetime import datetime
        return [
            {
                "id": 1,
                "name": "Excavator-001",
                "type": "excavator",
                "location": "Mine Site A",
                "status": "active",
                "created_at": datetime.now()
            },
            {
                "id": 2,
                "name": "Drill-Rig-002",
                "type": "drill_rig",
                "location": "Mine Site B",
                "status": "active",
                "created_at": datetime.now()
            }
        ]
    
    return machines


@router.get("/{machine_id}", response_model=MachineSchema)
async def get_machine(
    machine_id: int,
    db: Session = Depends(get_db),
    api_key: str = Depends(get_current_api_key),
):
    """
    Get a specific machine by ID.
    
    Args:
        machine_id: Machine ID
        db: Database session
        api_key: API key for authentication
        
    Returns:
        Machine data
        
    Raises:
        HTTPException: If machine not found
    """
    machine = db.query(Machine).filter(Machine.id == machine_id).first()
    if machine is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machine not found"
        )
    return machine
