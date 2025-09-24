#!/usr/bin/env python3
"""
Simple startup script for the Mining PDM API
"""
import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.insert(0, str(Path(__file__).parent))

if __name__ == "__main__":
    import uvicorn
    from app.main import app
    
    print("🚀 Starting Mining PDM API...")
    print("📍 API will be available at: http://127.0.0.1:8000")
    print("📚 API docs will be available at: http://127.0.0.1:8000/docs")
    print("🔍 Health check: http://127.0.0.1:8000/health")
    
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
