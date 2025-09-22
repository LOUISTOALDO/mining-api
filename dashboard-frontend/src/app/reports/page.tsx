"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataProvider, useData } from "@/contexts/data-context"

const reportTypes = [
  {
    id: "production",
    title: "Production Report",
    description: "Daily, weekly, and monthly production metrics",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "maintenance",
    title: "Maintenance Report",
    description: "Equipment maintenance schedules and history",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "alerts",
    title: "Alerts Report",
    description: "System alerts and incident reports",
    icon: FileText,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "performance",
    title: "Performance Report",
    description: "Equipment performance and efficiency metrics",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500"
  }
]

function ReportsContent() {
  const { miningData, predictions, alerts } = useData()
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState("30d")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = async (reportType: string) => {
    setIsGenerating(true)
    setSelectedReport(reportType)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock report data
    const reportData = {
      production: {
        totalProduction: miningData.reduce((sum, item) => sum + item.production_rate, 0),
        averageHealth: miningData.reduce((sum, item) => sum + item.health_score, 0) / miningData.length,
        activeEquipment: miningData.filter(item => item.status === 'active').length
      },
      maintenance: {
        scheduledMaintenance: 8,
        completedMaintenance: 12,
        criticalAlerts: alerts.filter(alert => alert.severity === 'critical').length
      },
      alerts: {
        totalAlerts: alerts.length,
        resolvedAlerts: alerts.filter(alert => alert.status === 'resolved').length,
        criticalAlerts: alerts.filter(alert => alert.severity === 'critical').length
      },
      performance: {
        averageEfficiency: 87.5,
        fuelConsumption: miningData.reduce((sum, item) => sum + item.fuel_consumption, 0),
        temperatureAverage: miningData.reduce((sum, item) => sum + item.temperature, 0) / miningData.length
      }
    }

    // Create downloadable report
    const reportContent = generateReportContent(reportType, reportData[reportType as keyof typeof reportData])
    downloadReport(reportContent, reportType)
    
    setIsGenerating(false)
    setSelectedReport(null)
  }

  const generateReportContent = (type: string, data: any) => {
    const timestamp = new Date().toISOString()
    const dateRangeText = dateRange === "7d" ? "Last 7 days" : dateRange === "30d" ? "Last 30 days" : "Last 90 days"
    
    switch (type) {
      case "production":
        return `
Elysium Systems - Production Report
Generated: ${timestamp}
Period: ${dateRangeText}

PRODUCTION METRICS:
- Total Production: ${data.totalProduction.toFixed(1)} tons
- Average Equipment Health: ${(data.averageHealth * 100).toFixed(1)}%
- Active Equipment: ${data.activeEquipment} units

EQUIPMENT BREAKDOWN:
${miningData.map(item => `- ${item.equipment_id}: ${item.production_rate.toFixed(1)} tons/hr (${(item.health_score * 100).toFixed(1)}% health)`).join('\n')}
        `
      case "maintenance":
        return `
Elysium Systems - Maintenance Report
Generated: ${timestamp}
Period: ${dateRangeText}

MAINTENANCE SUMMARY:
- Scheduled Maintenance: ${data.scheduledMaintenance} items
- Completed Maintenance: ${data.completedMaintenance} items
- Critical Alerts: ${data.criticalAlerts} items

MAINTENANCE SCHEDULE:
${predictions.map(pred => `- ${pred.equipment_id}: ${pred.maintenance_risk} risk, ${pred.predicted_failure_date ? new Date(pred.predicted_failure_date).toLocaleDateString() : 'N/A'}`).join('\n')}
        `
      case "alerts":
        return `
Elysium Systems - Alerts Report
Generated: ${timestamp}
Period: ${dateRangeText}

ALERT SUMMARY:
- Total Alerts: ${data.totalAlerts}
- Resolved Alerts: ${data.resolvedAlerts}
- Critical Alerts: ${data.criticalAlerts}

ALERT DETAILS:
${alerts.map(alert => `- ${alert.equipment_id}: ${alert.message} (${alert.severity}, ${new Date(alert.timestamp).toLocaleDateString()})`).join('\n')}
        `
      case "performance":
        return `
Elysium Systems - Performance Report
Generated: ${timestamp}
Period: ${dateRangeText}

PERFORMANCE METRICS:
- Average Efficiency: ${data.averageEfficiency}%
- Total Fuel Consumption: ${data.fuelConsumption.toFixed(1)}L
- Average Temperature: ${data.temperatureAverage.toFixed(1)}°C

EQUIPMENT PERFORMANCE:
${miningData.map(item => `- ${item.equipment_id}: ${item.production_rate.toFixed(1)} tons/hr, ${item.fuel_consumption}L/hr, ${item.temperature.toFixed(1)}°C`).join('\n')}
        `
      default:
        return "Report content not available"
    }
  }

  const downloadReport = (content: string, type: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `elysium-${type}-report-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600">
          Generate comprehensive reports for your mining operations and export data for analysis.
        </p>
      </div>

      {/* Report Controls */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Date Range:</span>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full bg-white border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center`}>
                    <report.icon className="w-6 h-6 text-white" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateReport(report.id)}
                    disabled={isGenerating && selectedReport === report.id}
                    className="text-xs"
                  >
                    {isGenerating && selectedReport === report.id ? (
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3 mr-1" />
                    )}
                    Generate
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {report.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Reports */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Production Report - January 2024", date: "2024-01-15", size: "2.3 MB" },
              { name: "Maintenance Report - January 2024", date: "2024-01-14", size: "1.8 MB" },
              { name: "Performance Report - January 2024", date: "2024-01-13", size: "3.1 MB" },
              { name: "Alerts Report - January 2024", date: "2024-01-12", size: "0.9 MB" }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{report.name}</div>
                    <div className="text-sm text-gray-500">{report.date} • {report.size}</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <DataProvider>
      <ReportsContent />
    </DataProvider>
  )
}
