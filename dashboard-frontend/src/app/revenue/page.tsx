"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  BarChart3,
  Calendar,
  Download
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataProvider, useData } from "@/contexts/data-context"

const revenueData = [
  { period: "Today", revenue: 847000, costs: 320000, profit: 527000, margin: 62.2 },
  { period: "This Week", revenue: 5929000, costs: 2240000, profit: 3689000, margin: 62.2 },
  { period: "This Month", revenue: 25430000, costs: 9600000, profit: 15830000, margin: 62.2 },
  { period: "This Year", revenue: 305160000, costs: 115200000, profit: 189960000, margin: 62.2 }
]

const costBreakdown = [
  { category: "Equipment Maintenance", amount: 450000, percentage: 14.1, color: "bg-red-500" },
  { category: "Fuel & Energy", amount: 380000, percentage: 11.9, color: "bg-orange-500" },
  { category: "Labor", amount: 280000, percentage: 8.8, color: "bg-blue-500" },
  { category: "Materials", amount: 220000, percentage: 6.9, color: "bg-green-500" },
  { category: "Other Operations", amount: 190000, percentage: 5.9, color: "bg-purple-500" }
]

function RevenueContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("Today")
  const currentData = revenueData.find(d => d.period === selectedPeriod) || revenueData[0]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Revenue & Costs</h1>
        <p className="text-gray-600">
          Track your mining operation's financial performance and cost breakdown
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">View Period:</span>
        <div className="flex space-x-2">
          {revenueData.map((period) => (
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(currentData.revenue)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12.5% from last period
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
              <CardTitle className="text-sm font-medium text-gray-600">Total Costs</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(currentData.costs)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +8.2% from last period
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
              <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(currentData.profit)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +15.3% from last period
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
              <CardTitle className="text-sm font-medium text-gray-600">Profit Margin</CardTitle>
              <PieChart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {currentData.margin}%
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +2.1% from last period
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdown.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
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
              <CardTitle className="text-lg font-semibold">Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Revenue trend chart will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

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

export default function RevenuePage() {
  return (
    <DataProvider>
      <RevenueContent />
    </DataProvider>
  )
}
