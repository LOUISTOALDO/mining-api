"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  AlertCircle,
  Settings,
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: Date
  read: boolean
  equipmentId?: string
  priority: "low" | "medium" | "high" | "critical"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "error",
    title: "Critical Alert",
    message: "Truck-023 engine temperature critical - immediate attention required",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    equipmentId: "Truck-023",
    priority: "critical"
  },
  {
    id: "2",
    type: "warning",
    title: "Maintenance Due",
    message: "Excavator-045 scheduled maintenance in 2 hours",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    equipmentId: "Excavator-045",
    priority: "high"
  },
  {
    id: "3",
    type: "info",
    title: "Production Update",
    message: "Daily production target achieved - 2,847 tons",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    priority: "medium"
  },
  {
    id: "4",
    type: "success",
    title: "System Update",
    message: "AI model predictions updated successfully",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: true,
    priority: "low"
  },
  {
    id: "5",
    type: "warning",
    title: "Fuel Efficiency Alert",
    message: "Truck-012 fuel consumption increased by 15%",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    equipmentId: "Truck-012",
    priority: "medium"
  }
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 border-red-200 text-red-800"
      case "high":
        return "bg-orange-100 border-orange-200 text-orange-800"
      case "medium":
        return "bg-yellow-100 border-yellow-200 text-yellow-800"
      case "low":
        return "bg-green-100 border-green-200 text-green-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return "Just now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const removeNotification = (notificationId: string) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "critical") return notification.priority === "critical"
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const criticalCount = notifications.filter(n => n.priority === "critical" && !n.read).length

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)] as any,
          title: "New Alert",
          message: "Equipment status update received",
          timestamp: new Date(),
          read: false,
          equipmentId: `Truck-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
          priority: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge className="bg-blue-100 text-blue-800">
                        {unreadCount} new
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: "all", label: "All" },
                    { key: "unread", label: "Unread" },
                    { key: "critical", label: "Critical" }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key as any)}
                      className={cn(
                        "flex-1 px-3 py-1 text-xs font-medium rounded-md transition-colors",
                        filter === tab.key
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      )}
                    >
                      {tab.label}
                      {tab.key === "critical" && criticalCount > 0 && (
                        <Badge className="ml-1 bg-red-500 text-white text-xs">
                          {criticalCount}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={cn(
                            "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer",
                            !notification.read && "bg-blue-50/50"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Badge className={cn("text-xs", getPriorityColor(notification.priority))}>
                                    {notification.priority}
                                  </Badge>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeNotification(notification.id)
                                    }}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(notification.timestamp)}
                                </span>
                                {notification.equipmentId && (
                                  <Badge variant="outline" className="text-xs">
                                    {notification.equipmentId}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
