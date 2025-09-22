"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

export interface TelemetryData {
  machine_id: string
  timestamp: string
  vibration_g: number
  temperature_c: number
  pressure_kpa: number
  rpm: number
  runtime_hours: number
  fuel_level: number
  status: string
  location: {
    x: number
    y: number
    z: number
  }
}

export interface Alert {
  id: string
  machine_id: string
  type: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
}

export interface WebSocketMessage {
  type: 'initial_data' | 'telemetry_update' | 'pong'
  timestamp: string
  machines?: any[]
  telemetry?: TelemetryData[]
  alerts?: Alert[]
}

export interface UseWebSocketReturn {
  isConnected: boolean
  telemetryData: TelemetryData[]
  alerts: Alert[]
  machines: any[]
  lastUpdate: string | null
  error: string | null
  sendMessage: (message: any) => void
  reconnect: () => void
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [machines, setMachines] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url)
      
      ws.current.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        
        // Send ping to keep connection alive
        const pingInterval = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'ping' }))
          } else {
            clearInterval(pingInterval)
          }
        }, 30000) // Ping every 30 seconds
      }
      
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          
          switch (message.type) {
            case 'initial_data':
              if (message.machines) {
                setMachines(message.machines)
              }
              break
              
            case 'telemetry_update':
              if (message.telemetry) {
                setTelemetryData(message.telemetry)
                setLastUpdate(message.timestamp)
              }
              if (message.alerts) {
                setAlerts(prev => {
                  // Add new alerts and keep only last 100
                  const newAlerts = [...message.alerts!, ...prev]
                  return newAlerts.slice(0, 100)
                })
              }
              break
              
            case 'pong':
              // Connection is alive
              break
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
          setError('Failed to parse message')
        }
      }
      
      ws.current.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect (${reconnectAttempts.current}/${maxReconnectAttempts})`)
            connect()
          }, delay)
        } else {
          setError('Failed to reconnect after multiple attempts')
        }
      }
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('WebSocket connection error')
      }
      
    } catch (err) {
      console.error('Error creating WebSocket:', err)
      setError('Failed to create WebSocket connection')
    }
  }, [url])

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }, [])

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    reconnectAttempts.current = 0
    if (ws.current) {
      ws.current.close()
    }
    connect()
  }, [connect])

  useEffect(() => {
    connect()
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [connect])

  return {
    isConnected,
    telemetryData,
    alerts,
    machines,
    lastUpdate,
    error,
    sendMessage,
    reconnect
  }
}
