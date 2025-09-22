"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Thermometer, 
  Gauge, 
  Zap, 
  MapPin, 
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useRealtime } from '@/contexts/realtime-context'
import { cn } from '@/lib/utils'

export function RealtimeTelemetry() {
  const { 
    isConnected, 
    telemetryData, 
    lastUpdate, 
    error,
    getLatestAlerts 
  } = useRealtime()

  const latestAlerts = getLatestAlerts(5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'idle': return 'bg-yellow-500'
      case 'maintenance': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Running'
      case 'idle': return 'Idle'
      case 'maintenance': return 'Maintenance'
      default: return 'Unknown'
    }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Real-Time Status</CardTitle>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Disconnected</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Connection Error</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}
          
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                Last update: {new Date(lastUpdate).toLocaleTimeString()}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipment Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {telemetryData.map((data, index) => (
          <motion.div
            key={data.machine_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    {data.machine_id.replace('-', ' ').toUpperCase()}
                  </CardTitle>
                  <Badge 
                    className={cn(
                      "text-white text-xs",
                      getStatusColor(data.status)
                    )}
                  >
                    {getStatusText(data.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="text-sm font-medium">{data.temperature_c}°C</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">Vibration</p>
                      <p className="text-sm font-medium">{data.vibration_g}g</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">RPM</p>
                      <p className="text-sm font-medium">{data.rpm}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-xs text-gray-500">Fuel</p>
                      <p className="text-sm font-medium">{data.fuel_level}%</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium">
                      ({data.location.x}, {data.location.y}, {data.location.z})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Alerts */}
      {latestAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span>Recent Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "p-3 rounded-lg border",
                    getAlertSeverityColor(alert.severity)
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {alert.machine_id} • {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        alert.severity === 'critical' ? 'border-red-300 text-red-700' :
                        alert.severity === 'warning' ? 'border-yellow-300 text-yellow-700' :
                        'border-blue-300 text-blue-700'
                      )}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
