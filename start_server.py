#!/usr/bin/env python3
"""
Startup script for Mining AI Platform API
"""

import uvicorn
import sys
import os
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

if __name__ == "__main__":
    print("🚀 Starting Mining AI Platform API...")
    print("📍 API will be available at: http://0.0.0.0:8000")
    print("📚 API docs will be available at: http://0.0.0.0:8000/docs")
    print("🔍 Health check: http://0.0.0.0:8000/health")
    
    uvicorn.run(
        "backend.app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        workers=1,
        log_level="info"
    )
