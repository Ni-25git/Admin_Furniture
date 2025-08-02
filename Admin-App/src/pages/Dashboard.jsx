import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Users, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/admin/dashboard')
      setStats(response.data.dashboardStats)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Dealers',
      value: stats.dealers.total,
      change: stats.dealers.pending,
      changeType: 'pending',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      name: 'Total Products',
      value: stats.products.total,
      change: stats.products.active,
      changeType: 'active',
      icon: Package,
      color: 'bg-green-500'
    },
    {
      name: 'Total Enquiries',
      value: stats.enquiries.total,
      change: stats.enquiries.pending,
      changeType: 'pending',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      name: 'Pending Enquiries',
      value: stats.enquiries.pending,
      change: stats.enquiries.underProcess,
      changeType: 'under_process',
      icon: Clock,
      color: 'bg-yellow-500'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your admin panel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${stat.color} text-white`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className="text-gray-500">
                  {stat.changeType === 'pending' ? 'Pending: ' : 'Active: '}
                </span>
                <span className="font-medium text-gray-900">
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Dealers */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Dealers
            </h3>
            <div className="space-y-4">
              {stats.recentDealers.map((dealer) => (
                <div key={dealer._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {dealer.companyName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {dealer.companyName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {dealer.contactPersonName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(dealer.status)}`}>
                      {getStatusIcon(dealer.status)}
                      <span className="ml-1">{dealer.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Enquiries
            </h3>
            <div className="space-y-4">
              {stats.recentEnquiries.map((enquiry) => (
                <div key={enquiry._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {enquiry.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {enquiry.quantity} • {enquiry.dealer?.companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                      {getStatusIcon(enquiry.status)}
                      <span className="ml-1">{enquiry.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.dealers.approved}</p>
              <p className="text-sm text-gray-500">Approved Dealers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.products.active}</p>
              <p className="text-sm text-gray-500">Active Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.enquiries.approved}</p>
              <p className="text-sm text-gray-500">Approved Enquiries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.enquiries.pending}</p>
              <p className="text-sm text-gray-500">Pending Enquiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 