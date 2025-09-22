"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Download, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Settings,
  Filter,
  Search,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  Target,
  Award,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAccessibility } from '@/hooks/useAccessibility'
import { AccessibleButton } from '@/components/ui/accessible-button'
import { AccessibleCard } from '@/components/ui/accessible-card'
import { ErrorBoundary } from '@/components/error-boundary'
import { LoadingState } from '@/components/loading-states'
import { useToastNotifications } from '@/components/ui/toast'
import { PageTransition, StaggeredList, FadeIn, ScaleIn } from '@/components/animations/page-transitions'

interface ReportType {
  id: string
  name: string
  description: string
  features: string[]
  icon: React.ReactNode
  color: string
}

interface ExportType {
  id: string
  name: string
  description: string
  features: string[]
  icon: React.ReactNode
  color: string
}

interface AIRecommendation {
  id: string
  category: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  equipment_id: string
  expected_impact: string
  implementation_time: string
  cost: string
  roi: string
  confidence: number
}

interface BusinessFeaturesDashboardProps {
  className?: string
}

const reportTypes: ReportType[] = [
  {
    id: 'operational_efficiency',
    name: 'Operational Efficiency',
    description: 'Revolutionary AI-powered operational efficiency analysis',
    features: ['AI-powered insights', 'Predictive analytics', 'Cost optimization', 'Real-time data'],
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'bg-blue-500'
  },
  {
    id: 'predictive_maintenance',
    name: 'Predictive Maintenance',
    description: 'AI-powered predictive maintenance that prevents failures',
    features: ['Failure prediction', 'Maintenance scheduling', 'Cost savings', 'Risk assessment'],
    icon: <Settings className="w-6 h-6" />,
    color: 'bg-green-500'
  },
  {
    id: 'cost_analysis',
    name: 'Cost Analysis',
    description: 'Revolutionary cost analysis and optimization insights',
    features: ['Cost breakdown', 'Optimization opportunities', 'ROI projections', 'Trend analysis'],
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-yellow-500'
  },
  {
    id: 'safety_metrics',
    name: 'Safety Metrics',
    description: 'Comprehensive safety analysis and risk assessment',
    features: ['Incident tracking', 'Risk assessment', 'Safety trends', 'Compliance reporting'],
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'bg-red-500'
  },
  {
    id: 'roi_analysis',
    name: 'ROI Analysis',
    description: 'Revolutionary ROI analysis and investment insights',
    features: ['ROI calculations', 'Payback analysis', 'Investment projections', 'Performance metrics'],
    icon: <Target className="w-6 h-6" />,
    color: 'bg-purple-500'
  }
]

const exportTypes: ExportType[] = [
  {
    id: 'equipment_data',
    name: 'Equipment Data',
    description: 'Export comprehensive equipment information',
    features: ['Real-time data', 'Custom filtering', 'Multiple formats', 'Bulk operations'],
    icon: <Settings className="w-6 h-6" />,
    color: 'bg-blue-500'
  },
  {
    id: 'telemetry_data',
    name: 'Telemetry Data',
    description: 'Export real-time telemetry and sensor data',
    features: ['Sensor data', 'Time series', 'High frequency', 'Real-time export'],
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'bg-green-500'
  },
  {
    id: 'maintenance_records',
    name: 'Maintenance Records',
    description: 'Export maintenance history and records',
    features: ['Maintenance history', 'Parts tracking', 'Cost analysis', 'Scheduling data'],
    icon: <FileText className="w-6 h-6" />,
    color: 'bg-yellow-500'
  },
  {
    id: 'cost_analysis',
    name: 'Cost Analysis',
    description: 'Export cost analysis and financial data',
    features: ['Cost breakdown', 'Financial reports', 'Budget analysis', 'ROI data'],
    icon: <DollarSign className="w-6 h-6" />,
    color: 'bg-red-500'
  },
  {
    id: 'safety_incidents',
    name: 'Safety Incidents',
    description: 'Export safety incident and compliance data',
    features: ['Incident reports', 'Compliance data', 'Safety metrics', 'Risk assessments'],
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'bg-purple-500'
  },
  {
    id: 'predictions',
    name: 'AI Predictions',
    description: 'Export AI predictions and recommendations',
    features: ['Failure predictions', 'Maintenance schedules', 'Efficiency forecasts', 'Risk predictions'],
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-indigo-500'
  }
]

