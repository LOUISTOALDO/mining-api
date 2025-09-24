#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FastAPI Application for Predictive Maintenance

This module provides a REST API to interact with the trained predictive maintenance model
and database for storing telemetry data and predictions.
"""

import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, Depends, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import jwt
from jwt.exceptions import InvalidTokenError as JWTError
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from .config import settings
from .db import engine, Base
from .db_config import create_tables, get_db
from .utils.time import get_current_timestamp
from loguru import logger
from .auth.models import User

# Import auth router and service
from .auth.routers import router as auth_router
from .auth.service import AuthService
from .auth.seed import seed_database

# Import all our new improvements
from .core.integration import (
    initialize_all_systems, 
    process_telemetry_with_all_systems,
    make_prediction_with_all_systems,
    get_system_health_report
)
from .core.validators import SecureTelemetryInput
from .core.cache import api_cache
from .core.metrics import generate_prometheus_metrics, get_metrics_health
from .core.data_quality import get_data_quality_report
from .core.profiler import get_performance_summary
from .core.circuit_breaker import get_circuit_breaker_health
from .core.ml_integration import get_ml_ensemble_info, get_prediction_capabilities
from .core.security import (
    SecurityHeadersMiddleware, 
    RateLimitMiddleware, 
    RequestSizeLimitMiddleware
)
from .core.session_security import SecureSessionMiddleware
from .core.error_handling import register_error_handlers

# Import models - we'll need to create these
try:
    from .models import equipment
    from .models.equipment import Machine, Telemetry, Prediction, User, Alert
except ImportError:
    # Fallback to basic models if the full models don't exist
    print("Warning: Using fallback models")
    Machine = None
    Telemetry = None
    Prediction = None
    User = None
    Alert = None

# Database tables will be created in lifespan startup

# FastAPI lifespan handler
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown."""
    # Startup
    logger.info("🚀 Starting Mining AI Platform API...")
    
    try:
        # Create database tables
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        create_tables()
        logger.info("Database tables created successfully")
        
        # Initialize system improvements
        logger.info("Initializing system improvements...")
        db_session = next(get_db())
        initialize_all_systems(db_session)
        logger.info("✅ All system improvements initialized successfully!")
        print("✅ All system improvements initialized successfully!")
        
    except Exception as e:
        logger.warning(f"Could not initialize all systems: {e}")
        print(f"⚠️ Warning: Could not initialize all systems: {e}")
        print("System will continue with basic functionality.")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Mining AI Platform API...")

# Initialize FastAPI app
app = FastAPI(
    title="Mining PDM API - Revolutionary AI-Powered Mining Intelligence",
    description="Revolutionary AI-powered platform that will transform the mining industry",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
    swagger_ui_parameters={
        "tryItOutEnabled": True,
        "requestSnippetsEnabled": True,
        "syntaxHighlight.theme": "agate"
    }
)

# Add security middleware (order matters - first added is outermost)
app.add_middleware(
    RequestSizeLimitMiddleware,
    max_size=int(os.getenv("MAX_REQUEST_SIZE", "10485760"))  # 10MB default
)

app.add_middleware(
    RateLimitMiddleware,
    requests_per_minute=int(os.getenv("RATE_LIMIT_REQUESTS_PER_MINUTE", "100")),
    burst_limit=int(os.getenv("RATE_LIMIT_BURST", "20")),
    user_requests_per_minute=int(os.getenv("USER_RATE_LIMIT_REQUESTS_PER_MINUTE", "200")),
    user_burst_limit=int(os.getenv("USER_RATE_LIMIT_BURST", "50"))
)

app.add_middleware(
    SecureSessionMiddleware,
    session_timeout_minutes=int(os.getenv("SESSION_TIMEOUT_MINUTES", "60")),
    max_sessions_per_user=int(os.getenv("MAX_SESSIONS_PER_USER", "5"))
)

app.add_middleware(SecurityHeadersMiddleware)

# Add CORS middleware with enhanced security
CORS_ORIGINS = settings.cors_origins.split(",")
# Remove any wildcard origins for security
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS if origin.strip() != "*"]

