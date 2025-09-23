"""
Pytest configuration and fixtures for testing.
"""
import pytest
import tempfile
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from datetime import datetime, timedelta

from app.main import app
from app.db_config import get_db, Base
from app.auth.models import User, Role, UserRole
from app.models.equipment import Equipment, TelemetryData, Alert
from app.auth.service import AuthService

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def test_db():
    """Create test database tables."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(test_db):
    """Create database session for testing."""
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    """Create test client with database dependency override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def auth_service(db_session):
    """Create auth service for testing."""
    return AuthService(db_session)

@pytest.fixture
def test_user(db_session, auth_service):
    """Create test user."""
    from app.auth.schemas import UserCreate
    
    user_data = UserCreate(
        email="test@example.com",
        username="testuser",
        full_name="Test User",
        password="TestPassword123!"
    )
    
    user = auth_service.create_user(user_data)
    return user

@pytest.fixture
def test_admin_user(db_session, auth_service):
    """Create test admin user."""
    from app.auth.schemas import UserCreate
    
    user_data = UserCreate(
        email="admin@example.com",
        username="admin",
        full_name="Admin User",
        password="AdminPassword123!"
    )
    
    user = auth_service.create_user(user_data)
    user.is_superuser = True
    db_session.commit()
    db_session.refresh(user)
    return user

@pytest.fixture
def test_equipment(db_session):
    """Create test equipment."""
    equipment = Equipment(
        machine_id="test-excavator-001",
        name="Test Excavator",
        type="excavator",
        model="CAT 320",
        manufacturer="Caterpillar",
        location="Mine Site A",
        status="active"
    )
    
    db_session.add(equipment)
    db_session.commit()
    db_session.refresh(equipment)
    return equipment

@pytest.fixture
def test_telemetry_data(db_session, test_equipment):
    """Create test telemetry data."""
    telemetry = TelemetryData(
        machine_id=test_equipment.machine_id,
        vibration_g=2.5,
        temperature_c=75.0,
        pressure_psi=150.0,
        rpm=1800,
        fuel_level=85.0,
        runtime_hours=1250.5,
        load_percentage=75.0,
        efficiency_score=0.85,
        health_score=0.92
    )
    
    db_session.add(telemetry)
    db_session.commit()
    db_session.refresh(telemetry)
    return telemetry

@pytest.fixture
def test_alert(db_session, test_equipment):
    """Create test alert."""
    alert = Alert(
        machine_id=test_equipment.machine_id,
        alert_type="maintenance",
        severity="medium",
        message="Scheduled maintenance due",
        status="active"
    )
    
    db_session.add(alert)
    db_session.commit()
    db_session.refresh(alert)
    return alert

@pytest.fixture
def auth_headers(test_user, auth_service):
    """Create authentication headers for testing."""
    # Create session for test user
    session = auth_service.create_session(test_user)
    
    # In a real implementation, you'd get the JWT token
    # For testing, we'll use the session token
    return {"Authorization": f"Bearer {session.session_token}"}

@pytest.fixture
def admin_headers(test_admin_user, auth_service):
    """Create admin authentication headers for testing."""
    session = auth_service.create_session(test_admin_user)
    return {"Authorization": f"Bearer {session.session_token}"}

# Test data factories
class TestDataFactory:
    """Factory for creating test data."""
    
    @staticmethod
    def create_equipment_data(machine_id: str = "test-machine-001", **kwargs):
        """Create equipment test data."""
        default_data = {
            "machine_id": machine_id,
            "name": f"Test {machine_id}",
            "type": "excavator",
            "model": "CAT 320",
            "manufacturer": "Caterpillar",
            "location": "Test Site",
            "status": "active"
        }
        default_data.update(kwargs)
        return default_data
    
    @staticmethod
    def create_telemetry_data(machine_id: str = "test-machine-001", **kwargs):
        """Create telemetry test data."""
        default_data = {
            "machine_id": machine_id,
            "vibration_g": 2.0,
            "temperature_c": 70.0,
            "pressure_psi": 140.0,
            "rpm": 1750,
            "fuel_level": 80.0,
            "runtime_hours": 1000.0,
            "load_percentage": 70.0,
            "efficiency_score": 0.8,
            "health_score": 0.9
        }
        default_data.update(kwargs)
        return default_data
    
    @staticmethod
    def create_alert_data(machine_id: str = "test-machine-001", **kwargs):
        """Create alert test data."""
        default_data = {
            "machine_id": machine_id,
            "alert_type": "maintenance",
            "severity": "medium",
            "message": "Test alert message"
        }
        default_data.update(kwargs)
        return default_data

# Utility functions for testing
def assert_response_success(response, expected_status=200):
    """Assert that response is successful."""
    assert response.status_code == expected_status
    assert response.json() is not None

def assert_response_error(response, expected_status=400):
    """Assert that response is an error."""
    assert response.status_code == expected_status
    assert "detail" in response.json()

def create_multiple_equipment(db_session, count: int = 5):
    """Create multiple test equipment records."""
    equipment_list = []
    for i in range(count):
        equipment = Equipment(
            machine_id=f"test-machine-{i:03d}",
            name=f"Test Machine {i}",
            type="excavator",
            model="CAT 320",
            manufacturer="Caterpillar",
            location=f"Site {i}",
            status="active"
        )
        db_session.add(equipment)
        equipment_list.append(equipment)
    
    db_session.commit()
    for equipment in equipment_list:
        db_session.refresh(equipment)
    
    return equipment_list

def create_telemetry_history(db_session, machine_id: str, count: int = 10):
    """Create telemetry history for testing."""
    telemetry_list = []
    base_time = datetime.utcnow()
    
    for i in range(count):
        telemetry = TelemetryData(
            machine_id=machine_id,
            timestamp=base_time - timedelta(hours=i),
            vibration_g=2.0 + (i * 0.1),
            temperature_c=70.0 + (i * 2.0),
            pressure_psi=140.0 + (i * 5.0),
            rpm=1750 + (i * 10),
            fuel_level=80.0 - (i * 2.0),
            runtime_hours=1000.0 + (i * 10.0),
            load_percentage=70.0 + (i * 1.0),
            efficiency_score=0.8 - (i * 0.01),
            health_score=0.9 - (i * 0.02)
        )
        db_session.add(telemetry)
        telemetry_list.append(telemetry)
    
    db_session.commit()
    for telemetry in telemetry_list:
        db_session.refresh(telemetry)
    
    return telemetry_list
