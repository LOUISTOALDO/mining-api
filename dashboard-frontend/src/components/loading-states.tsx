"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, Activity, BarChart3, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  )
}

interface LoadingCardProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function LoadingCard({ title = "Loading...", description, icon }: LoadingCardProps) {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          {icon || <LoadingSpinner size="sm" />}
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          {description && (
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface LoadingGridProps {
  count?: number
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function LoadingGrid({ count = 4, title, description, icon }: LoadingGridProps) {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div className="text-center">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <LoadingCard key={index} icon={icon} />
        ))}
      </div>
    </div>
  )
}

interface LoadingTableProps {
  rows?: number
  columns?: number
}

export function LoadingTable({ rows = 5, columns = 4 }: LoadingTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
      </div>
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface LoadingChartProps {
  type?: 'line' | 'bar' | 'pie'
}

export function LoadingChart({ type = 'line' }: LoadingChartProps) {
  const getIcon = () => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-5 h-5 text-blue-500" />
      case 'pie':
        return <Activity className="w-5 h-5 text-green-500" />
      default:
        return <Activity className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {getIcon()}
          <CardTitle className="text-lg font-semibold">Loading Chart</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="text-blue-500 mb-2" />
            <p className="text-sm text-gray-600">Loading chart data...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface LoadingPageProps {
  title?: string
  description?: string
}

export function LoadingPage({ title = "Loading...", description }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </motion.div>
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ isVisible, message = "Loading..." }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 text-center">
        <LoadingSpinner size="lg" className="text-blue-500 mb-4" />
        <p className="text-gray-700">{message}</p>
      </div>
    </motion.div>
  )
}

interface SkeletonProps {
  className?: string
  height?: string
  width?: string
}

export function Skeleton({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div className={`bg-gray-200 rounded animate-pulse ${height} ${width} ${className}`} />
  )
}

interface LoadingStateProps {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LoadingState({ 
  isLoading, 
  children, 
  fallback, 
  className = '' 
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={className}>
        {fallback || (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

// Specific loading components for different sections
export function EquipmentLoadingCard() {
  return (
    <LoadingCard
      title="Equipment Status"
      description="Loading equipment information..."
      icon={<Activity className="w-4 h-4 text-blue-500" />}
    />
  )
}

export function TelemetryLoadingCard() {
  return (
    <LoadingCard
      title="Telemetry Data"
      description="Loading real-time data..."
      icon={<Activity className="w-4 h-4 text-green-500" />}
    />
  )
}

export function AlertsLoadingCard() {
  return (
    <LoadingCard
      title="System Alerts"
      description="Loading alert information..."
      icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
    />
  )
}

export function AnalyticsLoadingCard() {
  return (
    <LoadingCard
      title="Analytics"
      description="Loading performance data..."
      icon={<BarChart3 className="w-4 h-4 text-purple-500" />}
    />
  )
}