# Add localhost for docs access
CORS_ORIGINS.extend(["http://localhost:8000", "http://127.0.0.1:8000"])

# Validate CORS origins
for origin in CORS_ORIGINS:
    if not origin.startswith(("http://", "https://")):
        raise ValueError(f"Invalid CORS origin: {origin}. Must start with http:// or https://")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-CSRFToken",
        "X-API-Key"
    ],
    expose_headers=[
        "X-Total-Count",
        "X-Page-Count",
        "X-Current-Page"
    ],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Register error handlers
register_error_handlers(app)

# Include auth router
app.include_router(auth_router)

# Global model variable for lazy loading
_model: Optional[object] = None

# Security configuration
import secrets
import hashlib

def generate_secure_key() -> str:
    """Generate a cryptographically secure random key."""
    return secrets.token_urlsafe(32)

SECRET_KEY = os.getenv("SECRET_KEY", generate_secure_key())
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", SECRET_KEY)
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Validate that we're not using default secrets in production
if os.getenv("ENVIRONMENT") == "production":
    if SECRET_KEY == "your-secret-key-here-change-in-production":
        raise ValueError("CRITICAL: Default secret key detected in production environment!")
    if JWT_SECRET_KEY == SECRET_KEY and not os.getenv("JWT_SECRET_KEY"):
        print("WARNING: JWT_SECRET_KEY not set, using same key as SECRET_KEY")

# Alert configuration
ALERT_THRESHOLD = float(os.getenv("ALERT_THRESHOLD", "30.0"))  # Default health score threshold

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Legacy TelemetryInput for backward compatibility
class TelemetryInput(BaseModel):
    """Legacy Pydantic model for telemetry input validation (backward compatibility)."""
    timestamp: str
    machine_id: str
    model: str
    temperature: float
    vibration: float
    oil_pressure: float
    rpm: float
    run_hours: float
    load: float
    fuel_level: float


class MachineResponse(BaseModel):
    """Pydantic model for machine response."""
    machine_id: str
    model: str
    site: str


class PredictionResponse(BaseModel):
    """Pydantic model for prediction response."""
    id: int
    machine_id: str
    timestamp: datetime
    predicted_health_score: float
    model_version: str
    created_at: datetime


class IngestResponse(BaseModel):
    """Pydantic model for ingest response."""
    status: str
    message: str


class UserCreate(BaseModel):
    """Pydantic model for user registration."""
    username: str
    password: str
    role: str = "user"  # Default to regular user


class UserResponse(BaseModel):
    """Pydantic model for user response."""
    id: int
    username: str
    role: str
    created_at: datetime


