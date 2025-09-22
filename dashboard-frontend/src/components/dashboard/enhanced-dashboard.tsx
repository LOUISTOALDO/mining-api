"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { 
  Settings, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  Filter,
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAccessibility, useReducedMotion } from '@/hooks/useAccessibility'
import { AccessibleButton } from '@/components/ui/accessible-button'
import { AccessibleCard } from '@/components/ui/accessible-card'
import { ErrorBoundary } from '@/components/error-boundary'
import { LoadingSpinner, LoadingState } from '@/components/loading-states'
import { EnhancedStatCards } from '@/components/enhanced-stat-cards'
import { Charts } from '@/components/charts'
import { DataTable } from '@/components/data-table'
import { AlertsPanel } from '@/components/alerts-panel'
import { PredictionsPanel } from '@/components/predictions-panel'
import { RealtimeTelemetry } from '@/components/realtime-telemetry'
import { AdvancedAnalyticsDashboard } from '@/components/advanced-analytics-dashboard'
import { CostAnalysisDashboard } from '@/components/cost-analysis-dashboard'

interface DashboardWidget {
  id: string
  title: string
  component: React.ComponentType
  size: 'small' | 'medium' | 'large' | 'full'
  position: { x: number; y: number }
  visible: boolean
  minimized?: boolean
  order: number
}

interface EnhancedDashboardProps {
  className?: string
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: "stats",
    title: "Key Metrics",
    component: EnhancedStatCards,
    size: "full",
    position: { x: 0, y: 0 },
    visible: true,
    order: 1
  },
  {
    id: "alerts",
    title: "Equipment Alerts",
    component: AlertsPanel,
    size: "medium",
    position: { x: 0, y: 1 },
    visible: true,
    order: 2
  },
  {
    id: "predictions",
    title: "AI Predictions",
    component: PredictionsPanel,
    size: "medium",
    position: { x: 1, y: 1 },
    visible: true,
    order: 3
  },
  {
    id: "charts",
    title: "Analytics Charts",
    component: Charts,
    size: "large",
    position: { x: 0, y: 2 },
    visible: true,
    order: 4
  },
  {
    id: "data-table",
    title: "Fleet Data",
    component: DataTable,
    size: "full",
    position: { x: 0, y: 3 },
    visible: true,
    order: 5
  },
  {
    id: "realtime-telemetry",
    title: "Real-Time Telemetry",
    component: RealtimeTelemetry,
    size: "full",
    position: { x: 0, y: 4 },
    visible: true,
    order: 6
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    component: AdvancedAnalyticsDashboard,
    size: "full",
    position: { x: 0, y: 5 },
    visible: true,
    order: 7
  },
  {
    id: "cost-analysis",
    title: "Cost Analysis",
    component: CostAnalysisDashboard,
    size: "full",
    position: { x: 0, y: 6 },
    visible: true,
    order: 8
  }
]