export function BusinessFeaturesDashboard({ className }: BusinessFeaturesDashboardProps) {
  const [activeTab, setActiveTab] = useState<'reports' | 'exports' | 'analytics' | 'recommendations'>('reports')
  const [selectedReportType, setSelectedReportType] = useState<string | null>(null)
  const [selectedExportType, setSelectedExportType] = useState<string | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isCreatingExport, setIsCreatingExport] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  
  const { announce } = useAccessibility()
  const { success, error, warning, info } = useToastNotifications()

  // Load AI recommendations
  useEffect(() => {
    loadAIRecommendations()
    loadAnalyticsData()
  }, [])

  const loadAIRecommendations = async () => {
    try {
      // Mock AI recommendations
      const recommendations: AIRecommendation[] = [
        {
          id: 'rec-001',
          category: 'efficiency',
          priority: 'high',
          title: 'Implement Predictive Maintenance',
          description: 'Deploy AI-powered predictive maintenance to improve equipment efficiency by 15-20%.',
          equipment_id: 'excavator-001',
          expected_impact: '15-20% efficiency improvement',
          implementation_time: '2-4 weeks',
          cost: 'Medium',
          roi: 'High',
          confidence: 0.85
        },
        {
          id: 'rec-002',
          category: 'cost',
          priority: 'high',
          title: 'Optimize Fuel Consumption',
          description: 'Implement fuel monitoring and optimization strategies to reduce costs by $15,000/month.',
          equipment_id: 'haul-truck-002',
          expected_impact: '$15,000 monthly savings',
          implementation_time: '1-2 weeks',
          cost: 'Low',
          roi: 'Very High',
          confidence: 0.92
        },
        {
          id: 'rec-003',
          category: 'safety',
          priority: 'medium',
          title: 'Enhanced Safety Monitoring',
          description: 'Increase safety monitoring for equipment with high incident rates.',
          equipment_id: 'crusher-003',
          expected_impact: '50% reduction in incidents',
          implementation_time: '1 week',
          cost: 'Low',
          roi: 'High',
          confidence: 0.78
        }
      ]
      
      setAiRecommendations(recommendations)
    } catch (err) {
      error('Failed to load AI recommendations')
    }
  }

  const loadAnalyticsData = async () => {
    try {
      // Mock analytics data
      const data = {
        overview: {
          total_equipment: 25,
          active_equipment: 23,
          maintenance_due: 5,
          efficiency_score: 87.5,
          cost_savings_this_month: 125000,
          safety_score: 95.2
        },
        efficiency_trends: [
          { month: 'Jan', efficiency: 82.5 },
          { month: 'Feb', efficiency: 84.2 },
          { month: 'Mar', efficiency: 87.5 },
          { month: 'Apr', efficiency: 89.1 },
          { month: 'May', efficiency: 87.5 }
        ],
        cost_breakdown: [
          { category: 'Maintenance', amount: 45000, percentage: 36 },
          { category: 'Fuel', amount: 35000, percentage: 28 },
          { category: 'Labor', amount: 25000, percentage: 20 },
          { category: 'Parts', amount: 15000, percentage: 12 },
          { category: 'Other', amount: 5000, percentage: 4 }
        ]
      }
      
      setAnalyticsData(data)
    } catch (err) {
      error('Failed to load analytics data')
    }
  }

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true)
    announce(`Generating ${reportType} report`)
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      success(`Revolutionary ${reportType} report generated successfully!`)
      announce(`Report generation completed`)
    } catch (err) {
      error('Failed to generate report')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleCreateExport = async (exportType: string) => {
    setIsCreatingExport(true)
    announce(`Creating ${exportType} export`)
    
    try {
      // Simulate export creation
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      success(`Revolutionary ${exportType} export created successfully!`)
      announce(`Export creation completed`)
    } catch (err) {
      error('Failed to create export')
    } finally {
      setIsCreatingExport(false)
    }
  }

  const handleRefreshRecommendations = async () => {
    announce('Refreshing AI recommendations')
    await loadAIRecommendations()
    success('AI recommendations refreshed!')
  }

  const filteredRecommendations = aiRecommendations.filter(rec => {
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || rec.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'efficiency': return 'bg-blue-500'
      case 'cost': return 'bg-green-500'
      case 'safety': return 'bg-red-500'
      case 'maintenance': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <ErrorBoundary>
      <PageTransition className={cn("min-h-screen bg-gray-50", className)}>
        {/* Header */}
        <FadeIn delay={0.1}>
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Business Features</h1>
                  <p className="text-gray-600">Revolutionary AI-powered business intelligence</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <AccessibleButton
                  variant="outline"
                  size="sm"
                  icon={<RefreshCw className="w-4 h-4" />}
                  onClick={handleRefreshRecommendations}
                  announceOnClick
                  announceText="Refreshing AI recommendations"
                />
                <AccessibleButton
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  announceOnClick
                  announceText="Create new report or export"
                >
                  Create New
                </AccessibleButton>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Navigation Tabs */}
        <FadeIn delay={0.2}>
          <div className="bg-white border-b border-gray-200 px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
                { id: 'exports', label: 'Data Export', icon: <Download className="w-4 h-4" /> },
                { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'recommendations', label: 'AI Insights', icon: <Brain className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    announce(`Switched to ${tab.label} tab`)
                  }}
                  className={cn(
                    "flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </FadeIn>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StaggeredList delay={0.1}>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Revolutionary Reports</h2>
                    <p className="text-gray-600">Generate AI-powered reports that will transform your mining operations</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportTypes.map((report, index) => (
                      <ScaleIn key={report.id} delay={index * 0.1}>
                        <AccessibleCard
                          variant="elevated"
                          className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                          interactive
                          onClick={() => {
                            setSelectedReportType(report.id)
                            handleGenerateReport(report.name)
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", report.color)}>
                                {report.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                                <p className="text-sm text-gray-600">{report.description}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              {report.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-600">{feature}</span>
                                </div>
                              ))}
                            </div>
                            
                            <AccessibleButton
                              variant="primary"
                              size="sm"
                              fullWidth
                              loading={isGeneratingReport && selectedReportType === report.id}
                              announceOnClick
                              announceText={`Generate ${report.name} report`}
                            >
                              Generate Report
                            </AccessibleButton>
                          </div>
                        </AccessibleCard>
                      </ScaleIn>
                    ))}
                  </div>
                </StaggeredList>
              </motion.div>
            )}

            {activeTab === 'exports' && (
              <motion.div
                key="exports"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StaggeredList delay={0.1}>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Data Export</h2>
                    <p className="text-gray-600">Export your data in any format for seamless integration</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exportTypes.map((exportType, index) => (
                      <ScaleIn key={exportType.id} delay={index * 0.1}>
                        <AccessibleCard
                          variant="elevated"
                          className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                          interactive
                          onClick={() => {
                            setSelectedExportType(exportType.id)
                            handleCreateExport(exportType.name)
                          }}
                        >
                          <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", exportType.color)}>
                                {exportType.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{exportType.name}</h3>
                                <p className="text-sm text-gray-600">{exportType.description}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              {exportType.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-gray-600">{feature}</span>
                                </div>
                              ))}
                            </div>
                            
                            <AccessibleButton
                              variant="primary"
                              size="sm"
                              fullWidth
                              loading={isCreatingExport && selectedExportType === exportType.id}
                              announceOnClick
                              announceText={`Create ${exportType.name} export`}
                            >
                              Create Export
                            </AccessibleButton>
                          </div>
                        </AccessibleCard>
                      </ScaleIn>
                    ))}
                  </div>
                </StaggeredList>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StaggeredList delay={0.1}>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h2>
                    <p className="text-gray-600">Real-time insights and performance metrics</p>
                  </div>
                  
                  {analyticsData && (
                    <>
                      {/* Overview Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <ScaleIn delay={0.1}>
                          <AccessibleCard variant="elevated" className="p-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Settings className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Total Equipment</p>
                                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.total_equipment}</p>
                              </div>
                            </div>
                          </AccessibleCard>
                        </ScaleIn>
                        
                        <ScaleIn delay={0.2}>
                          <AccessibleCard variant="elevated" className="p-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Efficiency Score</p>
                                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.efficiency_score}%</p>
                              </div>
                            </div>
                          </AccessibleCard>
                        </ScaleIn>
                        
                        <ScaleIn delay={0.3}>
                          <AccessibleCard variant="elevated" className="p-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Cost Savings</p>
                                <p className="text-2xl font-bold text-gray-900">${analyticsData.overview.cost_savings_this_month.toLocaleString()}</p>
                              </div>
                            </div>
                          </AccessibleCard>
                        </ScaleIn>
                        
                        <ScaleIn delay={0.4}>
                          <AccessibleCard variant="elevated" className="p-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Safety Score</p>
                                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.safety_score}%</p>
                              </div>
                            </div>
                          </AccessibleCard>
                        </ScaleIn>
                      </div>
                      
                      {/* Charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ScaleIn delay={0.5}>
                          <AccessibleCard variant="elevated" className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Trends</h3>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                              <p className="text-gray-500">Efficiency trend chart would be displayed here</p>
                            </div>
                          </AccessibleCard>
                        </ScaleIn>
                        
                        <ScaleIn delay={0.6}>
                          <AccessibleCard variant="elevated" className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
                            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                              <p className="text-gray-500">Cost breakdown chart would be displayed here</p>
                            </div>
                          </AccessibleCard>
                        </ScaleIn>
                      </div>
                    </>
                  )}
                </StaggeredList>
              </motion.div>
            )}

            {activeTab === 'recommendations' && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StaggeredList delay={0.1}>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Recommendations</h2>
                    <p className="text-gray-600">Revolutionary AI-powered insights to optimize your operations</p>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search recommendations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Categories</option>
                      <option value="efficiency">Efficiency</option>
                      <option value="cost">Cost</option>
                      <option value="safety">Safety</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="space-y-4">
                    {filteredRecommendations.map((recommendation, index) => (
                      <ScaleIn key={recommendation.id} delay={index * 0.1}>
                        <AccessibleCard variant="elevated" className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", getCategoryColor(recommendation.category))}>
                                  <Brain className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                                  <div className="flex items-center space-x-2">
                                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getPriorityColor(recommendation.priority))}>
                                      {recommendation.priority.toUpperCase()}
                                    </span>
                                    <span className="text-sm text-gray-500">Confidence: {Math.round(recommendation.confidence * 100)}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{recommendation.description}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Expected Impact</p>
                                  <p className="font-medium text-gray-900">{recommendation.expected_impact}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Implementation Time</p>
                                  <p className="font-medium text-gray-900">{recommendation.implementation_time}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Cost</p>
                                  <p className="font-medium text-gray-900">{recommendation.cost}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">ROI</p>
                                  <p className="font-medium text-gray-900">{recommendation.roi}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-2 ml-4">
                              <AccessibleButton
                                variant="primary"
                                size="sm"
                                announceOnClick
                                announceText={`Implement ${recommendation.title}`}
                              >
                                Implement
                              </AccessibleButton>
                              <AccessibleButton
                                variant="outline"
                                size="sm"
                                icon={<Eye className="w-4 h-4" />}
                                announceOnClick
                                announceText={`View details for ${recommendation.title}`}
                              >
                                Details
                              </AccessibleButton>
                            </div>
                          </div>
                        </AccessibleCard>
                      </ScaleIn>
                    ))}
                  </div>
                  
                  {filteredRecommendations.length === 0 && (
                    <div className="text-center py-12">
                      <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recommendations found matching your criteria</p>
                    </div>
                  )}
                </StaggeredList>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageTransition>
    </ErrorBoundary>
  )
}
