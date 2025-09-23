"""
Database migration system for schema versioning and data management.
"""
import os
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.orm import sessionmaker
from loguru import logger

class DatabaseMigrator:
    """Handles database migrations and schema versioning."""
    
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.engine = create_engine(database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        self.migrations_dir = Path(__file__).parent / "migration_files"
        self.migrations_dir.mkdir(exist_ok=True)
        
    def get_current_version(self) -> int:
        """Get current database version."""
        try:
            with self.engine.connect() as conn:
                result = conn.execute(text("SELECT version FROM schema_version ORDER BY id DESC LIMIT 1"))
                row = result.fetchone()
                return row[0] if row else 0
        except Exception:
            # Schema version table doesn't exist
            return 0
    
    def set_version(self, version: int) -> None:
        """Set database version."""
        with self.engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS schema_version (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    version INTEGER NOT NULL,
                    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    description TEXT
                )
            """))
            conn.execute(text("INSERT INTO schema_version (version, description) VALUES (:version, :desc)"), 
                        {"version": version, "desc": f"Migration to version {version}"})
            conn.commit()
    
    def get_migration_files(self) -> List[Dict[str, Any]]:
        """Get all migration files in order."""
        migrations = []
        for file_path in self.migrations_dir.glob("*.json"):
            try:
                with open(file_path, 'r') as f:
                    migration = json.load(f)
                    migration['file_path'] = file_path
                    migrations.append(migration)
            except Exception as e:
                logger.error(f"Error reading migration file {file_path}: {e}")
        
        return sorted(migrations, key=lambda x: x['version'])
    
    def apply_migration(self, migration: Dict[str, Any]) -> None:
        """Apply a single migration."""
        logger.info(f"Applying migration {migration['version']}: {migration['description']}")
        
        with self.engine.connect() as conn:
            # Start transaction
            trans = conn.begin()
            try:
                # Execute SQL commands
                for sql in migration.get('up', []):
                    conn.execute(text(sql))
                
                # Update version
                self.set_version(migration['version'])
                trans.commit()
                logger.info(f"Successfully applied migration {migration['version']}")
                
            except Exception as e:
                trans.rollback()
                logger.error(f"Failed to apply migration {migration['version']}: {e}")
                raise
    
    def rollback_migration(self, migration: Dict[str, Any]) -> None:
        """Rollback a single migration."""
        logger.info(f"Rolling back migration {migration['version']}: {migration['description']}")
        
        with self.engine.connect() as conn:
            trans = conn.begin()
            try:
                # Execute rollback SQL commands
                for sql in migration.get('down', []):
                    conn.execute(text(sql))
                
                # Remove version record
                conn.execute(text("DELETE FROM schema_version WHERE version = :version"), 
                           {"version": migration['version']})
                trans.commit()
                logger.info(f"Successfully rolled back migration {migration['version']}")
                
            except Exception as e:
                trans.rollback()
                logger.error(f"Failed to rollback migration {migration['version']}: {e}")
                raise
    
    def migrate(self) -> None:
        """Run all pending migrations."""
        current_version = self.get_current_version()
        migrations = self.get_migration_files()
        
        pending_migrations = [m for m in migrations if m['version'] > current_version]
        
        if not pending_migrations:
            logger.info("No pending migrations")
            return
        
        logger.info(f"Found {len(pending_migrations)} pending migrations")
        
        for migration in pending_migrations:
            self.apply_migration(migration)
    
    def rollback_to_version(self, target_version: int) -> None:
        """Rollback to a specific version."""
        current_version = self.get_current_version()
        migrations = self.get_migration_files()
        
        # Get migrations to rollback (in reverse order)
        migrations_to_rollback = [m for m in migrations 
                                 if m['version'] > target_version and m['version'] <= current_version]
        migrations_to_rollback.reverse()
        
        for migration in migrations_to_rollback:
            self.rollback_migration(migration)
    
    def create_migration(self, version: int, description: str, up_sql: List[str], down_sql: List[str] = None) -> None:
        """Create a new migration file."""
        migration = {
            "version": version,
            "description": description,
            "up": up_sql,
            "down": down_sql or []
        }
        
        filename = f"{version:03d}_{description.lower().replace(' ', '_')}.json"
        file_path = self.migrations_dir / filename
        
        with open(file_path, 'w') as f:
            json.dump(migration, f, indent=2)
        
        logger.info(f"Created migration file: {file_path}")

def create_initial_migrations(migrator: DatabaseMigrator) -> None:
    """Create initial migration files."""
    
    # Migration 1: Create auth tables
    migrator.create_migration(
        version=1,
        description="Create authentication tables",
        up_sql=[
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(255) UNIQUE NOT NULL,
                username VARCHAR(100) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                hashed_password VARCHAR(255) NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                is_superuser BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP,
                last_login TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(100) UNIQUE NOT NULL,
                description TEXT,
                permissions TEXT,
                is_active BOOLEAN DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS user_roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                role_id INTEGER NOT NULL,
                assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                assigned_by INTEGER,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (role_id) REFERENCES roles (id),
                FOREIGN KEY (assigned_by) REFERENCES users (id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token VARCHAR(255) UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS api_keys (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name VARCHAR(255) NOT NULL,
                key_hash VARCHAR(255) UNIQUE NOT NULL,
                key_prefix VARCHAR(10) NOT NULL,
                is_active BOOLEAN DEFAULT 1,
                expires_at TIMESTAMP,
                last_used TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        ],
        down_sql=[
            "DROP TABLE IF EXISTS api_keys",
            "DROP TABLE IF EXISTS user_sessions", 
            "DROP TABLE IF EXISTS user_roles",
            "DROP TABLE IF EXISTS roles",
            "DROP TABLE IF EXISTS users"
        ]
    )
    
    # Migration 2: Create equipment and telemetry tables
    migrator.create_migration(
        version=2,
        description="Create equipment and telemetry tables",
        up_sql=[
            """
            CREATE TABLE IF NOT EXISTS equipment (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                machine_id VARCHAR(100) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                model VARCHAR(100),
                manufacturer VARCHAR(100),
                serial_number VARCHAR(100),
                location VARCHAR(255),
                status VARCHAR(50) DEFAULT 'active',
                installation_date DATE,
                last_maintenance DATE,
                next_maintenance DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS telemetry_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                machine_id VARCHAR(100) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                vibration_g REAL,
                temperature_c REAL,
                pressure_psi REAL,
                rpm INTEGER,
                fuel_level REAL,
                runtime_hours REAL,
                load_percentage REAL,
                efficiency_score REAL,
                health_score REAL,
                FOREIGN KEY (machine_id) REFERENCES equipment (machine_id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS maintenance_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                machine_id VARCHAR(100) NOT NULL,
                maintenance_type VARCHAR(100) NOT NULL,
                description TEXT,
                performed_by VARCHAR(255),
                performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                cost REAL,
                parts_used TEXT,
                notes TEXT,
                FOREIGN KEY (machine_id) REFERENCES equipment (machine_id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                machine_id VARCHAR(100) NOT NULL,
                alert_type VARCHAR(100) NOT NULL,
                severity VARCHAR(50) NOT NULL,
                message TEXT NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                acknowledged_at TIMESTAMP,
                acknowledged_by INTEGER,
                resolved_at TIMESTAMP,
                FOREIGN KEY (machine_id) REFERENCES equipment (machine_id),
                FOREIGN KEY (acknowledged_by) REFERENCES users (id)
            )
            """
        ],
        down_sql=[
            "DROP TABLE IF EXISTS alerts",
            "DROP TABLE IF EXISTS maintenance_records",
            "DROP TABLE IF EXISTS telemetry_data",
            "DROP TABLE IF EXISTS equipment"
        ]
    )
    
    # Migration 3: Create analytics and reporting tables
    migrator.create_migration(
        version=3,
        description="Create analytics and reporting tables",
        up_sql=[
            """
            CREATE TABLE IF NOT EXISTS performance_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                machine_id VARCHAR(100) NOT NULL,
                date DATE NOT NULL,
                total_runtime_hours REAL,
                average_efficiency REAL,
                fuel_consumption REAL,
                maintenance_cost REAL,
                production_volume REAL,
                downtime_hours REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (machine_id) REFERENCES equipment (machine_id),
                UNIQUE(machine_id, date)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS cost_analysis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                period_start DATE NOT NULL,
                period_end DATE NOT NULL,
                total_operational_cost REAL,
                fuel_cost REAL,
                maintenance_cost REAL,
                labor_cost REAL,
                cost_per_hour REAL,
                cost_per_ton REAL,
                efficiency_savings REAL,
                roi_percentage REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_type VARCHAR(100) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                parameters TEXT,
                generated_by INTEGER NOT NULL,
                generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                file_path VARCHAR(500),
                status VARCHAR(50) DEFAULT 'generated',
                FOREIGN KEY (generated_by) REFERENCES users (id)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                action VARCHAR(100) NOT NULL,
                resource_type VARCHAR(100),
                resource_id VARCHAR(100),
                details TEXT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
            """
        ],
        down_sql=[
            "DROP TABLE IF EXISTS audit_logs",
            "DROP TABLE IF EXISTS reports",
            "DROP TABLE IF EXISTS cost_analysis",
            "DROP TABLE IF EXISTS performance_metrics"
        ]
    )

def run_migrations(database_url: str) -> None:
    """Run all database migrations."""
    migrator = DatabaseMigrator(database_url)
    
    # Create initial migrations if they don't exist
    if not migrator.get_migration_files():
        logger.info("Creating initial migrations...")
        create_initial_migrations(migrator)
    
    # Run migrations
    logger.info("Running database migrations...")
    migrator.migrate()
    logger.info("Database migrations completed!")

if __name__ == "__main__":
    from ..config import settings
    run_migrations(settings.database_url)
