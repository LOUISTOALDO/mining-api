"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GripVertical, X, Settings, Maximize2, Minimize2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EnhancedStatCards } from "@/components/enhanced-stat-cards"
import { Charts } from "@/components/charts"
import { DataTable } from "@/components/data-table"
import { AlertsPanel } from "@/components/alerts-panel"
import { PredictionsPanel } from "@/components/predictions-panel"
import { RealtimeTelemetry } from "@/components/realtime-telemetry"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { CostAnalysisDashboard } from "@/components/cost-analysis-dashboard"

interface DashboardWidget {
  id: string
  title: string
  component: React.ComponentType
  size: "small" | "medium" | "large" | "full"
  position: { x: number; y: number }
  visible: boolean
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: "stats",
    title: "Key Metrics",
    component: EnhancedStatCards,
    size: "full",
    position: { x: 0, y: 0 },
    visible: true
  },
  {
    id: "alerts",
    title: "Equipment Alerts",
    component: AlertsPanel,
    size: "large",
    position: { x: 0, y: 1 },
    visible: true
  },
  {
    id: "predictions",
    title: "AI Predictions",
    component: PredictionsPanel,
    size: "medium",
    position: { x: 1, y: 1 },
    visible: true
  },
  {
    id: "charts",
    title: "Analytics Charts",
    component: Charts,
    size: "full",
    position: { x: 0, y: 2 },
    visible: true
  },
  {
    id: "table",
    title: "Fleet Data",
    component: DataTable,
    size: "full",
    position: { x: 0, y: 3 },
    visible: true
  },
  {
    id: "realtime-telemetry",
    title: "Real-Time Telemetry",
    component: RealtimeTelemetry,
    size: "full",
    position: { x: 0, y: 4 },
    visible: true
  },
  {
    id: "advanced-analytics",
    title: "Advanced Analytics",
    component: AdvancedAnalyticsDashboard,
    size: "full",
    position: { x: 0, y: 5 },
    visible: true
  },
  {
    id: "cost-analysis",
    title: "Cost Analysis",
    component: CostAnalysisDashboard,
    size: "full",
    position: { x: 0, y: 6 },
    visible: true
  }
]