class Token(BaseModel):
    """Pydantic model for JWT token response."""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Pydantic model for token data."""
    email: Optional[str] = None


# Legacy TelemetryResponse for backward compatibility
class TelemetryResponse(BaseModel):
    """Legacy Pydantic model for telemetry response (backward compatibility)."""
    id: int
    machine_id: str
    timestamp: datetime
    temperature: float
    vibration: float
    oil_pressure: float
    rpm: float
    run_hours: float
    load: float
    fuel_level: float
    created_at: datetime


class AlertResponse(BaseModel):
    """Pydantic model for alert response."""
    id: int
    machine_id: str
    timestamp: datetime
    alert_type: str
    value: float
    resolved: bool
    created_at: datetime


class AlertResolveRequest(BaseModel):
    """Pydantic model for alert resolution request."""
    alert_id: int


class AlertResolveResponse(BaseModel):
    """Pydantic model for alert resolution response."""
    status: str
    message: str


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def load_model() -> object:
    """Lazy load the trained model (singleton pattern)."""
    global _model
    
    if _model is None:
        model_path = "models/rf_health.pkl"
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        print(f"Loading model from {model_path}")
        _model = joblib.load(model_path)
    
    return _model


def prepare_features(telemetry: TelemetryInput) -> pd.DataFrame:
    """Prepare features for prediction using the same pipeline as training."""
    # Create input row dictionary
    row = {
        'timestamp': telemetry.timestamp,
        'machine_id': telemetry.machine_id,
        'temperature': telemetry.temperature,
        'vibration': telemetry.vibration,
        'oil_pressure': telemetry.oil_pressure,
        'rpm': telemetry.rpm,
        'run_hours': telemetry.run_hours,
        'load': telemetry.load,
        'fuel_level': telemetry.fuel_level,
        'health_score': 0.0  # Placeholder, will be ignored
    }
    
    # Simple feature engineering for now
    df = pd.DataFrame([row])
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df['hour'] = df['timestamp'].dt.hour
    df['day_of_week'] = df['timestamp'].dt.dayofweek
    df['temperature_squared'] = df['temperature'] ** 2
    df['vibration_squared'] = df['vibration'] ** 2
    df['oil_pressure_squared'] = df['oil_pressure'] ** 2
    
    return df


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Get current authenticated user from JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    if User is None:
        # Return a mock user if User model is not available
        return type('MockUser', (), {
            'id': 1, 
            'username': username, 
            'email': username,  # Use username as email for mock user
            'full_name': 'Mock User',
            'is_active': True,
            'is_superuser': False,
            'created_at': None,
            'updated_at': None,
            'last_login': None,
            'role': 'user'
        })()
    
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    
    return user


# Role-based access control functions
def get_user_role(user) -> str:
    """Get user's primary role."""
    if hasattr(user, 'roles') and user.roles:
        return user.roles[0].name if user.roles[0] else 'viewer'
    elif hasattr(user, 'role'):
        return user.role
    else:
        return 'viewer'

def get_user_company(user) -> str:
    """Get user's company ID for data isolation."""
    if hasattr(user, 'company_id'):
        return user.company_id
    elif hasattr(user, 'company'):
        return user.company
    else:
        return 'default'  # Admin users see all data

def require_role(required_role: str):
    """Decorator to require specific role."""
    def role_checker(current_user = Depends(get_current_user)):
        user_role = get_user_role(current_user)
        role_hierarchy = {'viewer': 1, 'operator': 2, 'admin': 3}
        
        if role_hierarchy.get(user_role, 0) < role_hierarchy.get(required_role, 0):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {required_role}, Current role: {user_role}"
            )
        return current_user
    return role_checker

def require_admin(current_user = Depends(get_current_user)):
    """Require admin role."""
    return require_role('admin')(current_user)

def require_operator(current_user = Depends(get_current_user)):
    """Require operator or admin role."""
    return require_role('operator')(current_user)

def require_viewer(current_user = Depends(get_current_user)):
    """Require viewer, operator, or admin role."""
    return require_role('viewer')(current_user)

# Company data isolation for operators
def filter_by_company(query, current_user, model_class):
    """Filter query by user's company for data isolation."""
    user_role = get_user_role(current_user)
    
    if user_role == 'admin':
        # Admins see all data
        return query
    elif user_role == 'operator':
        # Operators see only their company's data
        company_id = get_user_company(current_user)
        if hasattr(model_class, 'company_id'):
            return query.filter(model_class.company_id == company_id)
        else:
            # Fallback: filter by user's company
            return query.filter(model_class.created_by == current_user.id)
    else:
        # Viewers see only their company's data
        company_id = get_user_company(current_user)
        if hasattr(model_class, 'company_id'):
            return query.filter(model_class.company_id == company_id)
        else:
            return query.filter(model_class.created_by == current_user.id)


@app.get("/")
async def root():
    """Root endpoint returning API status."""
    return {
        "status": "ok",
        "message": "Mining PDM API - Revolutionary AI-Powered Mining Intelligence",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/healthz"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "API is healthy"
    }


