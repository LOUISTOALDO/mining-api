"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { 
  Download, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useData } from "@/contexts/data-context"
import { cn } from "@/lib/utils"

interface FilterState {
  status: string[]
  equipmentType: string[]
  search: string
}

export function AdvancedDataTable() {
  const { miningData, isLoading } = useData()
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    equipmentType: [],
    search: ""
  })
  const [sortField, setSortField] = useState<string>("equipment_id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedData = useMemo(() => {
    let filtered = miningData.filter(item => {
      // Search filter
      if (filters.search && !item.equipment_id.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(item.status)) {
        return false
      }
      
      // Equipment type filter
      if (filters.equipmentType.length > 0 && !filters.equipmentType.includes(item.equipment_type)) {
        return false
      }
      
      return true
    })

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [miningData, filters, sortField, sortDirection])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType]) && prev[filterType].includes(value)
        ? (prev[filterType] as string[]).filter((item: string) => item !== value)
        : [...(Array.isArray(prev[filterType]) ? prev[filterType] : []), value]
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      equipmentType: [],
      search: ""
    })
  }

  const exportToCSV = () => {
    const headers = ["Equipment ID", "Type", "Status", "Health Score", "Production Rate", "Temperature", "Last Updated"]
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedData.map(item => [
        item.equipment_id,
        item.equipment_type,
        item.status,
        item.health_score,
        item.production_rate,
        item.temperature,
        new Date(item.timestamp).toLocaleDateString()
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mining-data-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "maintenance":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const uniqueStatuses = Array.from(new Set(miningData.map(item => item.status)))
  const uniqueTypes = Array.from(new Set(miningData.map(item => item.equipment_type)))

  if (isLoading) {
    return (
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Mining Fleet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Mining Fleet</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : ""}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <div className="space-y-2">
                  {uniqueStatuses.map(status => (
                    <label key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={() => handleFilterChange("status", status)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Equipment Type</label>
                <div className="space-y-2">
                  {uniqueTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.equipmentType.includes(type)}
                        onChange={() => handleFilterChange("equipmentType", type)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </motion.div>
        )}
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("equipment_id")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Equipment</span>
                    {sortField === "equipment_id" && (
                      sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("equipment_type")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Type</span>
                    {sortField === "equipment_type" && (
                      sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortField === "status" && (
                      sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("health_score")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Health</span>
                    {sortField === "health_score" && (
                      sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("production_rate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Production</span>
                    {sortField === "production_rate" && (
                      sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 font-medium text-gray-600 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("temperature")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Temperature</span>
                    {sortField === "temperature" && (
                      sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedData.map((item, index) => (
                <motion.tr
                  key={item.equipment_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{item.equipment_id}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.equipment_type}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${getHealthColor(item.health_score)}`}>
                      {Math.round(item.health_score * 100)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.production_rate.toFixed(1)} tons/hr</td>
                  <td className="py-3 px-4 text-gray-600">{item.temperature.toFixed(1)}°C</td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No equipment found matching your filters.</p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2">
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
