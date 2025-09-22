"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "./login-form"
import { motion } from "framer-motion"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "operator" | "viewer"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, login } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  // Check role permissions
  if (requiredRole) {
    const roleHierarchy = { viewer: 1, operator: 2, admin: 3 }
    const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : 'viewer'
    const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 1
    const requiredRoleLevel = roleHierarchy[requiredRole]

    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. Contact your administrator for access.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Required role: <span className="font-medium">{requiredRole}</span><br />
                Your role: <span className="font-medium">{userRole}</span>
              </p>
            </div>
          </motion.div>
        </div>
      )
    }
  }

  return <>{children}</>
}
