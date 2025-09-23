"""
Seed script to create default users and roles.
"""
from sqlalchemy.orm import Session
from .models import User, Role, UserRole
from .service import AuthService

def create_default_roles(db: Session):
    """Create default roles."""
    roles_data = [
        {
            "name": "admin",
            "description": "System administrator with full access",
            "permissions": [
                "read:users", "write:users", "delete:users",
                "read:machines", "write:machines", "delete:machines",
                "read:telemetry", "write:telemetry",
                "read:analytics", "write:analytics",
                "read:reports", "write:reports",
                "manage:roles", "manage:system"
            ]
        },
        {
            "name": "operator",
            "description": "Equipment operator with operational access",
            "permissions": [
                "read:machines", "write:machines",
                "read:telemetry", "write:telemetry",
                "read:analytics", "read:reports"
            ]
        },
        {
            "name": "viewer",
            "description": "Read-only access to dashboard and reports",
            "permissions": [
                "read:machines", "read:telemetry",
                "read:analytics", "read:reports"
            ]
        },
        {
            "name": "maintenance",
            "description": "Maintenance technician with equipment access",
            "permissions": [
                "read:machines", "write:machines",
                "read:telemetry", "read:analytics",
                "read:reports", "write:reports"
            ]
        }
    ]
    
    auth_service = AuthService(db)
    
    for role_data in roles_data:
        # Check if role already exists
        existing_role = auth_service.get_role_by_name(role_data["name"])
        if not existing_role:
            from .schemas import RoleCreate
            role_create = RoleCreate(
                name=role_data["name"],
                description=role_data["description"],
                permissions=role_data["permissions"]
            )
            auth_service.create_role(role_create)
            print(f"Created role: {role_data['name']}")

def create_default_users(db: Session):
    """Create default users."""
    users_data = [
        {
            "email": "admin@mining-pdm.com",
            "username": "admin",
            "full_name": "System Administrator",
            "password": "Admin123!",
            "is_superuser": True,
            "roles": ["admin"]
        },
        {
            "email": "operator@mining-pdm.com",
            "username": "operator",
            "full_name": "Equipment Operator",
            "password": "Operator123!",
            "is_superuser": False,
            "roles": ["operator"]
        },
        {
            "email": "viewer@mining-pdm.com",
            "username": "viewer",
            "full_name": "Dashboard Viewer",
            "password": "Viewer123!",
            "is_superuser": False,
            "roles": ["viewer"]
        },
        {
            "email": "maintenance@mining-pdm.com",
            "username": "maintenance",
            "full_name": "Maintenance Technician",
            "password": "Maintenance123!",
            "is_superuser": False,
            "roles": ["maintenance"]
        }
    ]
    
    auth_service = AuthService(db)
    
    for user_data in users_data:
        # Check if user already exists
        existing_user = auth_service.get_user_by_username(user_data["username"])
        if not existing_user:
            from .schemas import UserCreate
            user_create = UserCreate(
                email=user_data["email"],
                username=user_data["username"],
                full_name=user_data["full_name"],
                password=user_data["password"],
                is_active=True
            )
            
            user = auth_service.create_user(user_create)
            
            # Make superuser if specified
            if user_data["is_superuser"]:
                user.is_superuser = True
                db.commit()
            
            # Assign roles
            for role_name in user_data["roles"]:
                role = auth_service.get_role_by_name(role_name)
                if role:
                    auth_service.assign_role_to_user(user.id, role.id, user.id)
            
            print(f"Created user: {user_data['username']}")

def seed_database(db: Session):
    """Seed the database with default data."""
    print("🌱 Seeding database with default users and roles...")
    
    # Create roles first
    create_default_roles(db)
    
    # Create users
    create_default_users(db)
    
    print("✅ Database seeding completed!")
    print("\n📋 Default Login Credentials:")
    print("Admin: admin / Admin123!")
    print("Operator: operator / Operator123!")
    print("Viewer: viewer / Viewer123!")
    print("Maintenance: maintenance / Maintenance123!")

if __name__ == "__main__":
    from ..db import SessionLocal
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
