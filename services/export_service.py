"""
Revolutionary Data Export & Integration Service.
This service will enable seamless data export and integration with any system.
"""

from typing import Dict, List, Any, Optional, Union, BinaryIO
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import pandas as pd
import numpy as np
import json
import csv
import io
import zipfile
from dataclasses import dataclass
from enum import Enum
import asyncio
from concurrent.futures import ThreadPoolExecutor
import base64

from ..db import get_db
from ..core.logging import logger
from ..models.equipment import Equipment

class ExportFormat(Enum):
    """Supported export formats."""
    CSV = "csv"
    EXCEL = "excel"
    JSON = "json"
    XML = "xml"
    PDF = "pdf"
    PARQUET = "parquet"
    SQL = "sql"
    API = "api"

class ExportType(Enum):
    """Types of data exports."""
    EQUIPMENT_DATA = "equipment_data"
    TELEMETRY_DATA = "telemetry_data"
    MAINTENANCE_RECORDS = "maintenance_records"
    COST_ANALYSIS = "cost_analysis"
    SAFETY_INCIDENTS = "safety_incidents"
    PREDICTIONS = "predictions"
    REPORTS = "reports"
    AUDIT_LOGS = "audit_logs"
    CUSTOM_QUERY = "custom_query"

@dataclass
class ExportConfig:
    """Configuration for data export."""
    export_type: ExportType
    format: ExportFormat
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    equipment_ids: Optional[List[str]] = None
    include_metadata: bool = True
    compression: bool = False
    encryption: bool = False
    custom_fields: Optional[List[str]] = None
    filters: Optional[Dict[str, Any]] = None
    sorting: Optional[Dict[str, str]] = None
    limit: Optional[int] = None
    offset: Optional[int] = None

@dataclass
class ExportResult:
    """Result of data export."""
    export_id: str
    filename: str
    format: ExportFormat
    size_bytes: int
    record_count: int
    created_at: datetime
    download_url: Optional[str] = None
    file_content: Optional[bytes] = None
    metadata: Optional[Dict[str, Any]] = None