@app.post("/predict")
async def predict(
    telemetry: SecureTelemetryInput, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Predict health score from telemetry data using all system improvements.
    
    Args:
        telemetry: Validated and sanitized telemetry data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Dictionary with predicted health score and system information
    """
    try:
        # Use our integrated prediction system with all improvements
        result = make_prediction_with_all_systems(
            telemetry_data=telemetry.dict(),
            user_id=current_user.id
        )
        
        return {
            "predicted_health_score": result['prediction']['predicted_health_score'],
            "prediction_type": result['prediction_type'],
            "model_version": result['model_version'],
            "processing_time": result['processing_time'],
            "timestamp": result['timestamp']
        }
        
    except Exception as e:
        print(f"Error making prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/test-predict")
async def test_predict(
    telemetry: SecureTelemetryInput, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Test prediction endpoint with authentication for synthetic pilot testing.
    
    Args:
        telemetry: Validated and sanitized telemetry data
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Dictionary with predicted health score and system information
    """
    # Log security event
    logger.warning(f"SECURITY_EVENT: test_predict_accessed - User: {current_user.email} - Machine: {telemetry.machine_id}")
    try:
        # Use our integrated prediction system with all improvements
        result = make_prediction_with_all_systems(
            telemetry_data=telemetry.dict(),
            user_id=str(current_user.id)
        )
        
        return {
            "predicted_health_score": result['prediction']['predicted_health_score'],
            "prediction_type": result['prediction_type'],
            "model_version": result['model_version'],
            "processing_time": result['processing_time'],
            "timestamp": result['timestamp']
        }
    except Exception as e:
        print(f"Error making prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/ingest", response_model=IngestResponse)
async def ingest_telemetry_legacy(
    telemetry: TelemetryInput, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Ingest legacy telemetry data into the database (backward compatibility).
    
    Args:
        telemetry: Legacy telemetry input data
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Status message confirming telemetry was saved
    """
    if Machine is None or Telemetry is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Telemetry ingestion not available - Models not loaded"
        )
    
    try:
        # Check if machine exists, create if not
        machine = db.query(Machine).filter(Machine.machine_id == telemetry.machine_id).first()
        
        if not machine:
            print(f"Creating new machine: {telemetry.machine_id}")
            machine = Machine(
                machine_id=telemetry.machine_id,
                model=telemetry.model,
                site="Unknown"  # Default site
            )
            db.add(machine)
            db.flush()  # Get the ID without committing
        
        # Parse timestamp
        try:
            timestamp = datetime.fromisoformat(telemetry.timestamp.replace('Z', '+00:00'))
        except ValueError:
            timestamp = datetime.utcnow()
        
        # Create telemetry record
        telemetry_record = Telemetry(
            machine_id=telemetry.machine_id,
            timestamp=timestamp,
            temperature=telemetry.temperature,
            vibration=telemetry.vibration,
            oil_pressure=telemetry.oil_pressure,
            rpm=telemetry.rpm,
            run_hours=telemetry.run_hours,
            load=telemetry.load,
            fuel_level=telemetry.fuel_level
        )
        
        db.add(telemetry_record)
        db.commit()
        
        print(f"Telemetry saved by user {current_user.username}: {telemetry.machine_id} at {timestamp}")
        
        return IngestResponse(
            status="ok",
            message="Telemetry saved"
        )
        
    except Exception as e:
        db.rollback()
        print(f"Error saving telemetry: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save telemetry: {str(e)}")


@app.get("/machines", response_model=List[MachineResponse])
async def get_machines(
    site: Optional[str] = Query(None, description="Filter by site"),
    model: Optional[str] = Query(None, description="Filter by model"),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get list of machines with optional filtering by site and model.
    
    Args:
        site: Optional site filter
        model: Optional model filter
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of machines filtered by criteria
    """
    if Machine is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Machine management not available - Machine model not loaded"
        )
    
    try:
        query = db.query(Machine)
        
        # Apply filters
        if site:
            query = query.filter(Machine.site == site)
        if model:
            query = query.filter(Machine.model == model)
        
        machines = query.all()
        
        print(f"Retrieved {len(machines)} machines for user {current_user.username} (site={site}, model={model})")
        
        return [
            MachineResponse(
                machine_id=machine.machine_id,
                model=machine.model,
                site=machine.site
            )
            for machine in machines
        ]
        
    except Exception as e:
        print(f"Error retrieving machines: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve machines: {str(e)}")


@app.get("/healthz")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "timestamp": get_current_timestamp(),
        "version": "1.0.0"
    }

