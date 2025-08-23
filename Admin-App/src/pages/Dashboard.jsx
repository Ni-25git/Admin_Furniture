import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Users, 
  Package, 
  MessageSquare, 
  Clock,
  CheckCircle,
  User
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentDealers, setRecentDealers] = useState([])
  const [recentEnquiries, setRecentEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

    const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await axios.get(API_ENDPOINTS.DASHBOARD)
      const data = statsResponse?.data?.dashboardStats
      
      setStats({
        totalDealers: data?.dealers?.total || 0,
        pendingDealers: data?.dealers?.pending || 0,
        totalProducts: data?.products?.total || 0,
        totalEnquiries: data?.enquiries?.total || 0,
        pendingEnquiries: data?.enquiries?.pending || 0,
        approvedEnquiries: data?.enquiries?.approved || 0,
        closedEnquiries: data?.enquiries?.closed || 0
      })

      setRecentDealers(data?.recentDealers?.sort((a,b) => new Date(b?.createdAt) - new Date(a?.createdAt)).slice(0,5) || [])
      setRecentEnquiries(data?.recentEnquiries?.sort((a,b) => new Date(b?.createdAt) - new Date(a?.createdAt)).slice(0,5) || [])
   
    } catch (error) {
      console.error('Failed to load dashboard data')
      // Set default values if API fails
      setStats({
        totalDealers: 0,
        totalProducts: 0,
        totalEnquiries: 0,
        pendingEnquiries: 0
      })
      setRecentDealers([])
      setRecentEnquiries([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your admin panel</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white rounded-lg border border-gray-200 p-6">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm font-medium text-gray-600">Total Dealers</p>
               <p className="text-3xl font-bold text-gray-900">{stats?.totalDealers || 0}</p>
               <p className="text-sm text-gray-500 mt-1">Pending: {stats?.pendingDealers || 0}</p>
             </div>
             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
               <Users className="w-6 h-6 text-blue-600" />
             </div>
           </div>
         </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalProducts || 17}</p>
              <p className="text-sm text-gray-500 mt-1">Active: 17</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalEnquiries}</p>
              <p className="text-sm text-gray-500 mt-1">Pending: 7</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Enquiries</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.approvedEnquiries}</p>
              <p className="text-sm text-gray-500 mt-1">Closed: {stats?.closedEnquiries}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Recent Dealers */}
         <div className="bg-white rounded-lg border border-gray-200 p-6">
           <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Dealers</h3>
           <div className="space-y-4">
             {recentDealers && recentDealers.length > 0 ? (
               recentDealers.map((dealer) => (
                 <div key={dealer._id} className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                       <span className="text-sm font-medium text-gray-600">
                         {dealer.companyName ? dealer.companyName.charAt(0).toUpperCase() : '?'}
                       </span>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900">{dealer.companyName || 'Unnamed Dealer'}</p>
                       <p className="text-xs text-gray-500">{dealer.contactPersonName || 'No Contact'}</p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-1">
                     {dealer.status === 'approved' ? (
                       <span className="text-green-600 text-xs flex items-center">
                         <CheckCircle className="w-3 h-3 mr-1" />
                         approved
                       </span>
                     ) : (
                       <span className="text-orange-600 text-xs flex items-center">
                         <Clock className="w-3 h-3 mr-1" />
                         pending
                       </span>
                     )}
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-8">
                 <p className="text-gray-500">No dealers available</p>
               </div>
             )}
           </div>
         </div>

                 {/* Recent Enquiries */}
         <div className="bg-white rounded-lg border border-gray-200 p-6">
           <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Enquiries</h3>
           <div className="space-y-4">
             {recentEnquiries && recentEnquiries.length > 0 ? (
               recentEnquiries.map((enquiry) => (
                 <div key={enquiry._id || enquiry.id} className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                       <Package className="w-4 h-4 text-blue-600" />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-gray-900">{enquiry.productName || 'Unnamed Product'}</p>
                       <p className="text-xs text-gray-500">Qty: {enquiry.quantity || 0} • {enquiry.dealer || 'Unknown'}</p>
                     </div>
                   </div>
                   <span className="text-orange-600 text-xs flex items-center">
                     <Clock className="w-3 h-3 mr-1" />
                     pending
                   </span>
                 </div>
               ))
             ) : (
               <div className="text-center py-8">
                 <p className="text-gray-500">No enquiries available</p>
               </div>
             )}
           </div>
         </div>
      </div>
    </div>
  )
}

export default Dashboard