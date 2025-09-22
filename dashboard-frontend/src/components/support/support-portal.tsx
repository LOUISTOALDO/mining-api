"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SupportPortalProps {
  className?: string
}

interface Ticket {
  id: string
  status: string
  created: string
  lastUpdate: string
  assignedTo: string
}

export function SupportPortal({ className }: SupportPortalProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    priority: 'medium',
    category: 'technical',
    description: '',
    phone: ''
  })

  const [ticketId, setTicketId] = useState('')
  const [existingTicket, setExistingTicket] = useState<Ticket | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with the actual support system
    console.log('Submitting ticket:', formData)
    // Generate a mock ticket ID
    const mockTicketId = `TICKET-${Date.now().toString().slice(-4)}`
    setTicketId(mockTicketId)
  }

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would look up the existing ticket
    console.log('Looking up ticket:', ticketId)
    // Mock existing ticket data
    setExistingTicket({
      id: ticketId,
      status: 'in_progress',
      created: '2024-01-15T10:30:00Z',
      lastUpdate: '2024-01-15T14:20:00Z',
      assignedTo: 'support@miningpdm.com'
    })
  }

  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Customer Support Portal</h1>
        <p className="text-gray-400">Get help with your Mining PDM system</p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center"
        >
          <div className="p-3 bg-blue-500/20 rounded-full w-fit mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Submit Ticket</h3>
          <p className="text-gray-400 text-sm mb-4">Create a support ticket for technical issues, billing questions, or feature requests</p>
          <button
            onClick={() => setActiveTab('new')}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Create Ticket
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center"
        >
          <div className="p-3 bg-green-500/20 rounded-full w-fit mx-auto mb-4">
            <FileText className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Check Status</h3>
          <p className="text-gray-400 text-sm mb-4">Track the status of your existing support tickets</p>
          <button
            onClick={() => setActiveTab('existing')}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Check Ticket
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 text-center"
        >
          <div className="p-3 bg-purple-500/20 rounded-full w-fit mx-auto mb-4">
            <Phone className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Emergency Support</h3>
          <p className="text-gray-400 text-sm mb-4">For critical issues affecting operations, call our 24/7 support line</p>
          <a
            href="tel:+1-800-MINING-PDM"
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-block"
          >
            Call Now
          </a>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'new' ? (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Create Support Ticket</h2>
            
            {ticketId ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Ticket Created Successfully!</h3>
                <p className="text-gray-400 mb-4">Your support ticket has been created and our team will respond within the SLA timeframe.</p>
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-400">Ticket ID</p>
                  <p className="text-lg font-mono text-white">{ticketId}</p>
                </div>
                <button
                  onClick={() => {
                    setTicketId('')
                    setFormData({
                      name: '',
                      email: '',
                      company: '',
                      subject: '',
                      priority: 'medium',
                      category: 'technical',
                      description: '',
                      phone: ''
                    })
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low - General inquiry</option>
                      <option value="medium">Medium - Standard issue</option>
                      <option value="high">High - Urgent issue</option>
                      <option value="critical">Critical - System down</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="bug_report">Bug Report</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      name: '',
                      email: '',
                      company: '',
                      subject: '',
                      priority: 'medium',
                      category: 'technical',
                      description: '',
                      phone: ''
                    })}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Check Ticket Status</h2>
            
            {existingTicket ? (
              <div className="space-y-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Ticket Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Ticket ID</p>
                      <p className="text-white font-mono">{existingTicket.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                        <Clock className="w-3 h-3" />
                        {existingTicket.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Created</p>
                      <p className="text-white">{new Date(existingTicket.created).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Last Update</p>
                      <p className="text-white">{new Date(existingTicket.lastUpdate).toLocaleString()}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-400">Assigned To</p>
                      <p className="text-white">{existingTicket.assignedTo}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setExistingTicket(null)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Check Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleLookup} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ticket ID
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your ticket ID (e.g., TICKET-0001)"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    You can find your ticket ID in the confirmation email we sent you.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Check Status
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>

      {/* Contact Information */}
      <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Other Ways to Contact Us</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email Support</p>
              <p className="text-white">support@miningpdm.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Phone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone Support</p>
              <p className="text-white">+1-800-MINING-PDM</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Business Hours</p>
              <p className="text-white">24/7 for Critical Issues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
