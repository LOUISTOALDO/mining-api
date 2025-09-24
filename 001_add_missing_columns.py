"""Add missing columns for indexes

Revision ID: 001_add_missing_columns
Revises: 
Create Date: 2025-09-24 14:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_add_missing_columns'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    """Add missing columns that are referenced in indexes."""
    
    # Add missing columns to users table
    try:
        op.add_column('users', sa.Column('company_id', sa.String(255), nullable=True))
        print("Added company_id column to users table")
    except Exception as e:
        print(f"Could not add company_id to users: {e}")
    
    # Add missing columns to alerts table  
    try:
        op.add_column('alerts', sa.Column('timestamp', sa.DateTime(timezone=True), nullable=True))
        print("Added timestamp column to alerts table")
    except Exception as e:
        print(f"Could not add timestamp to alerts: {e}")
    
    # Add missing columns to machines table
    try:
        op.add_column('machines', sa.Column('site', sa.String(255), nullable=True))
        op.add_column('machines', sa.Column('model', sa.String(255), nullable=True))
        op.add_column('machines', sa.Column('machine_id', sa.String(255), nullable=True))
        print("Added site, model, machine_id columns to machines table")
    except Exception as e:
        print(f"Could not add columns to machines: {e}")
    
    # Add missing columns to telemetry table
    try:
        op.add_column('telemetry', sa.Column('machine_id', sa.String(255), nullable=True))
        print("Added machine_id column to telemetry table")
    except Exception as e:
        print(f"Could not add machine_id to telemetry: {e}")
    
    # Add missing columns to predictions table
    try:
        op.add_column('predictions', sa.Column('machine_id', sa.String(255), nullable=True))
        op.add_column('predictions', sa.Column('timestamp', sa.DateTime(timezone=True), nullable=True))
        op.add_column('predictions', sa.Column('health_score', sa.Float, nullable=True))
        print("Added machine_id, timestamp, health_score columns to predictions table")
    except Exception as e:
        print(f"Could not add columns to predictions: {e}")


def downgrade():
    """Remove the added columns."""
    
    # Remove columns from users table
    try:
        op.drop_column('users', 'company_id')
    except Exception:
        pass
    
    # Remove columns from alerts table
    try:
        op.drop_column('alerts', 'timestamp')
    except Exception:
        pass
    
    # Remove columns from machines table
    try:
        op.drop_column('machines', 'site')
        op.drop_column('machines', 'model')
        op.drop_column('machines', 'machine_id')
    except Exception:
        pass
    
    # Remove columns from telemetry table
    try:
        op.drop_column('telemetry', 'machine_id')
    except Exception:
        pass
    
    # Remove columns from predictions table
    try:
        op.drop_column('predictions', 'machine_id')
        op.drop_column('predictions', 'timestamp')
        op.drop_column('predictions', 'health_score')
    except Exception:
        pass
