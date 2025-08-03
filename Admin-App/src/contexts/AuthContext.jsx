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
      if (error.response?.status === 401) {
        logout()
        toast.error('Session expired. Please login again.')
      }
      return Promise.reject(error)
    }
  )

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')
    
    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData))
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminData')
      }
    }
    setLoading(false)
  }, [])

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
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 