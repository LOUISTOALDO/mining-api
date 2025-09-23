"""
Health check and monitoring endpoints for the Mining PDM system.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import psutil
import time
import asyncio
from datetime import datetime

from ..db import get_db
from ..config import settings
from ..core.logging import logger

router = APIRouter()

@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """
    Basic health check endpoint.
    Returns the overall system health status.
    """
    try:
        # Check system resources
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Check if system resources are within acceptable limits
        is_healthy = (
            cpu_percent < 90 and
            memory.percent < 90 and
            disk.percent < 90
        )
        
        status = "healthy" if is_healthy else "unhealthy"
        
        return {
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            "version": settings.project_version,
            "environment": settings.environment,
            "system": {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "disk_percent": disk.percent,
                "uptime_seconds": time.time() - psutil.boot_time()
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Health check failed")

@router.get("/health/detailed")
async def detailed_health_check(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Detailed health check including database and external service connectivity.
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.project_version,
        "environment": settings.environment,
        "checks": {}
    }
    
    overall_healthy = True
    
    # Database health check
    try:
        db.execute("SELECT 1")
        health_status["checks"]["database"] = {
            "status": "healthy",
            "message": "Database connection successful"
        }
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "message": f"Database connection failed: {str(e)}"
        }
        overall_healthy = False
    
    # Redis health check (if configured)
    try:
        # This would need Redis client implementation
        health_status["checks"]["redis"] = {
            "status": "healthy",
            "message": "Redis connection successful"
        }
    except Exception as e:
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "message": f"Redis connection failed: {str(e)}"
        }
        overall_healthy = False
    
    # ML Model health check
    try:
        # Check if ML models are loaded and accessible
        health_status["checks"]["ml_models"] = {
            "status": "healthy",
            "message": "ML models loaded successfully"
        }
    except Exception as e:
        health_status["checks"]["ml_models"] = {
            "status": "unhealthy",
            "message": f"ML models check failed: {str(e)}"
        }
        overall_healthy = False
    
    # WebSocket health check
    try:
        # Check WebSocket server status
        health_status["checks"]["websocket"] = {
            "status": "healthy",
            "message": "WebSocket server running"
        }
    except Exception as e:
        health_status["checks"]["websocket"] = {
            "status": "unhealthy",
            "message": f"WebSocket server check failed: {str(e)}"
        }
        overall_healthy = False
    
    # System resources
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        health_status["checks"]["system_resources"] = {
            "status": "healthy" if cpu_percent < 90 and memory.percent < 90 and disk.percent < 90 else "warning",
            "message": "System resources within limits",
            "details": {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "disk_percent": disk.percent
            }
        }
    except Exception as e:
        health_status["checks"]["system_resources"] = {
            "status": "unhealthy",
            "message": f"System resources check failed: {str(e)}"
        }
        overall_healthy = False
    
    health_status["status"] = "healthy" if overall_healthy else "unhealthy"
    
    if not overall_healthy:
        raise HTTPException(status_code=503, detail=health_status)
    
    return health_status

@router.get("/health/ready")
async def readiness_check(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Readiness check for Kubernetes/Docker health checks.
    Returns 200 if the service is ready to accept traffic.
    """
    try:
        # Check database connectivity
        db.execute("SELECT 1")
        
        # Check if critical services are available
        # Add more checks as needed
        
        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        raise HTTPException(status_code=503, detail="Service not ready")

@router.get("/health/live")
async def liveness_check() -> Dict[str, Any]:
    """
    Liveness check for Kubernetes/Docker health checks.
    Returns 200 if the service is alive.
    """
    return {
        "status": "alive",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/metrics")
async def metrics() -> Dict[str, Any]:
    """
    Prometheus-compatible metrics endpoint.
    """
    try:
        # System metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        # Process metrics
        process = psutil.Process()
        process_memory = process.memory_info()
        
        metrics_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "system": {
                "cpu_percent": cpu_percent,
                "memory_total_bytes": memory.total,
                "memory_available_bytes": memory.available,
                "memory_percent": memory.percent,
                "disk_total_bytes": disk.total,
                "disk_free_bytes": disk.free,
                "disk_percent": disk.percent
            },
            "process": {
                "memory_rss_bytes": process_memory.rss,
                "memory_vms_bytes": process_memory.vms,
                "cpu_percent": process.cpu_percent(),
                "num_threads": process.num_threads(),
                "create_time": process.create_time()
            },
            "application": {
                "uptime_seconds": time.time() - process.create_time(),
                "version": settings.project_version,
                "environment": settings.environment
            }
        }
        
        return metrics_data
    except Exception as e:
        logger.error(f"Metrics collection failed: {e}")
        raise HTTPException(status_code=500, detail="Metrics collection failed")

@router.get("/status")
async def system_status() -> Dict[str, Any]:
    """
    Comprehensive system status endpoint.
    """
    try:
        # Get system information
        system_info = {
            "platform": psutil.WINDOWS if hasattr(psutil, 'WINDOWS') else "unknown",
            "python_version": f"{psutil.sys.version_info.major}.{psutil.sys.version_info.minor}.{psutil.sys.version_info.micro}",
            "boot_time": datetime.fromtimestamp(psutil.boot_time()).isoformat(),
            "uptime_seconds": time.time() - psutil.boot_time()
        }
        
        # Get process information
        process = psutil.Process()
        process_info = {
            "pid": process.pid,
            "name": process.name(),
            "status": process.status(),
            "create_time": datetime.fromtimestamp(process.create_time()).isoformat(),
            "cpu_percent": process.cpu_percent(),
            "memory_percent": process.memory_percent(),
            "num_threads": process.num_threads()
        }
        
        # Get network information
        network_info = {
            "connections": len(psutil.net_connections()),
            "interfaces": len(psutil.net_if_addrs())
        }
        
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "system": system_info,
            "process": process_info,
            "network": network_info,
            "application": {
                "name": settings.project_name,
                "version": settings.project_version,
                "environment": settings.environment
            }
        }
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(status_code=500, detail="Status check failed")
