"""
Startup script to initialize the application and start background services.
"""

import asyncio
import uvicorn
from loguru import logger

from .websocket.telemetry_server import telemetry_manager


async def startup_services():
    """Start background services."""
    logger.info("Starting background services...")
    
    # Start telemetry streaming
    asyncio.create_task(telemetry_manager.start_streaming())
    logger.info("Telemetry streaming started")


def run_server():
    """Run the FastAPI server with startup services."""
    logger.info("Starting Mining PDM API server...")
    
    # Start background services
    asyncio.run(startup_services())
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


if __name__ == "__main__":
    run_server()
