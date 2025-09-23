"""
Seed sample data for the dashboard.
"""

import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from .db import engine, get_db
from .models import Machine, Telemetry
from .utils.time import get_current_timestamp


def seed_sample_data():
    """Seed the database with sample data."""
    # Create database session
    db = next(get_db())
    
    try:
        # Create sample machines if they don't exist
        machines = [
            {"id": 1, "name": "truck-001", "type": "Haul Truck", "location": "Mine A"},
            {"id": 2, "name": "truck-002", "type": "Haul Truck", "location": "Mine A"},
            {"id": 3, "name": "excavator-01", "type": "Excavator", "location": "Mine B"},
            {"id": 4, "name": "excavator-02", "type": "Excavator", "location": "Mine B"},
            {"id": 5, "name": "drill-01", "type": "Drill", "location": "Mine C"},
        ]
        
        for machine_data in machines:
            existing = db.query(Machine).filter(Machine.id == machine_data["id"]).first()
            if not existing:
                machine = Machine(**machine_data)
                db.add(machine)
                print(f"Created machine: {machine_data['name']}")
        
        # Generate sample telemetry data
        machine_ids = ["truck-001", "truck-002", "excavator-01", "excavator-02", "drill-01"]
        
        # Generate data for the last 24 hours
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=24)
        
        for machine_id in machine_ids:
            # Generate 24 data points (one per hour)
            for i in range(24):
                timestamp = start_time + timedelta(hours=i)
                
                # Generate realistic telemetry values
                temperature = random.uniform(50, 120)
                vibration = random.uniform(0.1, 3.0)
                rpm = random.uniform(500, 2000)
                hours = random.uniform(1000, 15000)
                
                telemetry = Telemetry(
                    timestamp=timestamp,
                    machine_id=machine_id,
                    temperature=temperature,
                    vibration=vibration,
                    rpm=rpm,
                    hours=hours
                )
                db.add(telemetry)
        
        db.commit()
        print("Sample data seeded successfully!")
        print(f"Created telemetry records for machines: {machine_ids}")
        
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_sample_data()
