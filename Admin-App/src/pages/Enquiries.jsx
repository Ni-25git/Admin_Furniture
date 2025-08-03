import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  Package,
  User,
  Calendar,
  DollarSign,
  MessageSquare,
  X
} from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchEnquiries()
  }, [currentPage, statusFilter])

  const fetchEnquiries = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter
      }
      
      const response = await axios.get(API_ENDPOINTS.ENQUIRIES_ADMIN_ALL, { params })
      setEnquiries(response.data.enquiries)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      toast.error('Failed to load enquiries')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (enquiryId) => {
    try {
      await axios.put(API_ENDPOINTS.APPROVE_ENQUIRY(enquiryId))
      toast.success('Enquiry approved successfully')
      fetchEnquiries()
    } catch (error) {
      toast.error('Failed to approve enquiry')
    }
  }

  const handleReject = async (enquiryId, reason) => {
    if (!reason) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      await axios.put(API_ENDPOINTS.REJECT_ENQUIRY(enquiryId), { adminNotes: reason })
      toast.success('Enquiry rejected successfully')
      fetchEnquiries()
    } catch (error) {
      toast.error('Failed to reject enquiry')
    }
  }

  const handleUnderProcess = async (enquiryId) => {
    try {
      await axios.put(API_ENDPOINTS.UPDATE_ENQUIRY_STATUS(enquiryId), { 
        status: 'under_process',
        adminNotes: 'Enquiry is under process'
      })
      toast.success('Enquiry marked as under process')
      fetchEnquiries()
    } catch (error) {
      toast.error('Failed to update enquiry status')
    }
  }

  const handleViewDetails = async (enquiryId) => {
    try {
      const response = await axios.get(API_ENDPOINTS.ENQUIRY_DETAILS(enquiryId))
      setSelectedEnquiry(response.data.enquiry)
      setShowModal(true)
    } catch (error) {
      toast.error('Failed to load enquiry details')
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
      case 'under_process':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
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
      case 'under_process':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.dealer?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-600">Manage product enquiries from dealers</p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search enquiries..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_process">Under Process</option>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dealer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {enquiry.product?.images && enquiry.product.images.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={enquiry.product.images[0]}
                                alt={enquiry.productName}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.productName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enquiry.productCode}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {enquiry.dealer?.companyName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {enquiry.dealer?.contactPersonName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {enquiry.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{enquiry.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enquiry.status)}`}>
                          {getStatusIcon(enquiry.status)}
                          <span className="ml-1">{enquiry.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(enquiry._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {enquiry.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(enquiry._id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleUnderProcess(enquiry._id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Mark Under Process"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Please provide a reason for rejection:')
                                  if (reason) {
                                    handleReject(enquiry._id, reason)
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {enquiry.status === 'under_process' && (
                            <>
                              <button
                                onClick={() => handleApprove(enquiry._id)}
                                className="text-green-600 hover:text-green-900"
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const reason = prompt('Please provide a reason for rejection:')
                                  if (reason) {
                                    handleReject(enquiry._id, reason)
                                  }
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Reject"
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

            {filteredEnquiries.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No enquiries found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No enquiries match your current filters.
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

      {/* Enquiry Details Modal */}
      {showModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Enquiry Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Product Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Product Information</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Product Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.productName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Product Code</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.productCode}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Category</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.product?.category}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Color</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.productColor || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Dealer Information</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Company Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.dealer?.companyName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Contact Person</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.dealer?.contactPersonName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.dealer?.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Mobile</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.dealer?.mobile}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">GST Number</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.dealer?.gst || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.dealer?.address}</p>
                  </div>
                </div>
              </div>

              {/* Enquiry Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Enquiry Details</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Quantity</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.quantity}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Price</label>
                    <p className="mt-1 text-sm text-gray-900">₹{selectedEnquiry.price}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEnquiry.status)}`}>
                      {getStatusIcon(selectedEnquiry.status)}
                      <span className="ml-1">{selectedEnquiry.status}</span>
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Enquiry Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedEnquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedEnquiry.processedAt && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Processed Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedEnquiry.processedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedEnquiry.processedBy && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Processed By</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedEnquiry.processedBy.username}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Remarks */}
              {selectedEnquiry.remarks && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Dealer Remarks</h4>
                  <p className="text-sm text-gray-900">{selectedEnquiry.remarks}</p>
                </div>
              )}

              {/* Admin Notes */}
              {selectedEnquiry.adminNotes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Admin Notes</h4>
                  <p className="text-sm text-gray-900">{selectedEnquiry.adminNotes}</p>
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
    </div>
  )
}

export default Enquiries 