export function EnhancedDashboard({ className }: EnhancedDashboardProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets)
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredWidgets, setFilteredWidgets] = useState<DashboardWidget[]>(defaultWidgets)
  const [isLoading, setIsLoading] = useState(false)
  
  const { announce } = useAccessibility()
  const prefersReducedMotion = useReducedMotion()
  const controls = useAnimation()

  // Filter widgets based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredWidgets(widgets)
    } else {
      const filtered = widgets.filter(widget =>
        widget.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredWidgets(filtered)
    }
  }, [widgets, searchQuery])

  // Animation controls
  const animateLayout = useCallback(async () => {
    if (prefersReducedMotion) return
    
    await controls.start({
      scale: [1, 1.02, 1],
      transition: { duration: 0.3 }
    })
  }, [controls, prefersReducedMotion])

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => {
      const newMode = !prev
      announce(newMode ? "Edit mode enabled" : "Edit mode disabled")
      return newMode
    })
    animateLayout()
  }, [announce, animateLayout])

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ))
    announce(`Widget visibility toggled`)
  }, [announce])

  const toggleWidgetMinimize = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, minimized: !widget.minimized }
        : widget
    ))
    announce(`Widget minimized`)
  }, [announce])

  const resetLayout = useCallback(() => {
    setWidgets(defaultWidgets)
    announce("Dashboard layout reset")
    animateLayout()
  }, [announce, animateLayout])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => {
      const newMode = prev === 'grid' ? 'list' : 'grid'
      announce(`View mode changed to ${newMode}`)
      return newMode
    })
  }, [announce])

  const getGridClasses = (size: string) => {
    const sizeClasses = {
      small: "col-span-1 row-span-1",
      medium: "col-span-1 row-span-2",
      large: "col-span-2 row-span-2",
      full: "col-span-4 row-span-1"
    }
    return sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const widgetVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    minimized: {
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  }

  return (
    <ErrorBoundary>
      <div className={cn("min-h-screen bg-gray-50", className)}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 px-6 py-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Mining Operations Dashboard</h1>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search widgets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* View Mode Toggle */}
              <AccessibleButton
                variant="outline"
                size="sm"
                icon={viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
                onClick={toggleViewMode}
                announceOnClick
                announceText={`View mode changed to ${viewMode === 'grid' ? 'list' : 'grid'}`}
              />

              {/* Edit Mode Toggle */}
              <AccessibleButton
                variant={isEditMode ? "primary" : "outline"}
                size="sm"
                icon={<Settings className="w-4 h-4" />}
                onClick={toggleEditMode}
                announceOnClick
                announceText={isEditMode ? "Edit mode disabled" : "Edit mode enabled"}
              />

              {/* Reset Layout */}
              <AccessibleButton
                variant="outline"
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={resetLayout}
                announceOnClick
                announceText="Dashboard layout reset"
              />
            </div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6"
        >
          <LoadingState isLoading={isLoading}>
            {viewMode === 'grid' ? (
              <motion.div
                className="grid grid-cols-4 gap-6 auto-rows-min"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filteredWidgets
                    .filter(widget => widget.visible)
                    .sort((a, b) => a.order - b.order)
                    .map((widget) => (
                      <motion.div
                        key={widget.id}
                        variants={widgetVariants}
                        initial="hidden"
                        animate={widget.minimized ? "minimized" : "visible"}
                        exit="hidden"
                        layout
                        className={cn(
                          getGridClasses(widget.size),
                          "relative"
                        )}
                      >
                        <AccessibleCard
                          variant="elevated"
                          className="h-full"
                          interactive={isEditMode}
                        >
                          {/* Widget Header */}
                          <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {widget.title}
                            </h3>
                            
                            {isEditMode && (
                              <div className="flex items-center space-x-2">
                                <AccessibleButton
                                  variant="ghost"
                                  size="sm"
                                  icon={widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                  onClick={() => toggleWidgetVisibility(widget.id)}
                                  announceOnClick
                                  announceText={`${widget.title} visibility toggled`}
                                />
                                <AccessibleButton
                                  variant="ghost"
                                  size="sm"
                                  icon={widget.minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                  onClick={() => toggleWidgetMinimize(widget.id)}
                                  announceOnClick
                                  announceText={`${widget.title} ${widget.minimized ? 'expanded' : 'minimized'}`}
                                />
                              </div>
                            )}
                          </div>

                          {/* Widget Content */}
                          {!widget.minimized && (
                            <div className="p-4">
                              <ErrorBoundary>
                                <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                                  <widget.component />
                                </React.Suspense>
                              </ErrorBoundary>
                            </div>
                          )}
                        </AccessibleCard>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-4"
                layout
              >
                <AnimatePresence>
                  {filteredWidgets
                    .filter(widget => widget.visible)
                    .sort((a, b) => a.order - b.order)
                    .map((widget) => (
                      <motion.div
                        key={widget.id}
                        variants={widgetVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        layout
                      >
                        <AccessibleCard
                          variant="elevated"
                          className="w-full"
                          interactive={isEditMode}
                        >
                          {/* Widget Header */}
                          <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {widget.title}
                            </h3>
                            
                            {isEditMode && (
                              <div className="flex items-center space-x-2">
                                <AccessibleButton
                                  variant="ghost"
                                  size="sm"
                                  icon={widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                  onClick={() => toggleWidgetVisibility(widget.id)}
                                  announceOnClick
                                  announceText={`${widget.title} visibility toggled`}
                                />
                                <AccessibleButton
                                  variant="ghost"
                                  size="sm"
                                  icon={widget.minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                  onClick={() => toggleWidgetMinimize(widget.id)}
                                  announceOnClick
                                  announceText={`${widget.title} ${widget.minimized ? 'expanded' : 'minimized'}`}
                                />
                              </div>
                            )}
                          </div>

                          {/* Widget Content */}
                          {!widget.minimized && (
                            <div className="p-4">
                              <ErrorBoundary>
                                <React.Suspense fallback={<LoadingSpinner size="lg" />}>
                                  <widget.component />
                                </React.Suspense>
                              </ErrorBoundary>
                            </div>
                          )}
                        </AccessibleCard>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </motion.div>
            )}
          </LoadingState>
        </motion.div>
      </div>
    </ErrorBoundary>
  )
}
