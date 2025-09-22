"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Activity, 
  Thermometer, 
  Gauge, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Filter,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataProvider, useData } from "@/contexts/data-context"

const equipmentData = [
  {
    id: "Truck-001",
    type: "Haul Truck",
    status: "healthy",
    healthScore: 94,
    temperature: 78,
    vibration: 2.3,
    pressure: 45,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    operatingHours: 2847,
    location: "Pit A"
  },
  {
    id: "Truck-002",
    type: "Haul Truck",
    status: "warning",
    healthScore: 67,
    temperature: 95,
    vibration: 4.8,
    pressure: 38,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-01-25",
    operatingHours: 3124,
    location: "Pit B"
  },
  {
    id: "Excavator-001",
    type: "Excavator",
    status: "healthy",
    healthScore: 92,
    temperature: 82,
    vibration: 1.9,
    pressure: 52,
    lastMaintenance: "2024-01-12",
    nextMaintenance: "2024-02-12",
    operatingHours: 2156,
    location: "Pit A"
  },
  {
    id: "Drill-001",
    type: "Drill Rig",
    status: "critical",
    healthScore: 45,
    temperature: 105,
    vibration: 7.2,
    pressure: 28,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-01-20",
    operatingHours: 3892,
    location: "Pit C"
  }
]

const sensorMetrics = [
  { name: "Temperature", value: 85, unit: "°C", threshold: 90, status: "normal" },
  { name: "Vibration", value: 3.2, unit: "mm/s", threshold: 5.0, status: "normal" },
  { name: "Pressure", value: 42, unit: "bar", threshold: 50, status: "normal" },
  { name: "Oil Level", value: 78, unit: "%", threshold: 20, status: "normal" },
  { name: "Fuel Efficiency", value: 87, unit: "%", threshold: 80, status: "good" }
]

function MonitoringContent() {
  const [selectedEquipment, setSelectedEquipment] = useState(equipmentData[0])
  const [timeRange, setTimeRange] = useState("24h")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMetricStatus = (value: number, threshold: number, type: string) => {
    if (type === "efficiency" || type === "level") {
      return value >= threshold ? "good" : "warning"
    }
    return value <= threshold ? "good" : "warning"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Equipment Monitoring</h1>
        <p className="text-gray-600">
          Real-time monitoring of equipment health, sensor data, and performance metrics
        </p>
      </div>

      {/* Equipment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {equipmentData.map((equipment, index) => (
          <motion.div
            key={equipment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className={`bg-white border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer ${
                selectedEquipment.id === equipment.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedEquipment(equipment)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{equipment.id}</CardTitle>
                <Badge className={getStatusColor(equipment.status)}>
                  {equipment.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-2">{equipment.type}</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Health Score</span>
                    <span className={`font-semibold ${getHealthColor(equipment.healthScore)}`}>
                      {equipment.healthScore}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Temperature</span>
                    <span className="font-semibold">{equipment.temperature}°C</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location</span>
                    <span className="font-semibold">{equipment.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Selected Equipment Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{selectedEquipment.id} Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span className="font-semibold">{selectedEquipment.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge className={getStatusColor(selectedEquipment.status)}>
                    {selectedEquipment.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Health Score</span>
                  <span className={`font-semibold ${getHealthColor(selectedEquipment.healthScore)}`}>
                    {selectedEquipment.healthScore}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Operating Hours</span>
                  <span className="font-semibold">{selectedEquipment.operatingHours.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-semibold">{selectedEquipment.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Maintenance</span>
                  <span className="font-semibold">{selectedEquipment.lastMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Maintenance</span>
                  <span className="font-semibold">{selectedEquipment.nextMaintenance}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sensor Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Sensor Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sensorMetrics.map((metric, index) => (
                  <div key={metric.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        getMetricStatus(metric.value, metric.threshold, metric.name.toLowerCase()) === 'good' 
                          ? 'bg-green-500' 
                          : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {metric.value} {metric.unit}
                      </div>
                      <div className="text-xs text-gray-500">Threshold: {metric.threshold}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-time Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Real-time Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Real-time sensor data chart</p>
                  <p className="text-sm text-gray-400">Temperature, Vibration, Pressure</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Maintenance Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipmentData.map((equipment, index) => (
                <div key={equipment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{equipment.id}</div>
                      <div className="text-sm text-gray-500">{equipment.type}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{equipment.nextMaintenance}</div>
                      <div className="text-xs text-gray-500">Next Maintenance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{equipment.operatingHours.toLocaleString()}h</div>
                      <div className="text-xs text-gray-500">Operating Hours</div>
                    </div>
                    <Badge className={getStatusColor(equipment.status)}>
                      {equipment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Export Data</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </Button>
      </div>
    </div>
  )
}

export default function MonitoringPage() {
  return (
    <DataProvider>
      <MonitoringContent />
    </DataProvider>
  )
}
