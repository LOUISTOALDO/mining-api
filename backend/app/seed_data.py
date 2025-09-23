#!/usr/bin/env python3
"""
Seed data script to populate the database with fake telemetry records.
"""

import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from backend.app.db import SessionLocal, engine
from backend.app.models import Telemetry, Base

def create_tables():
    """Create database tables if they don't exist."""
    # Drop all tables and recreate them
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def generate_fake_telemetry():
    """Generate 20 fake telemetry records."""
    db = SessionLocal()
    
    try:
        # Machine IDs for variety
        machine_ids = ["truck-001", "truck-002", "excavator-001", "loader-001", "drill-001"]
        
        # Generate 20 records with timestamps spread over the last 7 days
        for i in range(20):
            # Random timestamp within last 7 days
            days_ago = random.uniform(0, 7)
            hours_ago = random.uniform(0, 24)
            timestamp = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
            
            # Random machine ID
            machine_id = random.choice(machine_ids)
            
            # Generate realistic telemetry data
            temperature = random.uniform(40.0, 120.0)
            vibration = random.uniform(0.0, 5.0)
            rpm = random.randint(500, 5000)
            hours = random.randint(0, 20000)
            
            # Create telemetry record
            telemetry = Telemetry(
                machine_id=machine_id,
                timestamp=timestamp,
                temperature=temperature,
                vibration=vibration,
                rpm=float(rpm),
                hours=float(hours)
            )
            
            db.add(telemetry)
        
        # Commit all records
        db.commit()
        print(f"✅ Successfully created 20 fake telemetry records")
        
    except Exception as e:
        print(f"❌ Error creating seed data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def main():
    """Main function to run the seed script."""
    print("🌱 Starting telemetry seed data generation...")
    
    try:
        # Create tables
        create_tables()
        print("✅ Database tables created/verified")
        
        # Generate fake data
        generate_fake_telemetry()
        
        print("🎉 Seed data generation completed successfully!")
        print("📊 You can now test the /v1/telemetry/recent endpoint")
        
    except Exception as e:
        print(f"❌ Failed to generate seed data: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
