"""
Database index optimization for handling 450 trucks efficiently.
Creates indexes for optimal query performance with large datasets.
"""

from sqlalchemy import text
from sqlalchemy.orm import Session
from loguru import logger
from typing import List, Dict, Any

class DatabaseOptimizer:
    """Handles database optimization and index creation."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_performance_indexes(self) -> Dict[str, Any]:
        """Create all performance indexes for optimal query speed."""
        
        indexes = [
            # Telemetry table indexes - critical for 450 trucks
            {
                "name": "idx_telemetry_machine_timestamp",
                "sql": "CREATE INDEX IF NOT EXISTS idx_telemetry_machine_timestamp ON telemetry(machine_id, timestamp DESC)",
                "description": "Optimizes queries filtering by machine and time range"
            },
            {
                "name": "idx_telemetry_timestamp",
                "sql": "CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry(timestamp DESC)",
                "description": "Optimizes time-based queries and sorting"
            },
            {
                "name": "idx_telemetry_machine_id",
                "sql": "CREATE INDEX IF NOT EXISTS idx_telemetry_machine_id ON telemetry(machine_id)",
                "description": "Optimizes machine-specific queries"
            },
            {
                "name": "idx_telemetry_temperature",
                "sql": "CREATE INDEX IF NOT EXISTS idx_telemetry_temperature ON telemetry(temperature)",
                "description": "Optimizes temperature-based filtering and alerts"
            },
            {
                "name": "idx_telemetry_vibration",
                "sql": "CREATE INDEX IF NOT EXISTS idx_telemetry_vibration ON telemetry(vibration)",
                "description": "Optimizes vibration-based filtering and alerts"
            },
            
            # Machine table indexes
            {
                "name": "idx_machines_site",
                "sql": "CREATE INDEX IF NOT EXISTS idx_machines_site ON machines(site)",
                "description": "Optimizes site-based machine queries"
            },
            {
                "name": "idx_machines_model",
                "sql": "CREATE INDEX IF NOT EXISTS idx_machines_model ON machines(model)",
                "description": "Optimizes model-based machine queries"
            },
            {
                "name": "idx_machines_site_model",
                "sql": "CREATE INDEX IF NOT EXISTS idx_machines_site_model ON machines(site, model)",
                "description": "Optimizes combined site and model queries"
            },
            {
                "name": "idx_machines_machine_id",
                "sql": "CREATE INDEX IF NOT EXISTS idx_machines_machine_id ON machines(machine_id)",
                "description": "Optimizes machine ID lookups"
            },
            
            # Prediction table indexes
            {
                "name": "idx_predictions_machine_timestamp",
                "sql": "CREATE INDEX IF NOT EXISTS idx_predictions_machine_timestamp ON predictions(machine_id, timestamp DESC)",
                "description": "Optimizes prediction history queries"
            },
            {
                "name": "idx_predictions_timestamp",
                "sql": "CREATE INDEX IF NOT EXISTS idx_predictions_timestamp ON predictions(timestamp DESC)",
                "description": "Optimizes time-based prediction queries"
            },
            {
                "name": "idx_predictions_health_score",
                "sql": "CREATE INDEX IF NOT EXISTS idx_predictions_health_score ON predictions(health_score)",
                "description": "Optimizes health score filtering and alerts"
            },
            
            # User and authentication indexes
            {
                "name": "idx_users_username",
                "sql": "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)",
                "description": "Optimizes username lookups for authentication"
            },
            {
                "name": "idx_users_email",
                "sql": "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
                "description": "Optimizes email lookups for authentication"
            },
            {
                "name": "idx_users_company_id",
                "sql": "CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id)",
                "description": "Optimizes company-based user queries"
            },
            
            # Alert table indexes
            {
                "name": "idx_alerts_machine_timestamp",
                "sql": "CREATE INDEX IF NOT EXISTS idx_alerts_machine_timestamp ON alerts(machine_id, timestamp DESC)",
                "description": "Optimizes machine-specific alert queries"
            },
            {
                "name": "idx_alerts_status",
                "sql": "CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status)",
                "description": "Optimizes alert status filtering"
            },
            {
                "name": "idx_alerts_severity",
                "sql": "CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity)",
                "description": "Optimizes alert severity filtering"
            }
        ]
        
        results = {
            "created": [],
            "failed": [],
            "total": len(indexes)
        }
        
        for index in indexes:
            try:
                # Check if table exists before creating index
                table_name = index["sql"].split("ON ")[1].split("(")[0].strip()
                check_table_sql = f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table_name}'"
                table_exists = self.db.execute(text(check_table_sql)).fetchone()
                
                if table_exists:
                    self.db.execute(text(index["sql"]))
                    self.db.commit()
                    results["created"].append({
                        "name": index["name"],
                        "description": index["description"]
                    })
                    logger.info(f"Created index: {index['name']}")
                else:
                    results["skipped"].append({
                        "name": index["name"],
                        "reason": f"Table {table_name} does not exist"
                    })
                    logger.info(f"Skipped index {index['name']}: Table {table_name} does not exist")
            except Exception as e:
                results["failed"].append({
                    "name": index["name"],
                    "error": str(e)
                })
                logger.error(f"Failed to create index {index['name']}: {e}")
        
        return results
    
    def analyze_query_performance(self, query_sql: str) -> Dict[str, Any]:
        """Analyze query performance using EXPLAIN ANALYZE."""
        try:
            explain_sql = f"EXPLAIN ANALYZE {query_sql}"
            result = self.db.execute(text(explain_sql))
            
            analysis = {
                "query": query_sql,
                "execution_plan": [row[0] for row in result.fetchall()],
                "analyzed_at": "now()"
            }
            
            return analysis
        except Exception as e:
            logger.error(f"Failed to analyze query performance: {e}")
            return {"error": str(e)}
    
    def get_index_usage_stats(self) -> Dict[str, Any]:
        """Get statistics about index usage."""
        try:
            # PostgreSQL specific query for index usage statistics
            stats_query = """
            SELECT 
                schemaname,
                tablename,
                indexname,
                idx_tup_read,
                idx_tup_fetch
            FROM pg_stat_user_indexes 
            WHERE schemaname = 'public'
            ORDER BY idx_tup_read DESC;
            """
            
            result = self.db.execute(text(stats_query))
            stats = [dict(row._mapping) for row in result.fetchall()]
            
            return {
                "index_usage_stats": stats,
                "total_indexes": len(stats)
            }
        except Exception as e:
            logger.error(f"Failed to get index usage stats: {e}")
            return {"error": str(e)}
    
    def optimize_table_statistics(self) -> Dict[str, Any]:
        """Update table statistics for better query planning."""
        tables = ["telemetry", "machines", "predictions", "users", "alerts"]
        results = {"updated": [], "failed": []}
        
        for table in tables:
            try:
                analyze_sql = f"ANALYZE {table}"
                self.db.execute(text(analyze_sql))
                self.db.commit()
                results["updated"].append(table)
                logger.info(f"Updated statistics for table: {table}")
            except Exception as e:
                results["failed"].append({"table": table, "error": str(e)})
                logger.error(f"Failed to update statistics for {table}: {e}")
        
        return results

def create_all_indexes(db: Session) -> Dict[str, Any]:
    """Convenience function to create all performance indexes."""
    optimizer = DatabaseOptimizer(db)
    return optimizer.create_performance_indexes()

def optimize_database_performance(db: Session) -> Dict[str, Any]:
    """Complete database optimization including indexes and statistics."""
    optimizer = DatabaseOptimizer(db)
    
    results = {
        "indexes": optimizer.create_performance_indexes(),
        "statistics": optimizer.optimize_table_statistics(),
        "index_usage": optimizer.get_index_usage_stats()
    }
    
    return results