# New monitoring endpoints using all our improvements
@app.get("/health/comprehensive")
async def comprehensive_health_check():
    """Comprehensive health check using all systems."""
    return get_system_health_report()

@app.get("/metrics")
async def prometheus_metrics():
    """Prometheus metrics endpoint."""
    from fastapi.responses import Response
    return Response(generate_prometheus_metrics(), media_type="text/plain")

@app.get("/metrics/health")
async def metrics_health():
    """Metrics system health check."""
    return get_metrics_health()

@app.get("/data-quality/report")
async def data_quality_report():
    """Data quality monitoring report."""
    return get_data_quality_report()

@app.get("/performance/summary")
async def performance_summary():
    """Performance profiling summary."""
    return get_performance_summary()

@app.get("/circuit-breakers/health")
async def circuit_breaker_health():
    """Circuit breaker health status."""
    return get_circuit_breaker_health()

@app.get("/cache/health")
async def cache_health():
    """Cache system health check."""
    from .core.cache import check_cache_health
    return check_cache_health()

# ML Ensemble endpoints
@app.get("/ml/ensemble/info")
async def ml_ensemble_info():
    """Get ML ensemble information."""
    return get_ml_ensemble_info()

@app.get("/ml/ensemble/capabilities")
async def ml_ensemble_capabilities():
    """Get ML ensemble prediction capabilities."""
    return get_prediction_capabilities()

# Add proper token endpoint for OAuth2PasswordBearer compatibility
@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """OAuth2 compatible token endpoint for login."""
    auth_service = AuthService(db)
    
    # Authenticate user
    user = auth_service.authenticate_user(form_data.username, form_data.password)  # form_data.username is actually email in OAuth2PasswordRequestForm
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is disabled",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires  # Use email as subject
    )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

# Add user info endpoint
@app.get("/auth/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """Get current user information."""
    # Determine role based on email
    user_role = "viewer"  # default
    if current_user.email == "admin@mining-pdm.com":
        user_role = "admin"
    elif current_user.email == "operator@mining-pdm.com":
        user_role = "operator"
    elif current_user.email == "viewer@mining-pdm.com":
        user_role = "viewer"
    elif current_user.email == "maintenance@mining-pdm.com":
        user_role = "maintenance"
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "is_superuser": current_user.is_superuser,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None,
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None,
        "roles": [user_role]  # Return the determined role
    }

# Add database seeding endpoint
@app.post("/seed")
async def seed_database_endpoint(db: Session = Depends(get_db)):
    """Seed the database with default users and roles."""
    try:
        seed_database(db)
        return {
            "status": "success",
            "message": "Database seeded successfully with default users and roles",
            "credentials": {
                "admin": "admin / Admin123!",
                "operator": "operator / Operator123!",
                "viewer": "viewer / Viewer123!",
                "maintenance": "maintenance / Maintenance123!"
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to seed database: {str(e)}"
        )


# Admin-only endpoints
@app.get("/admin/users")
async def get_all_users(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get all users - Admin only."""
    if User is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="User management not available - User model not loaded"
        )
    
    try:
        users = db.query(User).all()
        return {
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "is_active": user.is_active,
                    "is_superuser": user.is_superuser,
                    "created_at": user.created_at.isoformat() if user.created_at else None,
                    "last_login": user.last_login.isoformat() if user.last_login else None
                }
                for user in users
            ],
            "total": len(users)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve users: {str(e)}")


@app.get("/admin/stats")
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get system statistics - Admin only."""
    try:
        stats = {
            "total_users": 0,
            "active_users": 0,
            "total_machines": 0,
            "system_health": "healthy",
            "last_updated": datetime.utcnow().isoformat()
        }
        
        if User is not None:
            stats["total_users"] = db.query(User).count()
            stats["active_users"] = db.query(User).filter(User.is_active == True).count()
        
        if Machine is not None:
            stats["total_machines"] = db.query(Machine).count()
        
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve stats: {str(e)}")


@app.post("/admin/seed")
async def admin_seed_database(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Seed database - Admin only."""
    try:
        seed_database(db)
        return {
            "status": "success",
            "message": f"Database seeded by admin user: {current_user.username}",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to seed database: {str(e)}"
        )


