"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  Fuel,
  Wrench,
  Clock,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface CostMetrics {
  total_operational_cost: number
  fuel_cost: number
  maintenance_cost: number
  labor_cost: number
  cost_per_hour: number
  cost_per_ton: number
  efficiency_savings: number
  roi_percentage: number
}

export function CostAnalysisDashboard() {
  const [costMetrics, setCostMetrics] = useState<CostMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const generateCostMetrics = () => {
      // Generate realistic synthetic cost data
      const baseCosts = {
        total_operational_cost: 125000 + Math.random() * 25000,
        fuel_cost: 45000 + Math.random() * 10000,
        maintenance_cost: 35000 + Math.random() * 8000,
        labor_cost: 45000 + Math.random() * 12000,
        cost_per_hour: 125 + Math.random() * 25,
        cost_per_ton: 8.5 + Math.random() * 2,
        efficiency_savings: 15000 + Math.random() * 5000,
        roi_percentage: 15 + Math.random() * 10
      }
      
      setCostMetrics(baseCosts)
      setIsLoading(false)
    }

    generateCostMetrics()
    
    // Update every 60 seconds
    const interval = setInterval(generateCostMetrics, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getROIColor = (roi: number) => {
    if (roi >= 20) return 'text-green-600'
    if (roi >= 15) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="bg-white border border-gray-200">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cost Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Operational Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(costMetrics?.total_operational_cost || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Monthly</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cost Per Hour</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(costMetrics?.cost_per_hour || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Operational efficiency</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cost Per Ton</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(costMetrics?.cost_per_ton || 0)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Production efficiency</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", getROIColor(costMetrics?.roi_percentage || 0))}>
                {Math.round(costMetrics?.roi_percentage || 0)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Return on investment</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              <span>Cost Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Fuel className="w-5 h-5 text-orange-500" />
                  <span className="font-medium text-gray-900">Fuel Costs</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {formatCurrency(costMetrics?.fuel_cost || 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(((costMetrics?.fuel_cost || 0) / (costMetrics?.total_operational_cost || 1)) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Wrench className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-900">Maintenance</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {formatCurrency(costMetrics?.maintenance_cost || 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(((costMetrics?.maintenance_cost || 0) / (costMetrics?.total_operational_cost || 1)) * 100)}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-900">Labor</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {formatCurrency(costMetrics?.labor_cost || 0)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round(((costMetrics?.labor_cost || 0) / (costMetrics?.total_operational_cost || 1)) * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Efficiency Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">Efficiency Savings</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Positive
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(costMetrics?.efficiency_savings || 0)}
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Monthly savings from optimization
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-900">Cost Optimization</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <Target className="w-3 h-3 mr-1" />
                    Target
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.round((costMetrics?.efficiency_savings || 0) / (costMetrics?.total_operational_cost || 1) * 100)}%
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Percentage of total costs saved
                </p>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-purple-900">Performance Index</span>
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Calculator className="w-3 h-3 mr-1" />
                    Calculated
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-purple-900">
                  {Math.round((costMetrics?.roi_percentage || 0) * 0.8 + 20)}
                </div>
                <p className="text-sm text-purple-700 mt-1">
                  Overall performance score
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span>Cost Optimization Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Fuel className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-gray-900">Fuel Optimization</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Implement predictive maintenance to reduce fuel consumption
              </p>
              <div className="text-sm font-medium text-green-600">
                Potential savings: {formatCurrency(5000)}
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Wrench className="w-4 h-4 text-red-500" />
                <span className="font-medium text-gray-900">Maintenance Scheduling</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Optimize maintenance schedules to reduce downtime
              </p>
              <div className="text-sm font-medium text-green-600">
                Potential savings: {formatCurrency(8000)}
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-900">Operational Efficiency</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Improve equipment utilization and reduce idle time
              </p>
              <div className="text-sm font-medium text-green-600">
                Potential savings: {formatCurrency(12000)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
