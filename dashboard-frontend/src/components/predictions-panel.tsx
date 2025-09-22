"use client"

import { motion } from "framer-motion"
import { Brain, TrendingDown, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useData } from "@/contexts/data-context"
import { cn } from "@/lib/utils"

export function PredictionsPanel() {
  const { predictions, isLoading, getEquipmentPrediction } = useData()

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800'
      case 'medium':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800'
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800'
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800'
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />
      case 'medium':
        return <TrendingDown className="w-4 h-4" />
      case 'low':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleRefreshPrediction = async (equipmentId: string) => {
    try {
      await getEquipmentPrediction(equipmentId)
    } catch (error) {
      console.error('Failed to refresh prediction:', error)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-500" />
            <span>AI Predictions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-500" />
          <span>AI Predictions</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          ML model insights for equipment health and maintenance
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {predictions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No predictions available</p>
            </div>
          ) : (
            predictions.map((prediction, index) => (
              <motion.div
                key={prediction.equipment_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{prediction.equipment_id}</h4>
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                      getRiskColor(prediction.maintenance_risk)
                    )}>
                      {getRiskIcon(prediction.maintenance_risk)}
                      <span className="ml-1">{prediction.maintenance_risk.toUpperCase()}</span>
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRefreshPrediction(prediction.equipment_id)}
                    className="text-xs"
                  >
                    Refresh
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Health Score</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            prediction.predicted_health > 0.8 ? "bg-green-500" :
                            prediction.predicted_health > 0.6 ? "bg-yellow-500" : "bg-red-500"
                          )}
                          style={{ width: `${prediction.predicted_health * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(prediction.predicted_health * 100)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Confidence</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${prediction.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(prediction.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {prediction.predicted_failure_date && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Predicted Failure Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(prediction.predicted_failure_date)}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-2">Recommended Actions</p>
                  <div className="space-y-1">
                    {prediction.recommended_actions.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
