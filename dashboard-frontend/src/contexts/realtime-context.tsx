"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useWebSocket, TelemetryData, Alert } from '@/hooks/useWebSocket'

interface RealtimeContextType {
  isConnected: boolean
  telemetryData: TelemetryData[]
  alerts: Alert[]
  machines: any[]
  lastUpdate: string | null
  error: string | null
  sendMessage: (message: any) => void
  reconnect: () => void
  getMachineTelemetry: (machineId: string) => TelemetryData | undefined
  getMachineAlerts: (machineId: string) => Alert[]
  getLatestAlerts: (count?: number) => Alert[]
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

interface RealtimeProviderProps {
  children: ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  // Use mock data for now since WebSocket endpoint doesn't exist yet
  const mockTelemetryData: TelemetryData[] = [
    {
      machine_id: 'Truck-001',
      timestamp: new Date().toISOString(),
      vibration_g: 1.8,
      temperature_c: 75.2,
      pressure_kpa: 120.5,
      rpm: 1800,
      runtime_hours: 2450,
      fuel_level: 68.4,
      status: 'active',
      location: { x: 100, y: 200, z: 0 }
    }
  ]
  
  const mockAlerts: Alert[] = [
    {
      id: '1',
      machine_id: 'Truck-001',
      type: 'maintenance',
      severity: 'warning',
      message: 'Routine maintenance due',
      timestamp: new Date().toISOString()
    }
  ]
  
  const {
    isConnected,
    telemetryData: wsTelemetryData,
    alerts: wsAlerts,
    machines,
    lastUpdate,
    error,
    sendMessage,
    reconnect
  } = useWebSocket('ws://localhost:8000/ws/telemetry')
  
  // Use mock data if WebSocket is not connected
  const telemetryData = isConnected ? wsTelemetryData : mockTelemetryData
  const alerts = isConnected ? wsAlerts : mockAlerts

  const getMachineTelemetry = (machineId: string): TelemetryData | undefined => {
    return telemetryData.find(data => data.machine_id === machineId)
  }

  const getMachineAlerts = (machineId: string): Alert[] => {
    return alerts.filter(alert => alert.machine_id === machineId)
  }

  const getLatestAlerts = (count: number = 10): Alert[] => {
    return alerts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, count)
  }

  const value: RealtimeContextType = {
    isConnected,
    telemetryData,
    alerts,
    machines,
    lastUpdate,
    error,
    sendMessage,
    reconnect,
    getMachineTelemetry,
    getMachineAlerts,
    getLatestAlerts
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
