"use client"

import { motion } from "framer-motion"
import { 
  Truck, 
  Activity, 
  TrendingUp, 
  Zap,
  AlertTriangle,
  Wrench
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useData } from "@/contexts/data-context"
import { cn } from "@/lib/utils"

export function EnhancedStatCards() {
  const { metrics, isLoading, error } = useData()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
              <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="col-span-full">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <span>Error loading data: {error}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = [
    {
      title: "Active Trucks",
      value: metrics?.active_trucks?.toString() || "0",
      change: "+3.2%",
      trend: "up" as const,
      icon: Truck,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Daily Production",
      value: metrics?.daily_production?.toLocaleString() || "0",
      change: "+15.8%",
      trend: "up" as const,
      icon: Activity,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Revenue",
      value: `$${(metrics?.revenue || 0) / 1000000}M`,
      change: "+32.4%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Equipment Health",
      value: `${metrics?.equipment_health || 0}%`,
      change: "+1.8%",
      trend: "up" as const,
      icon: Zap,
      color: "from-orange-500 to-red-500"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="card-hover clean-shadow bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={cn(
                "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                stat.color
              )}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                <span className={cn(
                  "font-medium",
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                )}>
                  {stat.change}
                </span>
                <span className="text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
