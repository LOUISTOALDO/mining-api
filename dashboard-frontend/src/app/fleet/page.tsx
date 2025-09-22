"use client"

import { AdvancedDataTable } from "@/components/advanced-data-table"
import { DataProvider } from "@/contexts/data-context"

export default function FleetPage() {
  return (
    <DataProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600">
            Monitor and manage your mining equipment fleet with advanced analytics and real-time insights.
          </p>
        </div>

        {/* Advanced Data Table */}
        <AdvancedDataTable />
      </div>
    </DataProvider>
  )
}