export function DraggableDashboard() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dragOverWidget, setDragOverWidget] = useState<string | null>(null)
  const [draggedElement, setDraggedElement] = useState<HTMLElement | null>(null)
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null)

  const getGridSize = (size: string) => {
    switch (size) {
      case "small":
        return "col-span-1"
      case "medium":
        return "col-span-2"
      case "large":
        return "col-span-3"
      case "full":
        return "col-span-4"
      default:
        return "col-span-2"
    }
  }

  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, visible: !widget.visible }
        : widget
    ))
  }

  const checkCollision = (draggedRect: DOMRect, targetRect: DOMRect) => {
    // More sensitive collision detection - trigger when widgets are close to touching
    const padding = 80 // pixels of padding for easier collision detection
    return !(
      draggedRect.right < targetRect.left - padding ||
      draggedRect.left > targetRect.right + padding ||
      draggedRect.bottom < targetRect.top - padding ||
      draggedRect.top > targetRect.bottom + padding
    )
  }

  const handleDragStart = (widgetId: string, element: HTMLElement) => {
    console.log('Drag start:', widgetId)
    setDraggedWidget(widgetId)
    setDraggedElement(element)
  }

  const visibleWidgets = widgets.filter(widget => widget.visible)
  const sortedWidgets = visibleWidgets.sort((a, b) => {
    if (a.position.y !== b.position.y) {
      return a.position.y - b.position.y
    }
    return a.position.x - b.position.x
  })


  const handleDrag = (e: React.DragEvent) => {
    if (!isEditMode || !draggedElement) return

    // Create a virtual dragged rect based on mouse position for reliable collision detection
    const mouseX = e.clientX
    const mouseY = e.clientY
    const draggedRect = draggedElement.getBoundingClientRect()
    
    // Create a virtual rect at the mouse position with the same size as the dragged element
    const virtualDraggedRect = {
      left: mouseX - draggedRect.width / 2,
      right: mouseX + draggedRect.width / 2,
      top: mouseY - draggedRect.height / 2,
      bottom: mouseY + draggedRect.height / 2,
      width: draggedRect.width,
      height: draggedRect.height
    } as DOMRect

    let foundCollision = false
    let targetWidgetId: string | null = null

    sortedWidgets.forEach(widget => {
      if (widget.id === draggedWidget) return

      const targetElement = document.querySelector(`[data-widget-id="${widget.id}"]`) as HTMLElement
      if (targetElement) {
        const targetRect = targetElement.getBoundingClientRect()
        
        // Check if the virtual dragged widget overlaps with the target widget
        if (checkCollision(virtualDraggedRect, targetRect)) {
          console.log('Widget collision with:', widget.id)
          setDragOverWidget(widget.id)
          targetWidgetId = widget.id
          foundCollision = true
        }
      }
    })

    if (!foundCollision) {
      setDragOverWidget(null)
    }
  }

  const handleDragOver = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault()
    // Allow drop as soon as we're over a widget that has the blue ring
    if (dragOverWidget === targetWidgetId) {
      e.dataTransfer.dropEffect = "move"
    }
  }

  const handleDragEnter = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault()
    // If this widget has the blue ring, allow drop immediately
    if (dragOverWidget === targetWidgetId && draggedWidget && draggedWidget !== targetWidgetId) {
      e.dataTransfer.dropEffect = "move"
    }
  }

  const handleDragEnd = (widgetId: string, targetWidgetId?: string) => {
    if (targetWidgetId && targetWidgetId !== widgetId) {
      setWidgets(widgets.map(widget => {
        if (widget.id === widgetId) {
          const targetWidget = widgets.find(w => w.id === targetWidgetId)
          return targetWidget ? { ...widget, position: targetWidget.position } : widget
        }
        if (widget.id === targetWidgetId) {
          const draggedWidget = widgets.find(w => w.id === widgetId)
          return draggedWidget ? { ...widget, position: draggedWidget.position } : widget
        }
        return widget
      }))
    }
    setDraggedWidget(null)
    setDragOverWidget(null)
    setDraggedElement(null)
  }

  const resetLayout = () => {
    setWidgets(defaultWidgets)
  }

  const handleExpandWidget = (widgetId: string) => {
    setExpandedWidget(widgetId)
  }

  const handleCollapseWidget = () => {
    setExpandedWidget(null)
  }

  return (
    <div 
      className="space-y-6"
      onDrop={(e) => {
        e.preventDefault()
        console.log('Global drop - draggedWidget:', draggedWidget, 'dragOverWidget:', dragOverWidget)
        // Execute swap if we have a dragged widget and a highlighted target
        if (isEditMode && draggedWidget && dragOverWidget && draggedWidget !== dragOverWidget) {
          console.log('Global drop executing swap:', draggedWidget, 'with', dragOverWidget)
          handleDragEnd(draggedWidget, dragOverWidget)
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Customize your dashboard layout and monitor your mining operations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => setIsEditMode(!isEditMode)}
            className={isEditMode ? "bg-blue-50 border-blue-200 text-blue-700" : ""}
          >
            <Settings className="w-4 h-4 mr-2" />
            {isEditMode ? "Exit Edit" : "Customize"}
          </Button>
          {isEditMode && (
            <Button variant="outline" onClick={resetLayout}>
              Reset Layout
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <AnimatePresence>
          {sortedWidgets.map((widget, index) => (
            <motion.div
              key={widget.id}
              data-widget-id={widget.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`${getGridSize(widget.size)} ${isEditMode ? "cursor-move" : ""} ${
                dragOverWidget === widget.id ? "ring-2 ring-blue-500" : ""
              } ${draggedWidget === widget.id ? "opacity-50" : ""}`}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(widget.id, e.currentTarget as HTMLElement)}
              onDrag={(e) => handleDrag(e as any)}
              onDragEnter={(e) => handleDragEnter(e, widget.id)}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDrop={(e) => {
                e.preventDefault()
                console.log('Drop on:', widget.id, 'draggedWidget:', draggedWidget, 'dragOverWidget:', dragOverWidget)
                // Execute swap if we have a dragged widget and a highlighted target
                if (isEditMode && draggedWidget && dragOverWidget && draggedWidget !== dragOverWidget) {
                  console.log('Executing swap:', draggedWidget, 'with', dragOverWidget)
                  handleDragEnd(draggedWidget, dragOverWidget)
                }
              }}
              onDragEnd={() => {
                if (isEditMode) {
                  handleDragEnd(widget.id)
                }
              }}
            >
              <Card className="h-full bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{widget.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    {isEditMode && (
                      <div className="flex items-center space-x-1">
                        <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWidgetVisibility(widget.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => handleExpandWidget(widget.id)}
                      title="Expand widget"
                    >
                      <Maximize2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <widget.component />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Add Widgets</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {defaultWidgets
              .filter(widget => !widget.visible)
              .map(widget => (
                <Button
                  key={widget.id}
                  variant="outline"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                >
                  <div className="text-sm font-medium">{widget.title}</div>
                  <div className="text-xs text-gray-500 capitalize">{widget.size}</div>
                </Button>
              ))}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {expandedWidget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCollapseWidget}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-7xl max-h-[90vh] w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {sortedWidgets.find(w => w.id === expandedWidget)?.title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCollapseWidget}
                  className="h-8 w-8 p-0"
                  title="Close expanded view"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                {sortedWidgets.find(w => w.id === expandedWidget) && (
                  React.createElement(sortedWidgets.find(w => w.id === expandedWidget)!.component)
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
