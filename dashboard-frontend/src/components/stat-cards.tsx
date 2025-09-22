"use client"

import { motion } from "framer-motion"
import { 
  Truck, 
  Activity, 
  TrendingUp, 
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const stats = [
  {
    title: "Active Trucks",
    value: "47",
    change: "+3.2%",
    trend: "up",
    icon: Truck,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Daily Production",
    value: "2,847",
    change: "+15.8%",
    trend: "up",
    icon: Activity,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Revenue",
    value: "$2.4M",
    change: "+32.4%",
    trend: "up",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Equipment Health",
    value: "94.2%",
    change: "+1.8%",
    trend: "up",
    icon: Zap,
    color: "from-orange-500 to-red-500"
  }
]

export function StatCards() {
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
              <CardTitle className="text-sm font-medium text-muted-foreground">
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
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                )}
                <span className={cn(
                  "font-medium",
                  stat.trend === "up" ? "text-green-400" : "text-red-400"
                )}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