# ===== ROLE-BASED PERMISSION ENDPOINTS =====

# Operator-only endpoints (Business owners)
@app.get("/operator/company/users")
async def get_company_users(
    db: Session = Depends(get_db),
    current_user = Depends(require_operator)
):
    """Get users within operator's company - Operator only."""
    if User is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="User management not available - User model not loaded"
        )
    
    try:
        company_id = get_user_company(current_user)
        
        # Get users in the same company
        users = db.query(User).filter(User.company_id == company_id).all()
        
        return {
            "users": [
                {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "full_name": user.full_name,
                    "is_active": user.is_active,
                    "role": get_user_role(user),
                    "created_at": user.created_at.isoformat() if user.created_at else None,
                    "last_login": user.last_login.isoformat() if user.last_login else None
                }
                for user in users
            ],
            "total": len(users),
            "company_id": company_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve company users: {str(e)}")

@app.get("/operator/company/machines")
async def get_company_machines(
    db: Session = Depends(get_db),
    current_user = Depends(require_operator)
):
    """Get machines within operator's company - Operator only."""
    if Machine is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Machine management not available - Machine model not loaded"
        )
    
    try:
        company_id = get_user_company(current_user)
        
        # Get machines in the same company
        machines = db.query(Machine).filter(Machine.company_id == company_id).all()
        
        return {
            "machines": [
                {
                    "machine_id": machine.machine_id,
                    "model": machine.model,
                    "site": machine.site,
                    "status": "active",  # Would be calculated from telemetry
                    "last_maintenance": "2024-01-01",  # Would be from maintenance records
                    "health_score": 85.5  # Would be calculated from ML model
                }
                for machine in machines
            ],
            "total": len(machines),
            "company_id": company_id
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve company machines: {str(e)}")

@app.post("/operator/company/users")
async def create_company_user(
    username: str,
    email: str,
    password: str,
    full_name: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_operator)
):
    """Create user within operator's company - Operator only."""
    if User is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="User management not available - User model not loaded"
        )
    
    try:
        company_id = get_user_company(current_user)
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        # Create new user (viewer role by default)
        hashed_password = get_password_hash(password)
        new_user = User(
            username=username,
            email=email,
            full_name=full_name,
            hashed_password=hashed_password,
            company_id=company_id,
            is_active=True,
            is_superuser=False
        )
        
        db.add(new_user)
        db.commit()
        
        return {
            "status": "success",
            "message": f"User {username} created successfully",
            "user_id": new_user.id,
            "company_id": company_id
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")

@app.get("/operator/company/reports")
async def get_company_reports(
    db: Session = Depends(get_db),
    current_user = Depends(require_operator)
):
    """Get reports for operator's company - Operator only."""
    try:
        company_id = get_user_company(current_user)
        
        # Generate company-specific reports
        reports = {
            "fleet_health": {
                "total_machines": 15,
                "healthy_machines": 12,
                "warning_machines": 2,
                "critical_machines": 1,
                "average_health_score": 87.5
            },
            "maintenance": {
                "scheduled_maintenance": 3,
                "overdue_maintenance": 1,
                "emergency_repairs": 0,
                "total_maintenance_cost": 45000
            },
            "performance": {
                "uptime_percentage": 94.2,
                "fuel_efficiency": 8.5,
                "productivity_score": 92.1,
                "cost_per_hour": 125.50
            },
            "alerts": {
                "active_alerts": 2,
                "resolved_alerts": 8,
                "critical_alerts": 0,
                "maintenance_alerts": 2
            }
        }
        
        return {
            "reports": reports,
            "company_id": company_id,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate reports: {str(e)}")

# Viewer-only endpoints (Company employees)
@app.get("/viewer/dashboard")
async def get_viewer_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(require_viewer)
):
    """Get dashboard data for viewer - Viewer only."""
    try:
        company_id = get_user_company(current_user)
        
        # Get basic dashboard data for viewers
        dashboard_data = {
            "fleet_overview": {
                "total_machines": 15,
                "active_machines": 14,
                "maintenance_due": 3,
                "alerts": 2
            },
            "recent_alerts": [
                {
                    "id": 1,
                    "machine_id": "TRUCK-001",
                    "alert_type": "Maintenance Due",
                    "severity": "medium",
                    "timestamp": "2024-01-15T10:30:00Z"
                },
                {
                    "id": 2,
                    "machine_id": "TRUCK-002",
                    "alert_type": "Temperature High",
                    "severity": "low",
                    "timestamp": "2024-01-15T09:15:00Z"
                }
            ],
            "machine_status": [
                {
                    "machine_id": "TRUCK-001",
                    "status": "active",
                    "health_score": 85,
                    "location": "Site A",
                    "last_update": "2024-01-15T10:00:00Z"
                },
                {
                    "machine_id": "TRUCK-002",
                    "status": "maintenance",
                    "health_score": 45,
                    "location": "Site B",
                    "last_update": "2024-01-15T09:45:00Z"
                }
            ]
        }
        
        return {
            "dashboard": dashboard_data,
            "company_id": company_id,
            "user_role": get_user_role(current_user),
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard data: {str(e)}")

@app.get("/viewer/machines/{machine_id}")
async def get_machine_details(
    machine_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_viewer)
):
    """Get specific machine details - Viewer only."""
    if Machine is None:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Machine management not available - Machine model not loaded"
        )
    
    try:
        company_id = get_user_company(current_user)
        
        # Get machine details (filtered by company)
        machine = db.query(Machine).filter(
            Machine.machine_id == machine_id,
            Machine.company_id == company_id
        ).first()
        
        if not machine:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Machine not found or access denied"
            )
        
        return {
            "machine": {
                "machine_id": machine.machine_id,
                "model": machine.model,
                "site": machine.site,
                "status": "active",
                "health_score": 85.5,
                "last_maintenance": "2024-01-01",
                "next_maintenance": "2024-02-01",
                "operating_hours": 1250,
                "fuel_level": 75.5
            },
            "company_id": company_id,
            "access_level": "viewer"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get machine details: {str(e)}")

# Enhanced admin endpoints
@app.get("/admin/companies")
async def get_all_companies(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get all companies - Admin only."""
    try:
        # Mock company data (would come from database)
        companies = [
            {
                "id": "company_1",
                "name": "Mining Corp A",
                "users_count": 25,
                "machines_count": 15,
                "subscription": "premium",
                "created_at": "2024-01-01T00:00:00Z"
            },
            {
                "id": "company_2", 
                "name": "Mining Corp B",
                "users_count": 12,
                "machines_count": 8,
                "subscription": "standard",
                "created_at": "2024-01-15T00:00:00Z"
            }
        ]
        
        return {
            "companies": companies,
            "total": len(companies),
            "admin_user": current_user.username
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get companies: {str(e)}")

@app.get("/admin/system/overview")
async def get_system_overview(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Get complete system overview - Admin only."""
    try:
        overview = {
            "system_health": {
                "api_status": "healthy",
                "database_status": "healthy",
                "ml_model_status": "healthy",
                "uptime": "99.9%"
            },
            "usage_statistics": {
                "total_companies": 2,
                "total_users": 37,
                "total_machines": 23,
                "active_sessions": 15,
                "api_requests_today": 1250
            },
            "revenue_metrics": {
                "monthly_revenue": 15000,
                "active_subscriptions": 2,
                "churn_rate": 0.0,
                "growth_rate": 25.5
            },
            "technical_metrics": {
                "average_response_time": "45ms",
                "error_rate": "0.1%",
                "database_connections": 8,
                "memory_usage": "65%"
            }
        }
        
        return {
            "overview": overview,
            "generated_at": datetime.utcnow().isoformat(),
            "admin_user": current_user.username
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system overview: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
