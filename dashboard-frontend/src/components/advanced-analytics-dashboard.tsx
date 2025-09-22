"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Target,
  Clock
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRealtime } from '@/contexts/realtime-context'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

interface PerformanceAnalytics {
  total_machines: number
  running_machines: number
  idle_machines: number
  maintenance_machines: number
  efficiency_score: number
  average_metrics: {
    vibration_g: number
    temperature_c: number
    fuel_level: number
  }
  utilization_rate: number
}

interface MLPrediction {
  machine_id: string
  machine_name: string
  machine_type: string
  prediction: string
  confidence: number
  health_score: number
  recommendations: string[]
  features: any
  status: string
}

export function AdvancedAnalyticsDashboard() {
  const { telemetryData, isConnected } = useRealtime()
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null)
  const [predictions, setPredictions] = useState<MLPrediction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [adminStats, setAdminStats] = useState<any>(null)
  const [allUsers, setAllUsers] = useState<any[]>([])

  // Check if user is admin
  const isAdmin = user?.roles?.includes('admin')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true)
        
        // Use mock data for now since the backend endpoints don't exist yet
        const mockAnalytics: PerformanceAnalytics = {
          total_machines: 12,
          running_machines: 8,
          idle_machines: 2,
          maintenance_machines: 2,
          efficiency_score: 87.5,
          average_metrics: {
            vibration_g: 1.8,
            temperature_c: 75.2,
            fuel_level: 68.4
          },
          utilization_rate: 78.3
        }
        
        const mockPredictions: MLPrediction[] = [
          {
            machine_id: 'Truck-001',
            machine_name: 'Haul Truck 001',
            machine_type: 'Haul Truck',
            prediction: 'Normal Operation',
            confidence: 0.92,
            health_score: 0.88,
            recommendations: ['Routine maintenance in 2 weeks'],
            features: {},
            status: 'active'
          },
          {
            machine_id: 'Excavator-045',
            machine_name: 'Excavator 045',
            machine_type: 'Excavator',
            prediction: 'Maintenance Required',
            confidence: 0.85,
            health_score: 0.65,
            recommendations: ['Check hydraulic system', 'Replace filters'],
            features: {},
            status: 'maintenance'
          }
        ]
        
        setAnalytics(mockAnalytics)
        setPredictions(mockPredictions)

        // Fetch admin data if user is admin
        if (isAdmin) {
          try {
            const token = localStorage.getItem('token')
            const headers = {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }

            // Fetch admin stats
            const statsResponse = await fetch('http://127.0.0.1:8000/admin/stats', { headers })
            if (statsResponse.ok) {
              const stats = await statsResponse.json()
              setAdminStats(stats)
            }

            // Fetch all users
            const usersResponse = await fetch('http://127.0.0.1:8000/admin/users', { headers })
            if (usersResponse.ok) {
              const usersData = await usersResponse.json()
              setAllUsers(usersData.users || [])
            }
          } catch (adminError) {
            console.error('Error fetching admin data:', adminError)
          }
        }

      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const getEfficiencyColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600'
    if (score >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500'
    if (score >= 0.6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getPredictionColor = (prediction: string) => {
    if (prediction.includes('excellent') || prediction.includes('good')) return 'bg-green-100 text-green-800 border-green-200'
    if (prediction.includes('maintenance_recommended')) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (prediction.includes('urgent') || prediction.includes('critical')) return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
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
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Machines</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics?.total_machines || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Active fleet</p>
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
              <CardTitle className="text-sm font-medium text-gray-600">Efficiency Score</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className={cn("text-2xl font-bold", getEfficiencyColor(analytics?.efficiency_score || 0))}>
                {Math.round((analytics?.efficiency_score || 0) * 100)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Overall performance</p>
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
              <CardTitle className="text-sm font-medium text-gray-600">Utilization Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics?.utilization_rate || 0}%</div>
              <p className="text-xs text-gray-500 mt-1">Active vs total</p>
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
              <CardTitle className="text-sm font-medium text-gray-600">Running Machines</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{analytics?.running_machines || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Currently operational</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Machine Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            <span>Machine Health Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.machine_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{prediction.machine_name}</h4>
                    <p className="text-sm text-gray-500">{prediction.machine_type}</p>
                  </div>
                  <Badge className={cn("text-xs", getPredictionColor(prediction.prediction))}>
                    {prediction.prediction.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Health Score</span>
                      <span className="text-sm font-medium">{Math.round(prediction.health_score * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn("h-2 rounded-full transition-all duration-300", getHealthColor(prediction.health_score))}
                        style={{ width: `${prediction.health_score * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Confidence</span>
                      <span className="text-sm font-medium">{Math.round(prediction.confidence * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 mb-2">Top Recommendations</p>
                    <div className="space-y-1">
                      {prediction.recommendations.slice(0, 2).map((rec, recIndex) => (
                        <div key={recIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Average Metrics */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Fleet Average Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analytics.average_metrics.vibration_g}g
                </div>
                <p className="text-sm text-gray-600">Average Vibration</p>
                <div className="mt-2">
                  {analytics.average_metrics.vibration_g > 2.0 ? (
                    <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analytics.average_metrics.temperature_c}°C
                </div>
                <p className="text-sm text-gray-600">Average Temperature</p>
                <div className="mt-2">
                  {analytics.average_metrics.temperature_c > 80 ? (
                    <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {analytics.average_metrics.fuel_level}%
                </div>
                <p className="text-sm text-gray-600">Average Fuel Level</p>
                <div className="mt-2">
                  {analytics.average_metrics.fuel_level < 30 ? (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Low</Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Good</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span>System Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-3 h-3 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-sm font-medium">
                {isConnected ? "Real-time Connected" : "Disconnected"}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Only Sections */}
      {isAdmin && (
        <>
          {/* Admin Statistics */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                <span>Admin Dashboard</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Admin Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {adminStats?.total_users || 0}
                  </div>
                  <p className="text-sm text-blue-700">Total Users</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {adminStats?.active_users || 0}
                  </div>
                  <p className="text-sm text-blue-700">Active Users</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-900 mb-2">
                    {adminStats?.total_machines || 0}
                  </div>
                  <p className="text-sm text-blue-700">Total Machines</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>User Management</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Admin Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-blue-700 mb-4">
                  Manage system users and permissions
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{user.username}</h4>
                        <Badge className={cn(
                          "text-xs",
                          user.is_active ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                        )}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Last login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span>Admin Actions</span>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Admin Only</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token')
                      const response = await fetch('http://127.0.0.1:8000/admin/seed', {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        }
                      })
                      if (response.ok) {
                        alert('Database seeded successfully!')
                        window.location.reload()
                      }
                    } catch (error) {
                      console.error('Error seeding database:', error)
                    }
                  }}
                >
                  Seed Database
                </Button>
                <Button 
                  variant="outline" 
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  onClick={() => window.location.reload()}
                >
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
