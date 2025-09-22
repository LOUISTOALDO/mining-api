"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Gauge, 
  Zap,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Filter,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataProvider, useData } from "@/contexts/data-context"

const performanceData = [
  {
    equipment: "Truck-001",
    type: "Haul Truck",
    efficiency: 94.2,
    availability: 96.8,
    reliability: 98.1,
    trend: "up",
    change: "+2.3%"
  },
  {
    equipment: "Truck-002",
    type: "Haul Truck",
    efficiency: 67.5,
    availability: 78.2,
    reliability: 82.4,
    trend: "down",
    change: "-5.1%"
  },
  {
    equipment: "Excavator-001",
    type: "Excavator",
    efficiency: 92.8,
    availability: 94.6,
    reliability: 96.3,
    trend: "up",
    change: "+1.8%"
  },
  {
    equipment: "Drill-001",
    type: "Drill Rig",
    efficiency: 45.2,
    availability: 62.1,
    reliability: 58.7,
    trend: "down",
    change: "-12.4%"
  }
]

const kpiData = [
  { name: "Overall Equipment Effectiveness", value: 87.3, target: 90, unit: "%", trend: "+2.1%" },
  { name: "Mean Time Between Failures", value: 245, target: 300, unit: "hours", trend: "+15h" },
  { name: "Mean Time To Repair", value: 4.2, target: 3.0, unit: "hours", trend: "-0.8h" },
  { name: "Availability Rate", value: 92.1, target: 95, unit: "%", trend: "+1.5%" }
]

const degradationTrends = [
  { equipment: "Truck-002", parameter: "Engine Temperature", trend: "increasing", rate: "0.5°C/day", severity: "high" },
  { equipment: "Drill-001", parameter: "Vibration Level", trend: "increasing", rate: "0.2 mm/s/day", severity: "critical" },
  { equipment: "Excavator-001", parameter: "Hydraulic Pressure", trend: "stable", rate: "0.0 bar/day", severity: "low" },
  { equipment: "Truck-001", parameter: "Fuel Efficiency", trend: "decreasing", rate: "-0.1%/day", severity: "medium" }
]

function AnalyticsContent() {
  const [selectedMetric, setSelectedMetric] = useState("efficiency")
  const [timeRange, setTimeRange] = useState("30d")

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return "text-green-600"
    if (value >= 75) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
        <p className="text-gray-600">
          Analyze equipment performance, efficiency trends, and degradation patterns
        </p>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{kpi.name}</CardTitle>
                <Gauge className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {kpi.value} {kpi.unit}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">Target: {kpi.target} {kpi.unit}</span>
                  <span className={`text-xs font-semibold ${kpi.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Equipment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((equipment, index) => (
                  <div key={equipment.equipment} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{equipment.equipment}</div>
                        <div className="text-sm text-gray-500">{equipment.type}</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-semibold ${getPerformanceColor(equipment.efficiency)}`}>
                          {equipment.efficiency}%
                        </div>
                        <div className="text-xs text-gray-500">Efficiency</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-semibold ${getPerformanceColor(equipment.availability)}`}>
                          {equipment.availability}%
                        </div>
                        <div className="text-xs text-gray-500">Availability</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-sm font-semibold ${getPerformanceColor(equipment.reliability)}`}>
                          {equipment.reliability}%
                        </div>
                        <div className="text-xs text-gray-500">Reliability</div>
                      </div>
                      <div className={`flex items-center space-x-1 ${getTrendColor(equipment.trend)}`}>
                        {getTrendIcon(equipment.trend)}
                        <span className="text-xs font-semibold">{equipment.change}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
              <CardTitle className="text-lg font-semibold">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Performance trend chart</p>
                  <p className="text-sm text-gray-400">Efficiency, Availability, Reliability</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Degradation Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Degradation Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {degradationTrends.map((trend, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{trend.equipment}</div>
                      <div className="text-sm text-gray-500">{trend.parameter}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{trend.trend}</div>
                      <div className="text-xs text-gray-500">Trend</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{trend.rate}</div>
                      <div className="text-xs text-gray-500">Rate</div>
                    </div>
                    <Badge className={getSeverityColor(trend.severity)}>
                      {trend.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Top Performers</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Truck-001</span>
                    <span className="text-sm font-semibold text-green-600">94.2% Efficiency</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Excavator-001</span>
                    <span className="text-sm font-semibold text-green-600">92.8% Efficiency</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Attention Required</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Drill-001</span>
                    <span className="text-sm font-semibold text-red-600">45.2% Efficiency</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">Truck-002</span>
                    <span className="text-sm font-semibold text-yellow-600">67.5% Efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Export Analysis</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </Button>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <DataProvider>
      <AnalyticsContent />
    </DataProvider>
  )
}
