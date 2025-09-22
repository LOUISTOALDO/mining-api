"use client"

import { DraggableDashboard } from "@/components/dashboard/draggable-dashboard"
import { DataProvider } from "@/contexts/data-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
  const { logout } = useAuth()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if logout parameter is present
    const shouldLogout = searchParams.get('logout')
    if (shouldLogout === 'true') {
      logout()
    }
  }, [searchParams, logout])

  return (
    <ProtectedRoute>
      <DataProvider>
        <DraggableDashboard />
      </DataProvider>
    </ProtectedRoute>
  )
}
