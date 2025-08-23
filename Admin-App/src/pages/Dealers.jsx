import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  User,
  Mail,
  Phone,
  Building,
  X,
  Users,
  UserCheck,
  UserX,
  TrendingUp
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

const Dealers = () => {
  const [dealers, setDealers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedDealer, setSelectedDealer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [dealerIdToReject, setDealerIdToReject] = useState(null)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [dealerIdToApprove, setDealerIdToApprove] = useState(null)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [stats, setStats] = useState({
    totalDealers: 0,
    approvedDealers: 0,
    pendingDealers: 0,
    rejectedDealers: 0
  })

  useEffect(() => {
    fetchDealers()
    fetchDealerStats()
  }, [currentPage, statusFilter])

  const fetchDealerStats = async () => {
    try {
      // Calculate stats from dealers data or fetch from API
      const totalDealers = dealers.length
      const approvedDealers = dealers.filter(d => d.status === 'approved').length
      const pendingDealers = dealers.filter(d => d.status === 'pending').length
      const rejectedDealers = dealers.filter(d => d.status === 'rejected').length
      
      setStats({
        totalDealers,
        approvedDealers,
        pendingDealers,
        rejectedDealers
      })
    } catch (error) {
      console.error('Failed to fetch dealer stats:', error)
    }
  }

  const fetchDealers = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined
      }
      
      const response = await axios.get(API_ENDPOINTS.DEALERS, { params })
      console.log("fhdjdf",response.data)
      setDealers(response.data.dealers.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)))
      setTotalPages(response.data.totalPages)
      
      // Update stats after fetching dealers
      setTimeout(() => {
        fetchDealerStats()
      }, 100)
    } catch (error) {
      toast.error('Failed to load dealers')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (dealerId) => {
    try {
      const response = await axios.put(API_ENDPOINTS.APPROVE_DEALER(dealerId), {})
      toast.success('Dealer approved successfully')
      fetchDealers()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          `Failed to approve dealer${error.response?.status ? ` (${error.response.status})` : ''}`
      toast.error(errorMessage)
    }
  }

  const handleReject = async (dealerId, reason) => {
    if (!reason) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      await axios.put(API_ENDPOINTS.REJECT_DEALER(dealerId), { reason })
      toast.success('Dealer rejected successfully')
      fetchDealers()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          `Failed to reject dealer${error.response?.status ? ` (${error.response.status})` : ''}`
      toast.error(errorMessage)
    }
  }

  const openRejectModal = (dealerId) => {
    setDealerIdToReject(dealerId)
    setRejectReason('')
    setIsRejectModalOpen(true)
  }

  const closeRejectModal = () => {
    setIsRejectModalOpen(false)
    setDealerIdToReject(null)
    setRejectReason('')
  }

  const openApproveModal = (dealerId) => {
    setDealerIdToApprove(dealerId)
    setIsApproveModalOpen(true)
  }

  const closeApproveModal = () => {
    setIsApproveModalOpen(false)
    setDealerIdToApprove(null)
  }

  const confirmApprove = async () => {
    if (dealerIdToApprove) {
      setIsApproving(true)
      try {
        await handleApprove(dealerIdToApprove)
        closeApproveModal()
      } finally {
        setIsApproving(false)
      }
    }
  }

  const handleViewDetails = async (dealerId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.DEALER_DETAILS(dealerId))
      setSelectedDealer(response.data)
      setShowModal(true)
    } catch (error) {
      toast.error('Failed to load dealer details')
    }
  }

  // Test API connectivity
  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...')
      const response = await axios.get(API_ENDPOINTS.DASHBOARD)
      console.log('API test successful:', response.data)
      toast.success('API connection successful')
    } catch (error) {
      console.error('API test failed:', error)
      const message = error.response?.data?.message || 'API connection failed'
      toast.error(message)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
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

  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = dealer.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.contactPersonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealers Overview</h1>
          <p className="text-gray-500 text-sm">Manage dealer registrations and approvals</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Dealers</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.totalDealers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Approved Dealers</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.approvedDealers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Approval</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.pendingDealers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Rejected Dealers</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.rejectedDealers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search dealers..."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dealers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      DEALER
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      CONTACT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      GST NUMBER
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      STATUS
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      REGISTRATION DATE
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredDealers.map((dealer) => (
                    <tr key={dealer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center border border-gray-200">
                              <span className="text-sm font-medium text-blue-700">
                                {dealer.companyName?.charAt(0)?.toUpperCase() || 'D'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {dealer.companyName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dealer.contactPersonName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {dealer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {dealer.mobile}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {dealer.gst || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(dealer.status)}`}>
                          {getStatusIcon(dealer.status)}
                          <span className="ml-1 capitalize">{dealer.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(dealer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleViewDetails(dealer._id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {dealer.status === 'pending' && (
                            <>
                                                             <button
                                 onClick={() => openApproveModal(dealer._id)}
                                 className="text-green-600 hover:text-green-800 transition-colors"
                                 title="Approve"
                                 disabled={isApproving}
                               >
                                 <CheckCircle className="h-4 w-4" />
                               </button>
                                                             <button
                                 onClick={() => openRejectModal(dealer._id)}
                                 className="text-red-600 hover:text-red-800 transition-colors"
                                 title="Reject"
                                 disabled={isRejecting}
                               >
                                 <XCircle className="h-4 w-4" />
                               </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDealers.length === 0 && (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No dealers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No dealers match your current filters.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Dealer Details Modal */}
      {showModal && selectedDealer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Dealer Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDealer.companyName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDealer.contactPersonName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDealer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDealer.mobile}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDealer.gst || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDealer.status)}`}>
                    {getStatusIcon(selectedDealer.status)}
                    <span className="ml-1">{selectedDealer.status}</span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDealer.address}</p>
              </div>

              {selectedDealer.enquiries && selectedDealer.enquiries.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recent Enquiries</label>
                  <div className="space-y-2">
                    {selectedDealer.enquiries.slice(0, 5).map((enquiry) => (
                      <div key={enquiry._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{enquiry.productName}</p>
                          <p className="text-xs text-gray-500">Qty: {enquiry.quantity}</p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                          {enquiry.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Approve Dealer</h3>
              <button onClick={closeApproveModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Confirm Approval</h3>
              <p className="text-sm text-gray-600 text-center">
                Are you sure you want to approve this dealer? This action will grant them access to the platform.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeApproveModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
                             <button
                 onClick={confirmApprove}
                 disabled={isApproving}
                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isApproving ? (
                   <div className="flex items-center justify-center">
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                     Approving...
                   </div>
                 ) : (
                   'Approve Dealer'
                 )}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reject Dealer</h3>
              <button onClick={closeRejectModal} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Please provide a reason for rejecting this dealer.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
              placeholder="Enter rejection reason"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                                 onClick={async () => {
                   if (dealerIdToReject && rejectReason.trim()) {
                     setIsRejecting(true)
                     try {
                       await handleReject(dealerIdToReject, rejectReason.trim())
                       closeRejectModal()
                     } finally {
                       setIsRejecting(false)
                     }
                   } else {
                     toast.error('Please provide a reason for rejection')
                   }
                 }}
                 disabled={isRejecting}
                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {isRejecting ? (
                   <div className="flex items-center justify-center">
                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                     Rejecting...
                   </div>
                 ) : (
                   'Reject Dealer'
                 )}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dealers