"""
ML Predictions router for real-time AI insights.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from loguru import logger

from ..ai.service import ai_service
from ..websocket.telemetry_server import telemetry_manager
from ..security import get_current_api_key

router = APIRouter(prefix="/ml", tags=["ml-predictions"])


@router.get("/predictions/real-time")
async def get_realtime_predictions(
    api_key: str = Depends(get_current_api_key)
) -> Dict[str, Any]:
    """
    Get real-time ML predictions for all machines.
    
    Returns:
        Dict containing predictions for all active machines
    """
    try:
        predictions = {}
        
        # Get current telemetry data for all machines
        for machine_id, machine_data in telemetry_manager.machine_data.items():
            # Extract features for ML prediction
            features = {
                'vibration_g': machine_data['base_values']['vibration_g'],
                'temperature_c': machine_data['base_values']['temperature_c'],
                'pressure_kpa': machine_data['base_values']['pressure_kpa'],
                'rpm': machine_data['base_values']['rpm'],
                'fuel_level': machine_data['base_values']['fuel_level'],
                'runtime_hours': machine_data['base_values']['runtime_hours']
            }
            
            # Get ML prediction
            prediction, confidence = ai_service.predict_maintenance(machine_id, features)
            
            # Calculate health score
            health_score = _calculate_health_score(features, machine_id)
            
            # Generate recommendations
            recommendations = _generate_recommendations(prediction, features, machine_id)
            
            predictions[machine_id] = {
                'machine_id': machine_id,
                'machine_name': machine_data['name'],
                'machine_type': machine_data['type'],
                'prediction': prediction,
                'confidence': confidence,
                'health_score': health_score,
                'recommendations': recommendations,
                'features': features,
                'status': machine_data['status']
            }
        
        logger.info(f"Generated predictions for {len(predictions)} machines")
        return {
            'predictions': predictions,
            'total_machines': len(predictions),
            'timestamp': machine_data.get('timestamp', 'unknown')
        }
        
    except Exception as e:
        logger.error(f"Error generating predictions: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate predictions: {str(e)}")


@router.get("/predictions/{machine_id}")
async def get_machine_prediction(
    machine_id: str,
    api_key: str = Depends(get_current_api_key)
) -> Dict[str, Any]:
    """
    Get ML prediction for a specific machine.
    
    Args:
        machine_id: Machine identifier
        
    Returns:
        Dict containing prediction details for the machine
    """
    try:
        if machine_id not in telemetry_manager.machine_data:
            raise HTTPException(status_code=404, detail=f"Machine {machine_id} not found")
        
        machine_data = telemetry_manager.machine_data[machine_id]
        
        # Extract features
        features = {
            'vibration_g': machine_data['base_values']['vibration_g'],
            'temperature_c': machine_data['base_values']['temperature_c'],
            'pressure_kpa': machine_data['base_values']['pressure_kpa'],
            'rpm': machine_data['base_values']['rpm'],
            'fuel_level': machine_data['base_values']['fuel_level'],
            'runtime_hours': machine_data['base_values']['runtime_hours']
        }
        
        # Get ML prediction
        prediction, confidence = ai_service.predict_maintenance(machine_id, features)
        
        # Calculate health score
        health_score = _calculate_health_score(features, machine_id)
        
        # Generate recommendations
        recommendations = _generate_recommendations(prediction, features, machine_id)
        
        return {
            'machine_id': machine_id,
            'machine_name': machine_data['name'],
            'machine_type': machine_data['type'],
            'prediction': prediction,
            'confidence': confidence,
            'health_score': health_score,
            'recommendations': recommendations,
            'features': features,
            'status': machine_data['status']
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating prediction for {machine_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate prediction: {str(e)}")


@router.get("/analytics/performance")
async def get_performance_analytics(
    api_key: str = Depends(get_current_api_key)
) -> Dict[str, Any]:
    """
    Get performance analytics across all machines.
    
    Returns:
        Dict containing performance metrics and insights
    """
    try:
        total_machines = len(telemetry_manager.machine_data)
        running_machines = sum(1 for m in telemetry_manager.machine_data.values() if m['status'] == 'running')
        idle_machines = sum(1 for m in telemetry_manager.machine_data.values() if m['status'] == 'idle')
        maintenance_machines = sum(1 for m in telemetry_manager.machine_data.values() if m['status'] == 'maintenance')
        
        # Calculate average metrics
        avg_vibration = sum(m['base_values']['vibration_g'] for m in telemetry_manager.machine_data.values()) / total_machines
        avg_temperature = sum(m['base_values']['temperature_c'] for m in telemetry_manager.machine_data.values()) / total_machines
        avg_fuel_level = sum(m['base_values']['fuel_level'] for m in telemetry_manager.machine_data.values()) / total_machines
        
        # Calculate efficiency score
        efficiency_score = (running_machines / total_machines) * 0.4 + (avg_fuel_level / 100) * 0.3 + (1 - min(avg_vibration / 3, 1)) * 0.3
        
        return {
            'total_machines': total_machines,
            'running_machines': running_machines,
            'idle_machines': idle_machines,
            'maintenance_machines': maintenance_machines,
            'efficiency_score': round(efficiency_score, 2),
            'average_metrics': {
                'vibration_g': round(avg_vibration, 2),
                'temperature_c': round(avg_temperature, 1),
                'fuel_level': round(avg_fuel_level, 1)
            },
            'utilization_rate': round((running_machines / total_machines) * 100, 1)
        }
        
    except Exception as e:
        logger.error(f"Error generating performance analytics: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics: {str(e)}")


def _calculate_health_score(features: Dict[str, float], machine_id: str) -> float:
    """Calculate health score based on features."""
    machine_type = machine_id.split('-')[0]
    
    # Base health score
    health_score = 1.0
    
    # Vibration impact
    if machine_type == 'crusher':
        vib_threshold = 3.0
    else:
        vib_threshold = 2.0
    
    if features['vibration_g'] > vib_threshold * 1.5:
        health_score -= 0.3
    elif features['vibration_g'] > vib_threshold:
        health_score -= 0.15
    
    # Temperature impact
    temp_threshold = 80.0
    if features['temperature_c'] > temp_threshold * 1.2:
        health_score -= 0.4
    elif features['temperature_c'] > temp_threshold:
        health_score -= 0.2
    
    # Fuel level impact
    if features['fuel_level'] < 20:
        health_score -= 0.1
    
    # Runtime impact
    if features['runtime_hours'] > 3000:
        health_score -= 0.2
    
    return max(0.0, min(1.0, health_score))


def _generate_recommendations(prediction: str, features: Dict[str, float], machine_id: str) -> List[str]:
    """Generate maintenance recommendations based on prediction and features."""
    recommendations = []
    
    if prediction == "critical_maintenance_required":
        recommendations.extend([
            "Schedule immediate maintenance",
            "Check all critical components",
            "Review operating procedures"
        ])
    elif prediction == "maintenance_urgent":
        recommendations.extend([
            "Schedule maintenance within 24 hours",
            "Monitor equipment closely",
            "Check vibration and temperature sensors"
        ])
    elif prediction == "maintenance_recommended":
        recommendations.extend([
            "Schedule maintenance within 1 week",
            "Continue monitoring",
            "Review maintenance history"
        ])
    
    # Feature-specific recommendations
    if features['vibration_g'] > 2.0:
        recommendations.append("Check bearing condition and alignment")
    
    if features['temperature_c'] > 80:
        recommendations.append("Inspect cooling system and lubrication")
    
    if features['fuel_level'] < 30:
        recommendations.append("Refuel equipment")
    
    if features['runtime_hours'] > 3000:
        recommendations.append("Perform scheduled maintenance")
    
    return recommendations[:5]  # Limit to 5 recommendations
