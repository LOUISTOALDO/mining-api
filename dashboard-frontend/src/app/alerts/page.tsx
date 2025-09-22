"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  Clock,
  DollarSign,
  TrendingDown,
  Users,
  Filter,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataProvider, useData } from "@/contexts/data-context"

const alerts = [
  {
    id: 1,
    title: "Critical Equipment Failure",
    message: "Truck-002 hydraulic system failure - immediate attention required",
    severity: "critical",
    category: "failure",
    equipment: "Truck-002",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    impact: "Equipment down - maintenance required",
    status: "open"
  },
  {
    id: 2,
    title: "Predictive Maintenance Alert",
    message: "Drill-001 bearing wear detected - schedule maintenance within 48 hours",
    severity: "high",
    category: "maintenance",
    equipment: "Drill-001",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    impact: "Risk of bearing failure",
    status: "open"
  },
  {
    id: 3,
    title: "Scheduled Maintenance Overdue",
    message: "Excavator-001 scheduled maintenance overdue by 2 days",
    severity: "medium",
    category: "maintenance",
    equipment: "Excavator-001",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    impact: "Risk of equipment failure",
    status: "open"
  },
  {
    id: 4,
    title: "Performance Degradation",
    message: "Truck-003 engine efficiency decreased by 15%",
    severity: "medium",
    category: "performance",
    equipment: "Truck-003",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    impact: "Reduced efficiency",
    status: "open"
  },
  {
    id: 5,
    title: "Sensor Anomaly",
    message: "Temperature sensor reading outside normal range",
    severity: "low",
    category: "sensor",
    equipment: "Truck-001",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    impact: "Sensor calibration needed",
    status: "resolved"
  }
]

function AlertsContent() {
  const [filter, setFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "high":
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case "medium":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "low":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter !== "all" && alert.category !== filter) return false
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false
    return true
  })

  const criticalAlerts = alerts.filter(alert => alert.severity === "critical" && alert.status === "open")
  const openAlerts = alerts.filter(alert => alert.status === "open")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Maintenance Alerts</h1>
        <p className="text-gray-600">
          Monitor equipment health alerts, maintenance requirements, and predictive failure warnings
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {criticalAlerts.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Immediate attention required
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
              <CardTitle className="text-sm font-medium text-gray-600">Open Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {openAlerts.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Pending resolution
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
              <CardTitle className="text-sm font-medium text-gray-600">Daily Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                $23,500
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingDown className="inline w-3 h-3 mr-1" />
                Revenue at risk
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
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Resolution</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                4.2h
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingDown className="inline w-3 h-3 mr-1" />
                -0.8h from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
        </div>
        <div className="flex space-x-2">
          {["all", "failure", "maintenance", "performance", "sensor"].map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2 ml-4">
          {["all", "critical", "high", "medium", "low"].map((severity) => (
            <Button
              key={severity}
              variant={severityFilter === severity ? "default" : "outline"}
              size="sm"
              onClick={() => setSeverityFilter(severity)}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Equipment: {alert.equipment}</span>
                        <span>Category: {alert.category}</span>
                        <span>Impact: {alert.impact}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Export Filtered</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download All</span>
        </Button>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  return (
    <DataProvider>
      <AlertsContent />
    </DataProvider>
  )
}
