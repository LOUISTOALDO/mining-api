"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  BarChart3,
  Calendar,
  Download,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataProvider, useData } from "@/contexts/data-context"

const productionData = [
  { period: "Today", actual: 2847, target: 3000, efficiency: 94.9, trend: "+5.2%" },
  { period: "This Week", actual: 19929, target: 21000, efficiency: 94.9, trend: "+3.8%" },
  { period: "This Month", actual: 85476, target: 90000, efficiency: 94.9, trend: "+2.1%" },
  { period: "This Year", actual: 1025712, target: 1080000, efficiency: 94.9, trend: "+1.5%" }
]

const equipmentPerformance = [
  { equipment: "Truck-001", type: "Haul Truck", production: 45.2, target: 50, efficiency: 90.4, status: "active" },
  { equipment: "Truck-002", type: "Haul Truck", production: 0, target: 50, efficiency: 0, status: "maintenance" },
  { equipment: "Excavator-001", type: "Excavator", production: 38.7, target: 40, efficiency: 96.8, status: "active" },
  { equipment: "Drill-001", type: "Drill Rig", production: 52.1, target: 55, efficiency: 94.7, status: "active" },
  { equipment: "Truck-003", type: "Haul Truck", production: 42.8, target: 50, efficiency: 85.6, status: "active" }
]

function ProductionContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today")
  const currentData = productionData.find(d => d.period === selectedPeriod) || productionData[0]

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-600"
    if (efficiency >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "maintenance":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Production Performance</h1>
        <p className="text-gray-600">
          Monitor production targets, efficiency metrics, and equipment performance
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">View Period:</span>
        <div className="flex space-x-2">
          {productionData.map((period) => (
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
              <CardTitle className="text-sm font-medium text-gray-600">Actual Production</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {currentData.actual.toLocaleString()} tons
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                {currentData.trend} from last period
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
              <CardTitle className="text-sm font-medium text-gray-600">Production Target</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {currentData.target.toLocaleString()} tons
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Target for {selectedPeriod.toLowerCase()}
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
              <CardTitle className="text-sm font-medium text-gray-600">Efficiency</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getEfficiencyColor(currentData.efficiency)}`}>
                {currentData.efficiency}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +1.2% from last period
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
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Cycle Time</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                12.4 min
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                -0.8 min from last period
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Production Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Production Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Target Progress</span>
                <span className="text-sm font-semibold text-gray-900">
                  {currentData.actual.toLocaleString()} / {currentData.target.toLocaleString()} tons
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentData.actual / currentData.target) * 100}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {((currentData.actual / currentData.target) * 100).toFixed(1)}% of target achieved
                </span>
                <span className="text-gray-500">
                  {(currentData.target - currentData.actual).toLocaleString()} tons remaining
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Equipment Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Equipment Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equipmentPerformance.map((equipment, index) => (
                <div key={equipment.equipment} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{equipment.equipment}</div>
                      <div className="text-sm text-gray-500">{equipment.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {equipment.production} tons/hr
                      </div>
                      <div className="text-xs text-gray-500">Target: {equipment.target} tons/hr</div>
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

export default function ProductionPage() {
  return (
    <DataProvider>
      <ProductionContent />
    </DataProvider>
  )
}
