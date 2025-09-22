"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  email: string
  username: string
  full_name: string
  name?: string
  avatar?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at?: string
  last_login?: string
  roles: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Simple token validation
  const isTokenValid = (token: string): boolean => {
    try {
      // Basic JWT token validation - check if it has 3 parts separated by dots
      const parts = token.split('.')
      return parts.length === 3
    } catch {
      return false
    }
  }

  // Check for existing token on mount
  useEffect(() => {
    // Check if this is a logout request
    const urlParams = new URLSearchParams(window.location.search)
    const shouldLogout = urlParams.get('logout')
    
    if (shouldLogout === 'true') {
      // Clear all auth data
      setToken(null)
      setUser(null)
      setIsLoading(false)
      localStorage.removeItem('auth_token')
      // Remove the logout parameter from URL
      window.history.replaceState({}, document.title, window.location.pathname)
      console.log('Logout requested - cleared auth data')
      return
    }
    
    // Check for existing token in localStorage
    const existingToken = localStorage.getItem('auth_token')
    if (existingToken && isTokenValid(existingToken)) {
      setToken(existingToken)
      // Try to get user info
      fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${existingToken}`,
          ...(API_BASE_URL.includes('ngrok') && { 'ngrok-skip-browser-warning': 'true' }),
        },
      })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Failed to fetch user info')
      })
      .then(userData => {
        setUser(userData)
        setIsLoading(false)
      })
      .catch(() => {
        setToken(null)
        setUser(null)
        setIsLoading(false)
        localStorage.removeItem('auth_token')
      })
    } else {
      setToken(null)
      setUser(null)
      setIsLoading(false)
    }
    
    console.log('Auth context initialized - user:', user, 'token:', existingToken ? 'exists' : 'none', 'isLoading:', isLoading)
    console.log('URL params:', window.location.search)
    console.log('Should logout:', urlParams.get('logout'))
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log('Attempting login with:', email, 'to:', `${API_BASE_URL}/token`)
      
      const response = await fetch(`${API_BASE_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...(API_BASE_URL.includes('ngrok') && { 'ngrok-skip-browser-warning': 'true' }),
        },
        body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Login failed:', response.status, errorText)
        throw new Error(`Login failed: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log('Login successful, received token')
      
      // Store token
      localStorage.setItem('auth_token', data.access_token)
      setToken(data.access_token)
      
      // Get user details from /auth/me endpoint
      try {
        const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
            ...(API_BASE_URL.includes('ngrok') && { 'ngrok-skip-browser-warning': 'true' }),
          },
        })
        
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
        } else {
          // Fallback if /auth/me fails
          setUser({
            id: 1,
            email: email,
            username: email.split('@')[0],
            full_name: 'User',
            is_active: true,
            is_superuser: false,
            created_at: new Date().toISOString(),
            roles: []
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        // Fallback user object
        setUser({
          id: 1,
          email: email,
          username: email.split('@')[0],
          full_name: 'User',
          is_active: true,
          is_superuser: false,
          created_at: new Date().toISOString(),
          roles: []
        })
      }
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    if (!token) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(API_BASE_URL.includes('ngrok') && { 'ngrok-skip-browser-warning': 'true' }),
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // If /auth/me fails, keep existing user - don't change anything
        console.warn('Failed to fetch user details, keeping existing user')
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      // Keep existing user - don't change anything
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    refreshUser,
  }
  
  // Debug logging
  console.log('Auth Context State:', { 
    hasUser: !!user, 
    hasToken: !!token, 
    isAuthenticated: !!user && !!token,
    isLoading 
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
