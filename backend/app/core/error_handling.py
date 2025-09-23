"""
Global error handling middleware and custom exceptions.
"""

import traceback
from typing import Union
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from loguru import logger
import os
from datetime import datetime


class MiningPDMException(Exception):
    """Base exception for Mining PDM system."""
    
    def __init__(self, message: str, error_code: str = None, details: dict = None):
        self.message = message
        self.error_code = error_code or "MINING_PDM_ERROR"
        self.details = details or {}
        super().__init__(self.message)


class MLModelException(MiningPDMException):
    """Exception for ML model related errors."""
    
    def __init__(self, message: str, model_name: str = None, details: dict = None):
        super().__init__(
            message=message,
            error_code="ML_MODEL_ERROR",
            details={**details, "model_name": model_name} if model_name else details
        )


class DataValidationException(MiningPDMException):
    """Exception for data validation errors."""
    
    def __init__(self, message: str, field: str = None, details: dict = None):
        super().__init__(
            message=message,
            error_code="DATA_VALIDATION_ERROR",
            details={**details, "field": field} if field else details
        )


class DatabaseException(MiningPDMException):
    """Exception for database related errors."""
    
    def __init__(self, message: str, operation: str = None, details: dict = None):
        super().__init__(
            message=message,
            error_code="DATABASE_ERROR",
            details={**details, "operation": operation} if operation else details
        )


class AuthenticationException(MiningPDMException):
    """Exception for authentication related errors."""
    
    def __init__(self, message: str = "Authentication failed", details: dict = None):
        super().__init__(
            message=message,
            error_code="AUTHENTICATION_ERROR",
            details=details
        )


class AuthorizationException(MiningPDMException):
    """Exception for authorization related errors."""
    
    def __init__(self, message: str = "Access denied", details: dict = None):
        super().__init__(
            message=message,
            error_code="AUTHORIZATION_ERROR",
            details=details
        )


class RateLimitException(MiningPDMException):
    """Exception for rate limiting errors."""
    
    def __init__(self, message: str = "Rate limit exceeded", details: dict = None):
        super().__init__(
            message=message,
            error_code="RATE_LIMIT_ERROR",
            details=details
        )


