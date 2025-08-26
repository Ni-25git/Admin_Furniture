import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Configure axios defaults
  axios.defaults.baseURL = API_BASE_URL
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  axios.defaults.withCredentials = true

  // Add token to requests if available
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('Axios interceptor error:', error.response?.status, error.response?.data)
      
      // Don't logout for token validation requests to avoid infinite loops
      if (error.response?.status === 401 && !error.config?.url?.includes('validate-token')) {
        console.log('401 error detected, logging out user')
        logout()
        toast.error('Session expired. Please login again.')
      }
      return Promise.reject(error)
    }
  )

  // Validate token with server
  const validateToken = async (token) => {
    try {
      const response = await axios.get(API_ENDPOINTS.VALIDATE_TOKEN, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('Token validation response:', response.data)
      
      // Check if the response has the expected structure
      if (response.data.success && response.data.data && response.data.data.admin) {
        return response.data.data.admin
      } else if (response.data.admin) {
        // Fallback for different response structure
        return response.data.admin
      }
      
      return null
    } catch (error) {
      console.log('Token validation error:', error.response?.data || error.message)
      // If validation endpoint doesn't exist (404) or token is invalid (401), return null
      if (error.response?.status === 404) {
        // Endpoint doesn't exist, fall back to localStorage data
        const adminData = localStorage.getItem('adminData')
        return adminData ? JSON.parse(adminData) : null
      }
      // For any other error (including 401), return null
      return null
    }
  }

  useEffect(() => {
    // Check for existing token on page reload
    const checkExistingAuth = async () => {
      const token = localStorage.getItem('adminToken')
      const adminData = localStorage.getItem('adminData')
      
      console.log('Checking existing auth...', { hasToken: !!token, hasAdminData: !!adminData })
      
      if (token && adminData) {
        try {
          console.log('Validating token...')
          const validAdmin = await validateToken(token)
          console.log('Validation result:', validAdmin)
          
          if (validAdmin) {
            console.log('Token is valid, restoring auth state')
            setAdmin(validAdmin)
            setIsAuthenticated(true)
            localStorage.setItem('adminData', JSON.stringify(validAdmin))
            console.log('Auth state restored successfully')
          } else {
            console.log('Token is invalid, clearing storage')
            logout()
          }
        } catch (error) {
          console.log('Error validating token:', error)
          // Handle error silently and clear storage
          logout()
        }
      } else {
        console.log('No token or admin data found')
      }
      setLoading(false)
    }

    checkExistingAuth()
  }, [])

  // Debug: Monitor authentication state changes
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, admin, loading })
  }, [isAuthenticated, admin, loading])

  // Function to manually restore auth state (for when user is on protected route)
  const restoreAuth = async () => {
    const token = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')
    
    if (token && adminData) {
      try {
        const validAdmin = await validateToken(token)
        if (validAdmin) {
          setAdmin(validAdmin)
          setIsAuthenticated(true)
          localStorage.setItem('adminData', JSON.stringify(validAdmin))
          return true
        }
      } catch (error) {
        // Handle error silently
      }
    }
    return false
  }

  const login = async (username, password) => {
    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, { username, password })
      const { token, admin } = response.data
      
      localStorage.setItem('adminToken', token)
      localStorage.setItem('adminData', JSON.stringify(admin))
      
      setAdmin(admin)
      setIsAuthenticated(true)
      
      toast.success('Login successful!')
      return true
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    setAdmin(null)
    setIsAuthenticated(false)
  }

  const value = {
    admin,
    isAuthenticated,
    loading,
    login,
    logout,
    restoreAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 