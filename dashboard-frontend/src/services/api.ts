// API service for connecting to ML model and mining data
export interface MiningData {
  timestamp: string
  equipment_id: string
  equipment_type: string
  status: 'active' | 'maintenance' | 'inactive'
  health_score: number
  production_rate: number
  fuel_consumption: number
  temperature: number
  vibration: number
  vibration_g: number  // Add this field for compatibility
  location: {
    lat: number
    lng: number
  }
}

export interface PredictionResult {
  equipment_id: string
  predicted_health: number
  maintenance_risk: 'low' | 'medium' | 'high'
  predicted_failure_date?: string
  recommended_actions: string[]
  confidence: number
}

export interface DashboardMetrics {
  active_trucks: number
  daily_production: number
  revenue: number
  equipment_health: number
  alerts_count: number
  maintenance_scheduled: number
}

export interface EquipmentAlert {
  id: string
  equipment_id: string
  type: 'maintenance' | 'failure' | 'performance'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  status: 'active' | 'resolved'
}

class MiningAPI {
  private baseUrl: string

  constructor() {
    // In production, this would be your actual API endpoint
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  }

  // Get real-time mining data
  async getMiningData(): Promise<MiningData[]> {
    try {
      // Simulate API call - replace with actual endpoint
      const response = await fetch(`${this.baseUrl}/api/mining-data`)
      if (!response.ok) {
        throw new Error('Failed to fetch mining data')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching mining data:', error)
      // Return mock data for development
      return this.getMockMiningData()
    }
  }

  // Get ML predictions
  async getPredictions(): Promise<PredictionResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/predictions`)
      if (!response.ok) {
        throw new Error('Failed to fetch predictions')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching predictions:', error)
      return this.getMockPredictions()
    }
  }

  // Get dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/metrics`)
      if (!response.ok) {
        throw new Error('Failed to fetch metrics')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching metrics:', error)
      return this.getMockMetrics()
    }
  }

  // Get equipment alerts
  async getAlerts(): Promise<EquipmentAlert[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/alerts`)
      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching alerts:', error)
      return this.getMockAlerts()
    }
  }

  // Send prediction request to ML model
  async predictEquipmentHealth(equipmentId: string): Promise<PredictionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ equipment_id: equipmentId }),
      })
      if (!response.ok) {
        throw new Error('Failed to get prediction')
      }
      return await response.json()
    } catch (error) {
      console.error('Error getting prediction:', error)
      return this.getMockPrediction(equipmentId)
    }
  }

  // Mock data for development
  private getMockMiningData(): MiningData[] {
    return [
      {
        timestamp: new Date().toISOString(),
        equipment_id: 'Truck-001',
        equipment_type: 'Haul Truck',
        status: 'active',
        health_score: 0.92,
        production_rate: 45.2,
        fuel_consumption: 12.5,
        temperature: 78.5,
        vibration: 2.1,
        vibration_g: 2.1,
        location: { lat: -23.5505, lng: -46.6333 }
      },
      {
        timestamp: new Date().toISOString(),
        equipment_id: 'Excavator-045',
        equipment_type: 'Excavator',
        status: 'maintenance',
        health_score: 0.65,
        production_rate: 0,
        fuel_consumption: 0,
        temperature: 45.2,
        vibration: 0.8,
        vibration_g: 0.8,
        location: { lat: -23.5515, lng: -46.6343 }
      },
      {
        timestamp: new Date().toISOString(),
        equipment_id: 'Truck-012',
        equipment_type: 'Haul Truck',
        status: 'active',
        health_score: 0.88,
        production_rate: 42.8,
        fuel_consumption: 11.9,
        temperature: 82.1,
        vibration: 2.3,
        vibration_g: 2.3,
        location: { lat: -23.5495, lng: -46.6323 }
      }
    ]
  }

  private getMockPredictions(): PredictionResult[] {
    return [
      {
        equipment_id: 'Truck-001',
        predicted_health: 0.89,
        maintenance_risk: 'low',
        predicted_failure_date: '2024-03-15',
        recommended_actions: ['Routine inspection', 'Oil change'],
        confidence: 0.87
      },
      {
        equipment_id: 'Excavator-045',
        predicted_health: 0.62,
        maintenance_risk: 'high',
        predicted_failure_date: '2024-02-20',
        recommended_actions: ['Hydraulic system check', 'Engine diagnostics', 'Immediate maintenance'],
        confidence: 0.92
      },
      {
        equipment_id: 'Truck-012',
        predicted_health: 0.85,
        maintenance_risk: 'medium',
        predicted_failure_date: '2024-04-10',
        recommended_actions: ['Brake system inspection', 'Tire rotation'],
        confidence: 0.79
      }
    ]
  }

  private getMockMetrics(): DashboardMetrics {
    return {
      active_trucks: 47,
      daily_production: 2847,
      revenue: 2400000,
      equipment_health: 94.2,
      alerts_count: 3,
      maintenance_scheduled: 8
    }
  }

  private getMockAlerts(): EquipmentAlert[] {
    return [
      {
        id: '1',
        equipment_id: 'Excavator-045',
        type: 'maintenance',
        severity: 'high',
        message: 'Hydraulic pressure below threshold',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: '2',
        equipment_id: 'Truck-023',
        type: 'performance',
        severity: 'medium',
        message: 'Fuel efficiency decreased by 15%',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: '3',
        equipment_id: 'Drill-008',
        type: 'failure',
        severity: 'critical',
        message: 'Engine temperature critical',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'resolved'
      }
    ]
  }

  private getMockPrediction(equipmentId: string): PredictionResult {
    return {
      equipment_id: equipmentId,
      predicted_health: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
      maintenance_risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      predicted_failure_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      recommended_actions: ['Routine inspection', 'Oil change', 'System diagnostics'],
      confidence: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
    }
  }
}

export const miningAPI = new MiningAPI()