def create_error_response(
    status_code: int,
    message: str,
    error_code: str = None,
    details: dict = None,
    request_id: str = None
) -> JSONResponse:
    """Create a standardized error response."""
    
    error_response = {
        "error": {
            "code": error_code or "UNKNOWN_ERROR",
            "message": message,
            "details": details or {},
            "timestamp": datetime.utcnow().isoformat()
        }
    }
    
    if request_id:
        error_response["error"]["request_id"] = request_id
    
    # Don't expose internal details in production
    if os.getenv("ENVIRONMENT") == "production":
        if "traceback" in error_response["error"]["details"]:
            del error_response["error"]["details"]["traceback"]
        if "internal_error" in error_response["error"]["details"]:
            del error_response["error"]["details"]["internal_error"]
    
    return JSONResponse(
        status_code=status_code,
        content=error_response
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for unhandled exceptions."""
    
    request_id = getattr(request.state, "request_id", None)
    
    # Log the full exception
    logger.error(
        f"Unhandled exception: {type(exc).__name__}: {str(exc)}",
        extra={
            "request_id": request_id,
            "path": request.url.path,
            "method": request.method,
            "client_ip": request.client.host,
            "traceback": traceback.format_exc()
        }
    )
    
    # Don't expose internal details in production
    is_production = os.getenv("ENVIRONMENT") == "production"
    
    details = {}
    if not is_production:
        # Only show details in development
        details = {
            "traceback": traceback.format_exc(),
            "internal_error": str(exc)
        }
    
    return create_error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        message="An internal server error occurred",
        error_code="INTERNAL_SERVER_ERROR",
        details=details,
        request_id=request_id
    )


async def mining_pdm_exception_handler(request: Request, exc: MiningPDMException) -> JSONResponse:
    """Handler for custom Mining PDM exceptions."""
    
    request_id = getattr(request.state, "request_id", None)
    
    # Map error codes to HTTP status codes
    status_code_mapping = {
        "AUTHENTICATION_ERROR": status.HTTP_401_UNAUTHORIZED,
        "AUTHORIZATION_ERROR": status.HTTP_403_FORBIDDEN,
        "DATA_VALIDATION_ERROR": status.HTTP_422_UNPROCESSABLE_ENTITY,
        "RATE_LIMIT_ERROR": status.HTTP_429_TOO_MANY_REQUESTS,
        "ML_MODEL_ERROR": status.HTTP_503_SERVICE_UNAVAILABLE,
        "DATABASE_ERROR": status.HTTP_503_SERVICE_UNAVAILABLE,
        "MINING_PDM_ERROR": status.HTTP_500_INTERNAL_SERVER_ERROR
    }
    
    status_code = status_code_mapping.get(exc.error_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    logger.warning(
        f"Mining PDM exception: {exc.error_code}: {exc.message}",
        extra={
            "request_id": request_id,
            "error_code": exc.error_code,
            "details": exc.details,
            "path": request.url.path,
            "method": request.method
        }
    )
    
    return create_error_response(
        status_code=status_code,
        message=exc.message,
        error_code=exc.error_code,
        details=exc.details,
        request_id=request_id
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handler for HTTP exceptions."""
    
    request_id = getattr(request.state, "request_id", None)
    
    logger.warning(
        f"HTTP exception: {exc.status_code}: {exc.detail}",
        extra={
            "request_id": request_id,
            "status_code": exc.status_code,
            "path": request.url.path,
            "method": request.method
        }
    )
    
    return create_error_response(
        status_code=exc.status_code,
        message=str(exc.detail),
        error_code=f"HTTP_{exc.status_code}",
        request_id=request_id
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handler for request validation errors."""
    
    request_id = getattr(request.state, "request_id", None)
    
    # Format validation errors
    formatted_errors = []
    for error in exc.errors():
        formatted_errors.append({
            "field": ".".join(str(loc) for loc in error["loc"]),
            "message": error["msg"],
            "type": error["type"]
        })
    
    logger.warning(
        f"Validation error: {len(formatted_errors)} validation errors",
        extra={
            "request_id": request_id,
            "validation_errors": formatted_errors,
            "path": request.url.path,
            "method": request.method
        }
    )
    
    return create_error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        message="Request validation failed",
        error_code="VALIDATION_ERROR",
        details={"validation_errors": formatted_errors},
        request_id=request_id
    )


async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError) -> JSONResponse:
    """Handler for SQLAlchemy database errors."""
    
    request_id = getattr(request.state, "request_id", None)
    
    logger.error(
        f"Database error: {type(exc).__name__}: {str(exc)}",
        extra={
            "request_id": request_id,
            "error_type": type(exc).__name__,
            "path": request.url.path,
            "method": request.method,
            "traceback": traceback.format_exc()
        }
    )
    
    # Don't expose internal database details in production
    is_production = os.getenv("ENVIRONMENT") == "production"
    
    details = {}
    if not is_production:
        # Only show details in development
        details = {
            "error_type": type(exc).__name__,
            "internal_error": str(exc)
        }
    
    return create_error_response(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        message="Database operation failed",
        error_code="DATABASE_ERROR",
        details=details,
        request_id=request_id
    )


def register_error_handlers(app):
    """Register all error handlers with the FastAPI app."""
    
    # Custom exceptions
    app.add_exception_handler(MiningPDMException, mining_pdm_exception_handler)
    app.add_exception_handler(MLModelException, mining_pdm_exception_handler)
    app.add_exception_handler(DataValidationException, mining_pdm_exception_handler)
    app.add_exception_handler(DatabaseException, mining_pdm_exception_handler)
    app.add_exception_handler(AuthenticationException, mining_pdm_exception_handler)
    app.add_exception_handler(AuthorizationException, mining_pdm_exception_handler)
    app.add_exception_handler(RateLimitException, mining_pdm_exception_handler)
    
    # Standard exceptions
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
    
    # Global exception handler (catch-all)
    app.add_exception_handler(Exception, global_exception_handler)
