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
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    fetchProducts()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.DASHBOARD)
      setStats(response.data.dashboardStats)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PRODUCTS_ADMIN_ALL, { 
        params: { limit: 10 } 
      })
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const mockStats = {
    totalProducts: 2345,
    totalProductsChange: '+15% from last month',
    activeDealers: 420,
    activeDealersChange: '+10 new registrations',
    pendingEnquiries: 37,
    pendingEnquiriesChange: '2 new today'
  }

  const mockProducts = [
    {
      id: 1,
      name: 'SmartConnect X1',
      description: 'Latest model smartphone with AI',
      code: 'SCX1-2024',
      category: 'Electronics',
      price: 799.99,
      stock: 150,
      status: 'Active',
      image: null
    },
    {
      id: 2,
      name: 'ErgoComfort Chair',
      description: 'Adjustable office chair for maximum comfort',
      code: 'ECC-PRO',
      category: 'Home Goods',
      price: 349.00,
      stock: 75,
      status: 'Inactive',
      image: null
    },
    {
      id: 3,
      name: 'Vintage Leather Wallet',
      description: 'Handcrafted genuine leather wallet',
      code: 'VLW-M',
      category: 'Apparel',
      price: 89.50,
      stock: 200,
      status: 'Active',
      image: null
    },
    {
      id: 4,
      name: 'AeroBrew Coffee Maker',
      description: 'Programmable single-serve coffee maker',
      code: 'ABCM-100',
      category: 'Home Goods',
      price: 129.99,
      stock: 120,
      status: 'Active',
      image: null
    },
    {
      id: 5,
      name: 'Urban Explorer Backpack',
      description: 'Weather-resistant backpack with laptop compartment',
      code: 'UEB-V2',
      category: 'Apparel',
      price: 65.00,
      stock: 90,
      status: 'Discontinued',
      image: null
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Inactive':
        return 'bg-gray-100 text-gray-800'
      case 'Discontinued':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Overview */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts?.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{stats?.totalProductsChange}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Dealers</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.activeDealers}</p>
                <p className="text-sm text-gray-500 mt-1">{stats?.activeDealersChange}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Enquiries</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.pendingEnquiries}</p>
                <p className="text-sm text-gray-500 mt-1">{stats?.pendingEnquiriesChange}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Product Listing</h2>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Filter by Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Discontinued</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Filter by Category</option>
              <option>Electronics</option>
              <option>Home Goods</option>
              <option>Apparel</option>
            </select>
            <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.code}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard