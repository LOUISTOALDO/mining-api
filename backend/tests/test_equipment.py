"""
Tests for equipment management system.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.services.equipment_service import EquipmentService
from app.models.equipment import Equipment, TelemetryData, Alert

class TestEquipmentService:
    """Test equipment service."""
    
    def test_create_equipment(self, db_session: Session):
        """Test equipment creation."""
        equipment_service = EquipmentService(db_session)
        
        equipment_data = {
            "machine_id": "test-excavator-001",
            "name": "Test Excavator",
            "type": "excavator",
            "model": "CAT 320",
            "manufacturer": "Caterpillar",
            "location": "Mine Site A",
            "status": "active"
        }
        
        equipment = equipment_service.create_equipment(equipment_data)
        
        assert equipment.machine_id == equipment_data["machine_id"]
        assert equipment.name == equipment_data["name"]
        assert equipment.type == equipment_data["type"]
        assert equipment.status == equipment_data["status"]
    
    def test_get_equipment(self, db_session: Session, test_equipment):
        """Test getting equipment by ID."""
        equipment_service = EquipmentService(db_session)
        
        retrieved_equipment = equipment_service.get_equipment(test_equipment.machine_id)
        
        assert retrieved_equipment is not None
        assert retrieved_equipment.id == test_equipment.id
        assert retrieved_equipment.machine_id == test_equipment.machine_id
    
    def test_get_nonexistent_equipment(self, db_session: Session):
        """Test getting non-existent equipment."""
        equipment_service = EquipmentService(db_session)
        
        equipment = equipment_service.get_equipment("nonexistent-id")
        
        assert equipment is None
    
    def test_update_equipment(self, db_session: Session, test_equipment):
        """Test updating equipment."""
        equipment_service = EquipmentService(db_session)
        
        update_data = {
            "name": "Updated Excavator",
            "location": "Mine Site B",
            "status": "maintenance"
        }
        
        updated_equipment = equipment_service.update_equipment(
            test_equipment.machine_id, 
            update_data
        )
        
        assert updated_equipment is not None
        assert updated_equipment.name == update_data["name"]
        assert updated_equipment.location == update_data["location"]
        assert updated_equipment.status == update_data["status"]
    
    def test_delete_equipment(self, db_session: Session, test_equipment):
        """Test deleting equipment."""
        equipment_service = EquipmentService(db_session)
        
        success = equipment_service.delete_equipment(test_equipment.machine_id)
        
        assert success is True
        
        # Verify equipment is deleted
        deleted_equipment = equipment_service.get_equipment(test_equipment.machine_id)
        assert deleted_equipment is None
    
    def test_add_telemetry_data(self, db_session: Session, test_equipment):
        """Test adding telemetry data."""
        equipment_service = EquipmentService(db_session)
        
        telemetry_data = {
            "vibration_g": 2.5,
            "temperature_c": 75.0,
            "pressure_psi": 150.0,
            "rpm": 1800,
            "fuel_level": 85.0,
            "runtime_hours": 1250.5,
            "load_percentage": 75.0,
            "efficiency_score": 0.85,
            "health_score": 0.92
        }
        
        telemetry = equipment_service.add_telemetry_data(
            test_equipment.machine_id, 
            telemetry_data
        )
        
        assert telemetry.machine_id == test_equipment.machine_id
        assert telemetry.vibration_g == telemetry_data["vibration_g"]
        assert telemetry.temperature_c == telemetry_data["temperature_c"]
        assert telemetry.health_score == telemetry_data["health_score"]
    
    def test_get_latest_telemetry(self, db_session: Session, test_equipment, test_telemetry_data):
        """Test getting latest telemetry data."""
        equipment_service = EquipmentService(db_session)
        
        latest_telemetry = equipment_service.get_latest_telemetry(test_equipment.machine_id)
        
        assert latest_telemetry is not None
        assert latest_telemetry.id == test_telemetry_data.id
    
    def test_get_telemetry_history(self, db_session: Session, test_equipment):
        """Test getting telemetry history."""
        equipment_service = EquipmentService(db_session)
        
        # Create multiple telemetry records
        from tests.conftest import create_telemetry_history
        telemetry_list = create_telemetry_history(db_session, test_equipment.machine_id, 5)
        
        history = equipment_service.get_telemetry_history(test_equipment.machine_id, 24)
        
        assert len(history) == 5
        # Should be ordered by timestamp descending
        assert history[0].timestamp >= history[1].timestamp
    
    def test_get_telemetry_summary(self, db_session: Session, test_equipment):
        """Test getting telemetry summary."""
        equipment_service = EquipmentService(db_session)
        
        # Create telemetry data
        from tests.conftest import create_telemetry_history
        create_telemetry_history(db_session, test_equipment.machine_id, 10)
        
        summary = equipment_service.get_telemetry_summary(test_equipment.machine_id, 7)
        
        assert "avg_vibration" in summary
        assert "avg_temperature" in summary
        assert "avg_health" in summary
        assert "data_points" in summary
        assert summary["data_points"] == 10
    
    def test_create_alert(self, db_session: Session, test_equipment):
        """Test creating alert."""
        equipment_service = EquipmentService(db_session)
        
        alert_data = {
            "alert_type": "maintenance",
            "severity": "high",
            "message": "Critical maintenance required"
        }
        
        alert = equipment_service.create_alert(test_equipment.machine_id, alert_data)
        
        assert alert.machine_id == test_equipment.machine_id
        assert alert.alert_type == alert_data["alert_type"]
        assert alert.severity == alert_data["severity"]
        assert alert.message == alert_data["message"]
        assert alert.status == "active"
    
    def test_get_active_alerts(self, db_session: Session, test_equipment, test_alert):
        """Test getting active alerts."""
        equipment_service = EquipmentService(db_session)
        
        alerts = equipment_service.get_active_alerts(test_equipment.machine_id)
        
        assert len(alerts) == 1
        assert alerts[0].id == test_alert.id
        assert alerts[0].status == "active"
    
    def test_acknowledge_alert(self, db_session: Session, test_alert, test_user):
        """Test acknowledging alert."""
        equipment_service = EquipmentService(db_session)
        
        acknowledged_alert = equipment_service.acknowledge_alert(test_alert.id, test_user.id)
        
        assert acknowledged_alert is not None
        assert acknowledged_alert.status == "acknowledged"
        assert acknowledged_alert.acknowledged_by == test_user.id
        assert acknowledged_alert.acknowledged_at is not None
    
    def test_resolve_alert(self, db_session: Session, test_alert):
        """Test resolving alert."""
        equipment_service = EquipmentService(db_session)
        
        resolved_alert = equipment_service.resolve_alert(test_alert.id)
        
        assert resolved_alert is not None
        assert resolved_alert.status == "resolved"
        assert resolved_alert.resolved_at is not None
    
    def test_get_fleet_performance_summary(self, db_session: Session, test_equipment):
        """Test getting fleet performance summary."""
        equipment_service = EquipmentService(db_session)
        
        summary = equipment_service.get_fleet_performance_summary()
        
        assert "total_equipment" in summary
        assert "active_alerts" in summary
        assert "avg_health_score" in summary
        assert "maintenance_due" in summary
        assert "fleet_status" in summary
        assert summary["total_equipment"] >= 1

class TestEquipmentAPI:
    """Test equipment API endpoints."""
    
    def test_create_equipment(self, client: TestClient, admin_headers):
        """Test creating equipment via API."""
        equipment_data = {
            "machine_id": "api-test-excavator-001",
            "name": "API Test Excavator",
            "type": "excavator",
            "model": "CAT 320",
            "manufacturer": "Caterpillar",
            "location": "API Test Site",
            "status": "active"
        }
        
        response = client.post("/v1/equipment/", json=equipment_data, headers=admin_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["machine_id"] == equipment_data["machine_id"]
        assert data["name"] == equipment_data["name"]
    
    def test_create_duplicate_equipment(self, client: TestClient, admin_headers, test_equipment):
        """Test creating duplicate equipment fails."""
        equipment_data = {
            "machine_id": test_equipment.machine_id,  # Same machine ID
            "name": "Duplicate Equipment",
            "type": "excavator",
            "status": "active"
        }
        
        response = client.post("/v1/equipment/", json=equipment_data, headers=admin_headers)
        
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]
    
    def test_get_equipment_list(self, client: TestClient, auth_headers):
        """Test getting equipment list."""
        response = client.get("/v1/equipment/", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert "page" in data
        assert "size" in data
        assert "pages" in data
        assert isinstance(data["items"], list)
    
    def test_get_equipment_by_id(self, client: TestClient, auth_headers, test_equipment):
        """Test getting equipment by ID."""
        response = client.get(f"/v1/equipment/{test_equipment.machine_id}", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["machine_id"] == test_equipment.machine_id
        assert data["name"] == test_equipment.name
    
    def test_get_nonexistent_equipment(self, client: TestClient, auth_headers):
        """Test getting non-existent equipment."""
        response = client.get("/v1/equipment/nonexistent-id", headers=auth_headers)
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]
    
    def test_update_equipment(self, client: TestClient, admin_headers, test_equipment):
        """Test updating equipment."""
        update_data = {
            "name": "Updated Equipment Name",
            "location": "Updated Location",
            "status": "maintenance"
        }
        
        response = client.put(
            f"/v1/equipment/{test_equipment.machine_id}", 
            json=update_data, 
            headers=admin_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == update_data["name"]
        assert data["location"] == update_data["location"]
        assert data["status"] == update_data["status"]
    
    def test_delete_equipment(self, client: TestClient, admin_headers, test_equipment):
        """Test deleting equipment."""
        response = client.delete(f"/v1/equipment/{test_equipment.machine_id}", headers=admin_headers)
        
        assert response.status_code == 200
        assert "deleted successfully" in response.json()["message"]
    
    def test_add_telemetry_data(self, client: TestClient, auth_headers, test_equipment):
        """Test adding telemetry data."""
        telemetry_data = {
            "vibration_g": 2.5,
            "temperature_c": 75.0,
            "pressure_psi": 150.0,
            "rpm": 1800,
            "fuel_level": 85.0,
            "runtime_hours": 1250.5,
            "load_percentage": 75.0,
            "efficiency_score": 0.85,
            "health_score": 0.92
        }
        
        response = client.post(
            f"/v1/equipment/{test_equipment.machine_id}/telemetry",
            json=telemetry_data,
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["machine_id"] == test_equipment.machine_id
        assert data["vibration_g"] == telemetry_data["vibration_g"]
    
    def test_get_telemetry_history(self, client: TestClient, auth_headers, test_equipment):
        """Test getting telemetry history."""
        response = client.get(
            f"/v1/equipment/{test_equipment.machine_id}/telemetry",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "total" in data
        assert isinstance(data["items"], list)
    
    def test_get_telemetry_summary(self, client: TestClient, auth_headers, test_equipment):
        """Test getting telemetry summary."""
        response = client.get(
            f"/v1/equipment/{test_equipment.machine_id}/telemetry/summary",
            headers=auth_headers
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["machine_id"] == test_equipment.machine_id
        assert "avg_vibration" in data
        assert "avg_temperature" in data
        assert "data_points" in data
    
    def test_get_fleet_summary(self, client: TestClient, auth_headers):
        """Test getting fleet summary."""
        response = client.get("/v1/equipment/fleet/summary", headers=auth_headers)
        
        assert response.status_code == 200
        data = response.json()
        assert "total_equipment" in data
        assert "active_alerts" in data
        assert "avg_health_score" in data
        assert "fleet_status" in data
    
    def test_unauthorized_access(self, client: TestClient):
        """Test unauthorized access to equipment endpoints."""
        response = client.get("/v1/equipment/")
        
        assert response.status_code == 401
