"""
Authentication routers for user management and authentication.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
import jwt
import os

from ..db import get_db
from .service import AuthService
from .schemas import (
    UserCreate, UserUpdate, UserResponse, UserLogin, Token,
    RoleCreate, RoleResponse, UserRoleAssign, APIKeyCreate,
    APIKeyResponse, UserSessionResponse
)

router = APIRouter(prefix="/auth", tags=["authentication"])

# ... existing code ...
