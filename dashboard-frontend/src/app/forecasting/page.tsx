"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  BarChart3,
  Calendar,
  Download,
  Zap,
  Target,
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataProvider, useData } from "@/contexts/data-context"

const predictions = [
  {
    equipment: "Truck-001",
    type: "Haul Truck",
    prediction: "Bearing Failure",
    confidence: 94,
    timeframe: "3-5 days",
    impact: "high",
    recommendation: "Replace front wheel bearings"
  },
  {
    equipment: "Excavator-002",
    type: "Excavator",
    prediction: "Hydraulic Pump Failure",
    confidence: 87,
    timeframe: "1-2 weeks",
    impact: "high",
    recommendation: "Schedule hydraulic system inspection"
  },
  {
    equipment: "Drill-001",
    type: "Drill Rig",
    prediction: "Optimal Performance",
    confidence: 92,
    timeframe: "Next 30 days",
    impact: "low",
    recommendation: "Continue current operations"
  },
  {
    equipment: "Truck-003",
    type: "Haul Truck",
    prediction: "Engine Overheating",
    confidence: 89,
    timeframe: "2-3 weeks",
    impact: "high",
    recommendation: "Check cooling system and replace thermostat"
  }
]

const productionForecast = [
  { period: "Next Week", predicted: 21000, actual: 19929, confidence: 92, trend: "+5.4%" },
  { period: "Next Month", predicted: 90000, actual: 85476, confidence: 88, trend: "+5.3%" },
  { period: "Next Quarter", predicted: 270000, actual: 256428, confidence: 85, trend: "+5.3%" },
  { period: "Next Year", predicted: 1080000, actual: 1025712, confidence: 82, trend: "+5.3%" }
]

function ForecastingContent() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Next Week")

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 80) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Failure Predictions</h1>
        <p className="text-gray-600">
          AI-powered predictions for equipment failures, maintenance needs, and performance degradation
        </p>
      </div>

      {/* AI Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">AI Model Status</h3>
                <p className="text-sm text-gray-600">
                  Random Forest Classifier is actively analyzing equipment data and generating predictions
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Zap className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Production Forecast */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Forecast Period:</span>
          <div className="flex space-x-2">
            {productionForecast.map((period) => (
              <Button
                key={period.period}
                variant={selectedTimeframe === period.period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(period.period)}
              >
                {period.period}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productionForecast.map((forecast, index) => (
            <motion.div
              key={forecast.period}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{forecast.period}</CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {forecast.predicted.toLocaleString()} tons
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    {forecast.trend} vs current
                  </p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Confidence</span>
                      <span className={`font-semibold ${getConfidenceColor(forecast.confidence)}`}>
                        {forecast.confidence}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Equipment Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Equipment Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={prediction.equipment} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{prediction.equipment}</div>
                      <div className="text-sm text-gray-500">{prediction.type}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{prediction.prediction}</div>
                      <div className="text-xs text-gray-500">Prediction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">{prediction.timeframe}</div>
                      <div className="text-xs text-gray-500">Timeframe</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-sm font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                        {prediction.confidence}%
                      </div>
                      <div className="text-xs text-gray-500">Confidence</div>
                    </div>
                    <Badge className={getImpactColor(prediction.impact)}>
                      {prediction.impact} impact
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions.map((prediction, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{prediction.equipment}</div>
                    <div className="text-sm text-gray-600">{prediction.recommendation}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Model Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">94.2%</div>
                <div className="text-sm text-gray-500">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">87.5%</div>
                <div className="text-sm text-gray-500">Precision</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">91.3%</div>
                <div className="text-sm text-gray-500">Recall</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Export Predictions</span>
        </Button>
        <Button className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Report</span>
        </Button>
      </div>
    </div>
  )
}

export default function ForecastingPage() {
  return (
    <DataProvider>
      <ForecastingContent />
    </DataProvider>
  )
}