class RevolutionaryExportService:
    """
    Revolutionary data export service that will transform how mining companies
    access and integrate their data. This service provides seamless export
    capabilities to any format or system.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.executor = ThreadPoolExecutor(max_workers=4)
    
    async def export_equipment_data(
        self, 
        config: ExportConfig
    ) -> ExportResult:
        """
        Export equipment data in the specified format.
        This will revolutionize how equipment data is accessed and shared.
        """
        logger.info(f"Exporting equipment data in {config.format.value} format")
        
        # Get equipment data
        equipment_data = await self._get_equipment_data(config)
        
        # Process and format data
        processed_data = await self._process_equipment_data(equipment_data, config)
        
        # Generate export file
        export_result = await self._generate_export_file(
            processed_data, 
            config, 
            "equipment_data"
        )
        
        return export_result
    
    async def export_telemetry_data(
        self, 
        config: ExportConfig
    ) -> ExportResult:
        """
        Export telemetry data in the specified format.
        This will enable real-time data integration with any system.
        """
        logger.info(f"Exporting telemetry data in {config.format.value} format")
        
        # Get telemetry data
        telemetry_data = await self._get_telemetry_data(config)
        
        # Process and format data
        processed_data = await self._process_telemetry_data(telemetry_data, config)
        
        # Generate export file
        export_result = await self._generate_export_file(
            processed_data, 
            config, 
            "telemetry_data"
        )
        
        return export_result
    
    async def export_maintenance_records(
        self, 
        config: ExportConfig
    ) -> ExportResult:
        """
        Export maintenance records in the specified format.
        This will streamline maintenance data sharing and analysis.
        """
        logger.info(f"Exporting maintenance records in {config.format.value} format")
        
        # Get maintenance data
        maintenance_data = await self._get_maintenance_data(config)
        
        # Process and format data
        processed_data = await self._process_maintenance_data(maintenance_data, config)
        
        # Generate export file
        export_result = await self._generate_export_file(
            processed_data, 
            config, 
            "maintenance_records"
        )
        
        return export_result
    
    async def export_cost_analysis(
        self, 
        config: ExportConfig
    ) -> ExportResult:
        """
        Export cost analysis data in the specified format.
        This will enable financial data integration and analysis.
        """
        logger.info(f"Exporting cost analysis in {config.format.value} format")
        
        # Get cost data
        cost_data = await self._get_cost_data(config)
        
        # Process and format data
        processed_data = await self._process_cost_data(cost_data, config)
        
        # Generate export file
        export_result = await self._generate_export_file(
            processed_data, 
            config, 
            "cost_analysis"
        )
        
        return export_result
    
    async def export_safety_incidents(
        self, 
        config: ExportConfig
    ) -> ExportResult:
        """
        Export safety incident data in the specified format.
        This will enable safety data sharing and compliance reporting.
        """
        logger.info(f"Exporting safety incidents in {config.format.value} format")
        
        # Get safety data
        safety_data = await self._get_safety_data(config)
        
        # Process and format data
        processed_data = await self._process_safety_data(safety_data, config)
        
        # Generate export file
        export_result = await self._generate_export_file(
            processed_data, 
            config, 
            "safety_incidents"
        )
        
        return export_result
    
    async def export_predictions(
        self, 
        config: ExportConfig
    ) -> ExportResult:
        """
        Export AI predictions in the specified format.
        This will enable prediction data integration with external systems.
        """
        logger.info(f"Exporting predictions in {config.format.value} format")
        
        # Get prediction data
        prediction_data = await self._get_prediction_data(config)
        
        # Process and format data
        processed_data = await self._process_prediction_data(prediction_data, config)
        
        # Generate export file
        export_result = await self._generate_export_file(
            processed_data, 
            config, 
            "predictions"
        )
        
        return export_result
    
    async def export_custom_query(
        self, 
        config: ExportConfig,
        query: str
    ) -> ExportResult:
        """
        Export custom query results in the specified format.
        This will enable unlimited data access and customization.
        """
        logger.info(f"Exporting custom query results in {config.format.value} format")
        
        # Execute custom query
        query_data = await self._execute_custom_query(query, config)
        
        # Process and format data
        processed_data = await self._process_custom_data(query_data, config)
        
        # Generate export file
        export_result = await self._generate_export_file(
            processed_data, 
            config, 
            "custom_query"
        )
        
        return export_result
    
    async def export_bulk_data(
        self, 
        export_configs: List[ExportConfig]
    ) -> ExportResult:
        """
        Export multiple data types in a single operation.
        This will revolutionize bulk data operations.
        """
        logger.info(f"Exporting bulk data with {len(export_configs)} configurations")
        
        # Create export tasks
        tasks = []
        for config in export_configs:
            if config.export_type == ExportType.EQUIPMENT_DATA:
                tasks.append(self.export_equipment_data(config))
            elif config.export_type == ExportType.TELEMETRY_DATA:
                tasks.append(self.export_telemetry_data(config))
            elif config.export_type == ExportType.MAINTENANCE_RECORDS:
                tasks.append(self.export_maintenance_records(config))
            elif config.export_type == ExportType.COST_ANALYSIS:
                tasks.append(self.export_cost_analysis(config))
            elif config.export_type == ExportType.SAFETY_INCIDENTS:
                tasks.append(self.export_safety_incidents(config))
            elif config.export_type == ExportType.PREDICTIONS:
                tasks.append(self.export_predictions(config))
        
        # Execute all exports
        export_results = await asyncio.gather(*tasks)
        
        # Create combined export
        combined_result = await self._create_combined_export(export_results)
        
        return combined_result
    
    # Data retrieval methods
    async def _get_equipment_data(self, config: ExportConfig) -> List[Dict[str, Any]]:
        """Get equipment data based on configuration."""
        query = self.db.query(Equipment)
        
        if config.equipment_ids:
            query = query.filter(Equipment.id.in_(config.equipment_ids))
        
        if config.filters:
            for field, value in config.filters.items():
                if hasattr(Equipment, field):
                    query = query.filter(getattr(Equipment, field) == value)
        
        if config.limit:
            query = query.limit(config.limit)
        
        if config.offset:
            query = query.offset(config.offset)
        
        equipment = query.all()
        
        return [
            {
                "id": eq.id,
                "name": eq.name,
                "type": eq.type,
                "status": eq.status,
                "location": eq.location,
                "manufacturer": eq.manufacturer,
                "model": eq.model,
                "serial_number": eq.serial_number,
                "purchase_date": eq.purchase_date.isoformat() if eq.purchase_date else None,
                "last_maintenance": eq.last_maintenance.isoformat() if eq.last_maintenance else None,
                "next_maintenance": eq.next_maintenance.isoformat() if eq.next_maintenance else None,
                "operating_hours": eq.operating_hours,
                "efficiency_rating": eq.efficiency_rating,
                "cost_per_hour": eq.cost_per_hour,
                "fuel_consumption": eq.fuel_consumption,
                "created_at": eq.created_at.isoformat() if eq.created_at else None,
                "updated_at": eq.updated_at.isoformat() if eq.updated_at else None
            }
            for eq in equipment
        ]
    
    async def _get_telemetry_data(self, config: ExportConfig) -> List[Dict[str, Any]]:
        """Get telemetry data based on configuration."""
        # Mock telemetry data - in real implementation, this would query the telemetry database
        telemetry_data = []
        
        for i in range(100):  # Mock 100 records
            telemetry_data.append({
                "equipment_id": f"equipment-{i % 10:03d}",
                "timestamp": (datetime.now() - timedelta(hours=i)).isoformat(),
                "temperature": np.random.uniform(60, 100),
                "pressure": np.random.uniform(100, 150),
                "vibration": np.random.uniform(0.1, 2.0),
                "fuel_level": np.random.uniform(0, 100),
                "engine_hours": np.random.uniform(1000, 5000),
                "oil_pressure": np.random.uniform(30, 60),
                "coolant_temperature": np.random.uniform(80, 95),
                "battery_voltage": np.random.uniform(12, 14),
                "hydraulic_pressure": np.random.uniform(200, 300)
            })
        
        # Apply filters
        if config.equipment_ids:
            telemetry_data = [t for t in telemetry_data if t["equipment_id"] in config.equipment_ids]
        
        if config.start_date:
            telemetry_data = [t for t in telemetry_data if datetime.fromisoformat(t["timestamp"]) >= config.start_date]
        
        if config.end_date:
            telemetry_data = [t for t in telemetry_data if datetime.fromisoformat(t["timestamp"]) <= config.end_date]
        
        if config.limit:
            telemetry_data = telemetry_data[:config.limit]
        
        return telemetry_data
    
    async def _get_maintenance_data(self, config: ExportConfig) -> List[Dict[str, Any]]:
        """Get maintenance data based on configuration."""
        # Mock maintenance data
        maintenance_data = []
        
        for i in range(50):  # Mock 50 records
            maintenance_data.append({
                "id": f"maintenance-{i:03d}",
                "equipment_id": f"equipment-{i % 10:03d}",
                "maintenance_type": np.random.choice(["preventive", "predictive", "reactive", "emergency"]),
                "scheduled_date": (datetime.now() - timedelta(days=i)).isoformat(),
                "completed_date": (datetime.now() - timedelta(days=i-1)).isoformat(),
                "technician": f"Technician {i % 5 + 1}",
                "description": f"Maintenance work {i}",
                "parts_used": ["filter", "oil", "belt"],
                "labor_hours": np.random.uniform(2, 8),
                "total_cost": np.random.uniform(500, 5000),
                "status": np.random.choice(["completed", "in_progress", "scheduled"]),
                "notes": f"Maintenance notes {i}"
            })
        
        # Apply filters
        if config.equipment_ids:
            maintenance_data = [m for m in maintenance_data if m["equipment_id"] in config.equipment_ids]
        
        return maintenance_data
    
    async def _get_cost_data(self, config: ExportConfig) -> List[Dict[str, Any]]:
        """Get cost data based on configuration."""
        # Mock cost data
        cost_data = []
        
        for i in range(30):  # Mock 30 records
            cost_data.append({
                "equipment_id": f"equipment-{i % 10:03d}",
                "date": (datetime.now() - timedelta(days=i)).isoformat(),
                "maintenance_cost": np.random.uniform(1000, 3000),
                "fuel_cost": np.random.uniform(500, 1500),
                "labor_cost": np.random.uniform(800, 2500),
                "parts_cost": np.random.uniform(200, 1000),
                "total_cost": 0,  # Will be calculated
                "cost_category": np.random.choice(["operational", "maintenance", "fuel", "labor"]),
                "description": f"Cost entry {i}"
            })
        
        # Calculate total costs
        for cost in cost_data:
            cost["total_cost"] = (
                cost["maintenance_cost"] + 
                cost["fuel_cost"] + 
                cost["labor_cost"] + 
                cost["parts_cost"]
            )
        
        return cost_data
    
    async def _get_safety_data(self, config: ExportConfig) -> List[Dict[str, Any]]:
        """Get safety data based on configuration."""
        # Mock safety data
        safety_data = []
        
        for i in range(20):  # Mock 20 records
            safety_data.append({
                "id": f"safety-{i:03d}",
                "equipment_id": f"equipment-{i % 10:03d}",
                "incident_type": np.random.choice(["near_miss", "minor", "moderate", "major"]),
                "severity": np.random.choice(["low", "medium", "high", "critical"]),
                "date": (datetime.now() - timedelta(days=i)).isoformat(),
                "description": f"Safety incident {i}",
                "location": f"Location {i % 5 + 1}",
                "reported_by": f"Employee {i % 10 + 1}",
                "investigation_status": np.random.choice(["open", "investigating", "closed"]),
                "corrective_actions": ["training", "equipment_check", "procedure_update"],
                "resolved": np.random.choice([True, False])
            })
        
        return safety_data
    
    async def _get_prediction_data(self, config: ExportConfig) -> List[Dict[str, Any]]:
        """Get prediction data based on configuration."""
        # Mock prediction data
        prediction_data = []
        
        for i in range(25):  # Mock 25 records
            prediction_data.append({
                "equipment_id": f"equipment-{i % 10:03d}",
                "prediction_type": np.random.choice(["failure", "maintenance", "efficiency", "cost"]),
                "predicted_date": (datetime.now() + timedelta(days=np.random.randint(1, 30))).isoformat(),
                "probability": np.random.uniform(0.1, 0.95),
                "confidence": np.random.uniform(0.7, 0.95),
                "model_version": "v1.0",
                "created_at": datetime.now().isoformat(),
                "recommended_action": np.random.choice(["schedule_maintenance", "monitor_closely", "replace_parts", "investigate"]),
                "impact_level": np.random.choice(["low", "medium", "high", "critical"]),
                "estimated_cost": np.random.uniform(1000, 10000)
            })
        
        return prediction_data
    
    async def _execute_custom_query(self, query: str, config: ExportConfig) -> List[Dict[str, Any]]:
        """Execute custom SQL query."""
        try:
            result = self.db.execute(text(query))
            columns = result.keys()
            rows = result.fetchall()
            
            return [dict(zip(columns, row)) for row in rows]
        except Exception as e:
            logger.error(f"Custom query execution failed: {e}")
            return []
    
    # Data processing methods
    async def _process_equipment_data(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> List[Dict[str, Any]]:
        """Process equipment data for export."""
        processed_data = data.copy()
        
        # Apply custom field selection
        if config.custom_fields:
            processed_data = [
                {field: record.get(field) for field in config.custom_fields if field in record}
                for record in processed_data
            ]
        
        # Apply sorting
        if config.sorting:
            for field, direction in config.sorting.items():
                processed_data.sort(
                    key=lambda x: x.get(field, ""), 
                    reverse=(direction.lower() == "desc")
                )
        
        return processed_data
    
    async def _process_telemetry_data(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> List[Dict[str, Any]]:
        """Process telemetry data for export."""
        return await self._process_equipment_data(data, config)
    
    async def _process_maintenance_data(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> List[Dict[str, Any]]:
        """Process maintenance data for export."""
        return await self._process_equipment_data(data, config)
    
    async def _process_cost_data(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> List[Dict[str, Any]]:
        """Process cost data for export."""
        return await self._process_equipment_data(data, config)
    
    async def _process_safety_data(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> List[Dict[str, Any]]:
        """Process safety data for export."""
        return await self._process_equipment_data(data, config)
    
    async def _process_prediction_data(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> List[Dict[str, Any]]:
        """Process prediction data for export."""
        return await self._process_equipment_data(data, config)
    
    async def _process_custom_data(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> List[Dict[str, Any]]:
        """Process custom query data for export."""
        return await self._process_equipment_data(data, config)
    
    # Export file generation methods
    async def _generate_export_file(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig,
        data_type: str
    ) -> ExportResult:
        """Generate export file in the specified format."""
        export_id = f"{data_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        filename = f"{export_id}.{config.format.value}"
        
        if config.format == ExportFormat.CSV:
            file_content = await self._generate_csv(data, config)
        elif config.format == ExportFormat.EXCEL:
            file_content = await self._generate_excel(data, config)
        elif config.format == ExportFormat.JSON:
            file_content = await self._generate_json(data, config)
        elif config.format == ExportFormat.XML:
            file_content = await self._generate_xml(data, config)
        elif config.format == ExportFormat.PDF:
            file_content = await self._generate_pdf(data, config)
        elif config.format == ExportFormat.PARQUET:
            file_content = await self._generate_parquet(data, config)
        elif config.format == ExportFormat.SQL:
            file_content = await self._generate_sql(data, config)
        else:
            raise ValueError(f"Unsupported export format: {config.format}")
        
        # Apply compression if requested
        if config.compression:
            file_content = await self._compress_data(file_content, filename)
            filename = f"{filename}.zip"
        
        # Apply encryption if requested
        if config.encryption:
            file_content = await self._encrypt_data(file_content)
            filename = f"{filename}.enc"
        
        return ExportResult(
            export_id=export_id,
            filename=filename,
            format=config.format,
            size_bytes=len(file_content),
            record_count=len(data),
            created_at=datetime.now(),
            file_content=file_content,
            metadata={
                "data_type": data_type,
                "export_config": {
                    "include_metadata": config.include_metadata,
                    "compression": config.compression,
                    "encryption": config.encryption
                }
            }
        )
    
    async def _generate_csv(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> bytes:
        """Generate CSV file."""
        if not data:
            return b""
        
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)
        
        return output.getvalue().encode('utf-8')
    
    async def _generate_excel(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> bytes:
        """Generate Excel file."""
        if not data:
            return b""
        
        df = pd.DataFrame(data)
        
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Data', index=False)
            
            if config.include_metadata:
                metadata_df = pd.DataFrame([{
                    "Export Date": datetime.now().isoformat(),
                    "Record Count": len(data),
                    "Format": "Excel",
                    "Generated By": "Mining PDM System"
                }])
                metadata_df.to_excel(writer, sheet_name='Metadata', index=False)
        
        return output.getvalue()
    
    async def _generate_json(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> bytes:
        """Generate JSON file."""
        export_data = {
            "data": data,
            "metadata": {
                "export_date": datetime.now().isoformat(),
                "record_count": len(data),
                "format": "JSON",
                "generated_by": "Mining PDM System"
            } if config.include_metadata else None
        }
        
        return json.dumps(export_data, indent=2, default=str).encode('utf-8')
    
    async def _generate_xml(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> bytes:
        """Generate XML file."""
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n<export>\n'
        
        if config.include_metadata:
            xml_content += f'  <metadata>\n'
            xml_content += f'    <export_date>{datetime.now().isoformat()}</export_date>\n'
            xml_content += f'    <record_count>{len(data)}</record_count>\n'
            xml_content += f'    <format>XML</format>\n'
            xml_content += f'    <generated_by>Mining PDM System</generated_by>\n'
            xml_content += f'  </metadata>\n'
        
        xml_content += '  <records>\n'
        for record in data:
            xml_content += '    <record>\n'
            for key, value in record.items():
                xml_content += f'      <{key}>{value}</{key}>\n'
            xml_content += '    </record>\n'
        xml_content += '  </records>\n'
        xml_content += '</export>'
        
        return xml_content.encode('utf-8')
    
    async def _generate_pdf(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> bytes:
        """Generate PDF file."""
        # Mock PDF generation - in real implementation, use reportlab or similar
        pdf_content = f"""
        Mining PDM System Export Report
        Generated: {datetime.now().isoformat()}
        Record Count: {len(data)}
        
        Data:
        {json.dumps(data, indent=2, default=str)}
        """
        
        return pdf_content.encode('utf-8')
    
    async def _generate_parquet(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> bytes:
        """Generate Parquet file."""
        if not data:
            return b""
        
        df = pd.DataFrame(data)
        
        output = io.BytesIO()
        df.to_parquet(output, index=False)
        
        return output.getvalue()
    
    async def _generate_sql(
        self, 
        data: List[Dict[str, Any]], 
        config: ExportConfig
    ) -> bytes:
        """Generate SQL file."""
        if not data:
            return b""
        
        sql_content = "-- Mining PDM System Export\n"
        sql_content += f"-- Generated: {datetime.now().isoformat()}\n"
        sql_content += f"-- Record Count: {len(data)}\n\n"
        
        # Create table structure
        table_name = "exported_data"
        columns = list(data[0].keys())
        
        sql_content += f"CREATE TABLE IF NOT EXISTS {table_name} (\n"
        for i, column in enumerate(columns):
            sql_content += f"  {column} TEXT"
            if i < len(columns) - 1:
                sql_content += ","
            sql_content += "\n"
        sql_content += ");\n\n"
        
        # Insert data
        for record in data:
            values = [f"'{str(value).replace("'", "''")}'" for value in record.values()]
            sql_content += f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)});\n"
        
        return sql_content.encode('utf-8')
    
    async def _compress_data(self, data: bytes, filename: str) -> bytes:
        """Compress data using ZIP."""
        output = io.BytesIO()
        
        with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            zip_file.writestr(filename, data)
        
        return output.getvalue()
    
    async def _encrypt_data(self, data: bytes) -> bytes:
        """Encrypt data using base64 encoding (mock implementation)."""
        # In real implementation, use proper encryption like AES
        return base64.b64encode(data)
    
    async def _create_combined_export(
        self, 
        export_results: List[ExportResult]
    ) -> ExportResult:
        """Create combined export from multiple export results."""
        combined_id = f"bulk_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        combined_filename = f"{combined_id}.zip"
        
        # Create ZIP file with all exports
        output = io.BytesIO()
        with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for result in export_results:
                if result.file_content:
                    zip_file.writestr(result.filename, result.file_content)
        
        combined_content = output.getvalue()
        
        return ExportResult(
            export_id=combined_id,
            filename=combined_filename,
            format=ExportFormat.CSV,  # Default format for combined export
            size_bytes=len(combined_content),
            record_count=sum(result.record_count for result in export_results),
            created_at=datetime.now(),
            file_content=combined_content,
            metadata={
                "export_count": len(export_results),
                "individual_exports": [
                    {
                        "export_id": result.export_id,
                        "filename": result.filename,
                        "format": result.format.value,
                        "record_count": result.record_count
                    }
                    for result in export_results
                ]
            }
        )
