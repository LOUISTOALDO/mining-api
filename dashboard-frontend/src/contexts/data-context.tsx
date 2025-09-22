"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { miningAPI, MiningData, PredictionResult, DashboardMetrics, EquipmentAlert } from "@/services/api"

interface DataContextType {
  miningData: MiningData[]
  predictions: PredictionResult[]
  metrics: DashboardMetrics | null
  alerts: EquipmentAlert[]
  isLoading: boolean
  error: string | null
  refreshData: () => Promise<void>
  getEquipmentPrediction: (equipmentId: string) => Promise<PredictionResult>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  const [miningData, setMiningData] = useState<MiningData[]>([])
  const [predictions, setPredictions] = useState<PredictionResult[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [alerts, setAlerts] = useState<EquipmentAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [miningDataResult, predictionsResult, metricsResult, alertsResult] = await Promise.all([
        miningAPI.getMiningData(),
        miningAPI.getPredictions(),
        miningAPI.getDashboardMetrics(),
        miningAPI.getAlerts()
      ])

      setMiningData(miningDataResult)
      setPredictions(predictionsResult)
      setMetrics(metricsResult)
      setAlerts(alertsResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      console.error('Error fetching data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchAllData()
  }

  const getEquipmentPrediction = async (equipmentId: string): Promise<PredictionResult> => {
    try {
      return await miningAPI.predictEquipmentHealth(equipmentId)
    } catch (err) {
      console.error('Error getting prediction:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchAllData()

    // Set up real-time updates (polling every 30 seconds)
    const interval = setInterval(fetchAllData, 30000)

    return () => clearInterval(interval)
  }, [])

  const value: DataContextType = {
    miningData,
    predictions,
    metrics,
    alerts,
    isLoading,
    error,
    refreshData,
    getEquipmentPrediction
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
