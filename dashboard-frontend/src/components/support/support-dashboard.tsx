"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  User,
  Calendar,
  Tag,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SupportTicket {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed'
  category: 'technical' | 'billing' | 'feature_request' | 'bug_report' | 'general'
  created_at: string
  updated_at: string
  assigned_to?: string
  sla_deadline?: string
  tags: string[]
}

interface SupportDashboardProps {
  className?: string
}

const mockTickets: SupportTicket[] = [
  {
    id: "TICKET-0001",
    customer_id: "CUST-001",
    customer_name: "John Smith",
    customer_email: "john.smith@miningcorp.com",
    subject: "Dashboard not loading properly",
    description: "The dashboard is showing blank screens and not displaying telemetry data. This started happening yesterday afternoon.",
    priority: "high",
    status: "in_progress",
    category: "technical",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T14:20:00Z",
    assigned_to: "support@miningpdm.com",
    sla_deadline: "2024-01-15T16:30:00Z",
    tags: ["dashboard", "loading", "urgent"]
  },
  {
    id: "TICKET-0002",
    customer_id: "CUST-002",
    customer_name: "Sarah Johnson",
    customer_email: "sarah.johnson@bigmining.com",
    subject: "Billing question about usage charges",
    description: "I noticed an unexpected charge on my bill for last month. Can you help me understand what this is for?",
    priority: "medium",
    status: "open",
    category: "billing",
    created_at: "2024-01-15T09:15:00Z",
    updated_at: "2024-01-15T09:15:00Z",
    sla_deadline: "2024-01-15T12:15:00Z",
    tags: ["billing", "charges"]
  },
  {
    id: "TICKET-0003",
    customer_id: "CUST-003",
    customer_name: "Mike Chen",
    customer_email: "mike.chen@megamine.com",
    subject: "Feature request: Export to Excel",
    description: "It would be great if we could export the telemetry data to Excel format. Currently we can only export to CSV.",
    priority: "low",
    status: "open",
    category: "feature_request",
    created_at: "2024-01-14T16:45:00Z",
    updated_at: "2024-01-14T16:45:00Z",
    sla_deadline: "2024-01-16T16:45:00Z",
    tags: ["export", "excel", "feature"]
  }
]

export function SupportDashboard({ className }: SupportDashboardProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewTicket, setShowNewTicket] = useState(false)

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-50 border-red-200'
      case 'high': return 'text-orange-500 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-500 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-500 bg-green-50 border-green-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-500 bg-blue-50 border-blue-200'
      case 'in_progress': return 'text-purple-500 bg-purple-50 border-purple-200'
      case 'waiting_customer': return 'text-yellow-500 bg-yellow-50 border-yellow-200'
      case 'resolved': return 'text-green-500 bg-green-50 border-green-200'
      case 'closed': return 'text-gray-500 bg-gray-50 border-gray-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'waiting_customer': return <User className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    critical: tickets.filter(t => t.priority === 'critical').length
  }

  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Support Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage customer support tickets and inquiries</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Tickets</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Open</p>
              <p className="text-2xl font-bold text-white">{stats.open}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-white">{stats.in_progress}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-white">{stats.resolved}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Critical</p>
              <p className="text-2xl font-bold text-white">{stats.critical}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'open', 'in_progress', 'resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filter === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedTicket(ticket)}
              className={cn(
                "bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 cursor-pointer transition-all hover:border-gray-600",
                selectedTicket?.id === ticket.id && "border-blue-500 bg-blue-500/10"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{ticket.subject}</h3>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      getPriorityColor(ticket.priority)
                    )}>
                      {ticket.priority}
                    </span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1",
                      getStatusColor(ticket.status)
                    )}>
                      {getStatusIcon(ticket.status)}
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{ticket.customer_name} • {ticket.customer_email}</p>
                  <p className="text-gray-300 text-sm line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {ticket.category}
                    </span>
                    {ticket.assigned_to && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ticket.assigned_to}
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 sticky top-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Ticket Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Customer</label>
                  <p className="text-white">{selectedTicket.customer_name}</p>
                  <p className="text-sm text-gray-400">{selectedTicket.customer_email}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Subject</label>
                  <p className="text-white">{selectedTicket.subject}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="text-gray-300 text-sm">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Priority</label>
                    <span className={cn(
                      "block px-2 py-1 rounded-full text-xs font-medium border mt-1",
                      getPriorityColor(selectedTicket.priority)
                    )}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <span className={cn(
                      "block px-2 py-1 rounded-full text-xs font-medium border mt-1 flex items-center gap-1",
                      getStatusColor(selectedTicket.status)
                    )}>
                      {getStatusIcon(selectedTicket.status)}
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTicket.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedTicket.sla_deadline && (
                  <div>
                    <label className="text-sm text-gray-400">SLA Deadline</label>
                    <p className="text-white text-sm">
                      {new Date(selectedTicket.sla_deadline).toLocaleString()}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                      Update Status
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors">
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
