import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Dealers from './pages/Dealers'
import Enquiries from './pages/Enquiries'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="dealers" element={<Dealers />} />
        <Route path="enquiries" element={<Enquiries />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App 