"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  BarChart3,
  Calendar,
  Download,
  MapPin
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataProvider, useData } from "@/contexts/data-context"

const utilizationData = [
  { period: "Today", active: 24, idle: 3, maintenance: 2, utilization: 82.8 },
  { period: "This Week", active: 168, idle: 21, maintenance: 14, utilization: 82.8 },
  { period: "This Month", active: 720, idle: 90, maintenance: 60, utilization: 82.8 },
  { period: "This Year", active: 8640, idle: 1080, maintenance: 720, utilization: 82.8 }
]

const fleetStatus = [
  { equipment: "Truck-001", type: "Haul Truck", status: "active", location: "Pit A", hours: 8.5, efficiency: 94.2 },
  { equipment: "Truck-002", type: "Haul Truck", status: "maintenance", location: "Service Bay", hours: 0, efficiency: 0 },
  { equipment: "Truck-003", type: "Haul Truck", status: "active", location: "Pit B", hours: 7.2, efficiency: 87.5 },
  { equipment: "Excavator-001", type: "Excavator", status: "active", location: "Pit A", hours: 9.1, efficiency: 96.8 },
  { equipment: "Excavator-002", type: "Excavator", status: "idle", location: "Pit C", hours: 2.3, efficiency: 45.2 },
  { equipment: "Drill-001", type: "Drill Rig", status: "active", location: "Pit B", hours: 8.8, efficiency: 92.1 },
  { equipment: "Truck-004", type: "Haul Truck", status: "active", location: "Pit A", hours: 6.7, efficiency: 78.9 },
  { equipment: "Truck-005", type: "Haul Truck", status: "active", location: "Pit C", hours: 9.3, efficiency: 98.5 }
]

function UtilizationContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today")
  const currentData = utilizationData.find(d => d.period === selectedPeriod) || utilizationData[0]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "idle":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600"
    if (efficiency >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Fleet Utilization</h1>
        <p className="text-gray-600">
          Monitor fleet status, utilization rates, and equipment efficiency across your mining operations
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">View Period:</span>
        <div className="flex space-x-2">
          {utilizationData.map((period) => (
            <Button
              key={period.period}
              variant={selectedPeriod === period.period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.period)}
            >
              {period.period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Equipment</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {currentData.active}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +2 from last period
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Idle Equipment</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {currentData.idle}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                -1 from last period
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Maintenance</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {currentData.maintenance}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +1 from last period
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Utilization Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {currentData.utilization}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +3.2% from last period
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Utilization Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Fleet Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{currentData.active}</div>
                    <div className="text-xs text-gray-500">
                      {((currentData.active / (currentData.active + currentData.idle + currentData.maintenance)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm font-medium text-gray-700">Idle</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{currentData.idle}</div>
                    <div className="text-xs text-gray-500">
                      {((currentData.idle / (currentData.active + currentData.idle + currentData.maintenance)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-medium text-gray-700">Maintenance</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{currentData.maintenance}</div>
                    <div className="text-xs text-gray-500">
                      {((currentData.maintenance / (currentData.active + currentData.idle + currentData.maintenance)) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Utilization Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Utilization trend chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Fleet Status Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Fleet Status Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fleetStatus.map((equipment, index) => (
                <div key={equipment.equipment} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{equipment.equipment}</div>
                      <div className="text-sm text-gray-500">{equipment.type}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{equipment.location}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {equipment.hours}h
                      </div>
                      <div className="text-xs text-gray-500">Hours today</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold ${getEfficiencyColor(equipment.efficiency)}`}>
                        {equipment.efficiency}%
                      </div>
                      <div className="text-xs text-gray-500">Efficiency</div>
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
          <Calendar className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Data</span>
        </Button>
      </div>
    </div>
  )
}

export default function UtilizationPage() {
  return (
    <DataProvider>
      <UtilizationContent />
    </DataProvider>
  )
}
