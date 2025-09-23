"""
WebSocket server for real-time telemetry streaming.
"""

import asyncio
import json
import random
import time
from datetime import datetime, timedelta
from typing import Dict, List, Set
from fastapi import WebSocket, WebSocketDisconnect
from loguru import logger

from ..utils.time import get_current_timestamp


class TelemetryWebSocketManager:
    """Manages WebSocket connections for real-time telemetry streaming."""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.machine_data: Dict[str, Dict] = {}
        self.is_streaming = False
        self._initialize_synthetic_machines()
    
    def _initialize_synthetic_machines(self):
        """Initialize synthetic mining equipment data."""
        self.machine_data = {
            "excavator-001": {
                "id": "excavator-001",
                "name": "CAT 349F L",
                "type": "excavator",
                "location": {"x": 100, "y": 200, "z": 50},
                "status": "running",
                "base_values": {
                    "vibration_g": 1.2,
                    "temperature_c": 65.5,
                    "pressure_kpa": 1200,
                    "rpm": 1800,
                    "runtime_hours": 1250.5,
                    "fuel_level": 85.0
                }
            },
            "haul-truck-001": {
                "id": "haul-truck-001", 
                "name": "CAT 797F",
                "type": "haul_truck",
                "location": {"x": 150, "y": 300, "z": 45},
                "status": "running",
                "base_values": {
                    "vibration_g": 0.8,
                    "temperature_c": 72.0,
                    "pressure_kpa": 1100,
                    "rpm": 2200,
                    "runtime_hours": 2100.0,
                    "fuel_level": 60.0
                }
            },
            "crusher-001": {
                "id": "crusher-001",
                "name": "Metso HP300",
                "type": "crusher", 
                "location": {"x": 200, "y": 100, "z": 60},
                "status": "running",
                "base_values": {
                    "vibration_g": 2.1,
                    "temperature_c": 85.0,
                    "pressure_kpa": 1500,
                    "rpm": 1200,
                    "runtime_hours": 3200.0,
                    "fuel_level": 90.0
                }
            },
            "loader-001": {
                "id": "loader-001",
                "name": "CAT 980M",
                "type": "loader",
                "location": {"x": 80, "y": 180, "z": 40},
                "status": "idle",
                "base_values": {
                    "vibration_g": 0.9,
                    "temperature_c": 58.0,
                    "pressure_kpa": 1000,
                    "rpm": 1500,
                    "runtime_hours": 1800.0,
                    "fuel_level": 75.0
                }
            },
            "drill-001": {
                "id": "drill-001",
                "name": "Atlas Copco DM45",
                "type": "drill",
                "location": {"x": 300, "y": 250, "z": 55},
                "status": "maintenance",
                "base_values": {
                    "vibration_g": 1.8,
                    "temperature_c": 78.0,
                    "pressure_kpa": 1300,
                    "rpm": 2000,
                    "runtime_hours": 2800.0,
                    "fuel_level": 45.0
                }
            }
        }
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
        
        # Start streaming if not already started
        if not self.is_streaming:
            import asyncio
            asyncio.create_task(self.start_streaming())
            logger.info("Auto-started telemetry streaming")
        
        # Send initial data
        await self._send_initial_data(websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def _send_initial_data(self, websocket: WebSocket):
        """Send initial machine data to a new connection."""
        try:
            initial_data = {
                "type": "initial_data",
                "timestamp": get_current_timestamp(),
                "machines": list(self.machine_data.values())
            }
            await websocket.send_text(json.dumps(initial_data))
        except Exception as e:
            logger.error(f"Error sending initial data: {e}")
    
    def _generate_realistic_telemetry(self, machine_id: str) -> Dict:
        """Generate realistic telemetry data for a machine."""
        machine = self.machine_data[machine_id]
        base = machine["base_values"]
        
        # Add realistic variations
        variation_factor = 0.1  # 10% variation
        
        # Generate realistic fluctuations
        vibration = base["vibration_g"] + random.uniform(-0.2, 0.2)
        temperature = base["temperature_c"] + random.uniform(-5, 5)
        pressure = base["pressure_kpa"] + random.uniform(-50, 50)
        rpm = base["rpm"] + random.uniform(-100, 100)
        fuel_level = max(0, base["fuel_level"] - random.uniform(0, 0.1))
        
        # Update base values for next iteration
        machine["base_values"]["fuel_level"] = fuel_level
        machine["base_values"]["runtime_hours"] += 0.001  # Increment runtime
        
        # Simulate status changes occasionally
        if random.random() < 0.001:  # 0.1% chance
            statuses = ["running", "idle", "maintenance"]
            machine["status"] = random.choice(statuses)
        
        # Simulate location changes for mobile equipment
        if machine["type"] in ["haul_truck", "loader"]:
            machine["location"]["x"] += random.uniform(-2, 2)
            machine["location"]["y"] += random.uniform(-2, 2)
        
        return {
            "machine_id": machine_id,
            "timestamp": get_current_timestamp(),
            "vibration_g": round(vibration, 2),
            "temperature_c": round(temperature, 1),
            "pressure_kpa": round(pressure, 0),
            "rpm": round(rpm, 0),
            "runtime_hours": round(machine["base_values"]["runtime_hours"], 2),
            "fuel_level": round(fuel_level, 1),
            "status": machine["status"],
            "location": machine["location"]
        }
    
    async def _generate_alerts(self, telemetry_data: Dict) -> List[Dict]:
        """Generate alerts based on telemetry thresholds."""
        alerts = []
        machine_id = telemetry_data["machine_id"]
        
        # Temperature alerts
        if telemetry_data["temperature_c"] > 90:
            alerts.append({
                "id": f"temp-{machine_id}-{int(time.time())}",
                "machine_id": machine_id,
                "type": "temperature_high",
                "severity": "warning" if telemetry_data["temperature_c"] < 100 else "critical",
                "message": f"High temperature detected: {telemetry_data['temperature_c']}°C",
                "timestamp": get_current_timestamp()
            })
        
        # Vibration alerts
        if telemetry_data["vibration_g"] > 3.0:
            alerts.append({
                "id": f"vib-{machine_id}-{int(time.time())}",
                "machine_id": machine_id,
                "type": "vibration_high",
                "severity": "warning" if telemetry_data["vibration_g"] < 4.0 else "critical",
                "message": f"High vibration detected: {telemetry_data['vibration_g']}g",
                "timestamp": get_current_timestamp()
            })
        
        # Fuel level alerts
        if telemetry_data["fuel_level"] < 20:
            alerts.append({
                "id": f"fuel-{machine_id}-{int(time.time())}",
                "machine_id": machine_id,
                "type": "fuel_low",
                "severity": "warning",
                "message": f"Low fuel level: {telemetry_data['fuel_level']}%",
                "timestamp": get_current_timestamp()
            })
        
        return alerts
    
    async def broadcast_telemetry(self):
        """Broadcast telemetry data to all connected clients."""
        if not self.active_connections:
            return
        
        # Generate telemetry for all machines
        telemetry_updates = []
        all_alerts = []
        
        for machine_id in self.machine_data.keys():
            telemetry = self._generate_realistic_telemetry(machine_id)
            telemetry_updates.append(telemetry)
            
            # Generate alerts
            alerts = await self._generate_alerts(telemetry)
            all_alerts.extend(alerts)
        
        # Prepare broadcast data
        broadcast_data = {
            "type": "telemetry_update",
            "timestamp": get_current_timestamp(),
            "telemetry": telemetry_updates,
            "alerts": all_alerts
        }
        
        # Send to all connected clients
        disconnected = set()
        for websocket in self.active_connections:
            try:
                await websocket.send_text(json.dumps(broadcast_data))
            except Exception as e:
                logger.error(f"Error broadcasting to WebSocket: {e}")
                disconnected.add(websocket)
        
        # Remove disconnected clients
        for websocket in disconnected:
            self.disconnect(websocket)
    
    async def start_streaming(self):
        """Start the telemetry streaming loop."""
        if self.is_streaming:
            return
        
        self.is_streaming = True
        logger.info("Starting telemetry streaming...")
        
        while self.is_streaming:
            try:
                await self.broadcast_telemetry()
                await asyncio.sleep(2)  # Send updates every 2 seconds
            except Exception as e:
                logger.error(f"Error in streaming loop: {e}")
                await asyncio.sleep(5)  # Wait before retrying
    
    def stop_streaming(self):
        """Stop the telemetry streaming loop."""
        self.is_streaming = False
        logger.info("Stopped telemetry streaming")


# Global WebSocket manager instance
telemetry_manager = TelemetryWebSocketManager()


async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for telemetry streaming."""
    await telemetry_manager.connect(websocket)
    
    try:
        while True:
            # Keep connection alive and handle client messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({"type": "pong", "timestamp": get_current_timestamp()}))
            elif message.get("type") == "subscribe":
                # Client can subscribe to specific machines
                machine_ids = message.get("machine_ids", [])
                logger.info(f"Client subscribed to machines: {machine_ids}")
                
    except WebSocketDisconnect:
        telemetry_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        telemetry_manager.disconnect(websocket)
