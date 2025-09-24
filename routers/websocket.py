"""
WebSocket router for real-time communication.
"""

from fastapi import APIRouter, WebSocket, Depends
from loguru import logger

from ..websocket.telemetry_server import websocket_endpoint, telemetry_manager

router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/telemetry")
async def telemetry_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time telemetry streaming.
    
    This endpoint provides:
    - Real-time telemetry data updates
    - Equipment status changes
    - Alert notifications
    - Machine location tracking
    """
    await websocket_endpoint(websocket)


@router.post("/telemetry/start")
async def start_telemetry_streaming():
    """Start the telemetry streaming service."""
    if not telemetry_manager.is_streaming:
        import asyncio
        asyncio.create_task(telemetry_manager.start_streaming())
        return {"message": "Telemetry streaming started", "status": "running"}
    else:
        return {"message": "Telemetry streaming already running", "status": "running"}


@router.post("/telemetry/stop")
async def stop_telemetry_streaming():
    """Stop the telemetry streaming service."""
    telemetry_manager.stop_streaming()
    return {"message": "Telemetry streaming stopped", "status": "stopped"}


@router.get("/telemetry/status")
async def get_streaming_status():
    """Get the current streaming status."""
    return {
        "is_streaming": telemetry_manager.is_streaming,
        "active_connections": len(telemetry_manager.active_connections),
        "machines": list(telemetry_manager.machine_data.keys())
    }