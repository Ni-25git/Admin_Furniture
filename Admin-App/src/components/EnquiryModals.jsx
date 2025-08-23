import React, { useState } from 'react'
import { Calendar, Package, User, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import ModernModal from './ModernModal'

// Under Process Modal
export const UnderProcessModal = ({ isOpen, onClose, onConfirm, enquiry }) => {
  const [processDate, setProcessDate] = useState(new Date().toISOString().split('T')[0])
  const [adminNotes, setAdminNotes] = useState('')

  const handleConfirm = () => {
    onConfirm(enquiry?._id, { processDate, adminNotes })
    onClose()
  }

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Enquiry Under Process"
      headerColor="bg-green-600"
      headerIcon={<Clock className="h-5 w-5" />}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Please confirm the details and select a date to mark this enquiry as under process.
        </p>

        {/* Enquiry Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Enquiry Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Customer Name</span>
              <p className="font-medium">{enquiry?.dealer?.contactPersonName || 'Alice Johnson'}</p>
            </div>
            <div>
              <span className="text-gray-500">Enquiry Date</span>
              <p className="font-medium">
                {enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'March 10, 2024'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
              <Package className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-sm">{enquiry?.productName || 'Modern Lounge Chair'}</p>
            </div>
          </div>
        </div>

        {/* Process Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Process Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={processDate}
              onChange={(e) => setProcessDate(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Customer requested update on delivery timeline. Confirmed availability of fabric swatch samples."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Mark Under Process
          </button>
        </div>
      </div>
    </ModernModal>
  )
}

// Reject Modal
export const RejectEnquiryModal = ({ isOpen, onClose, onConfirm, enquiry }) => {
  const [selectedReason, setSelectedReason] = useState('')

  const reasons = [
    'Out of stock',
    'Product discontinued',
    'Unable to meet delivery timeline',
    'Price negotiation failed',
    'Customer requirements not feasible',
    'Other'
  ]

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(enquiry?._id, selectedReason)
      onClose()
    }
  }

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Product Enquiry"
      headerColor="bg-orange-500"
      headerIcon={<AlertTriangle className="h-5 w-5" />}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Please provide a reason for rejecting this product enquiry. This information will help in internal tracking and communicating with the customer if necessary.
        </p>

        {/* Enquiry Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Enquiry Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Customer Name:</span>
              <p className="font-medium">{enquiry?.dealer?.contactPersonName || 'Alice Johnson'}</p>
            </div>
            <div>
              <span className="text-gray-500">Product:</span>
              <p className="font-medium">{enquiry?.productName || 'Vintage Leather Armchair - Model L-45'}</p>
            </div>
            <div>
              <span className="text-gray-500">Enquiry Date:</span>
              <p className="font-medium">
                {enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString() : 'February 18, 2024'}
              </p>
            </div>
          </div>
        </div>

        {/* Reason Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Reason for Rejection</label>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <label key={reason} className="flex items-center">
                <input
                  type="radio"
                  name="reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{reason}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reject Enquiry
          </button>
        </div>
      </div>
    </ModernModal>
  )
}

// Approve Modal
export const ApproveEnquiryModal = ({ isOpen, onClose, onConfirm, enquiry }) => {
  const handleConfirm = () => {
    onConfirm(enquiry?._id)
    onClose()
  }

  return (
    <ModernModal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Product Enquiry"
      headerColor="bg-green-600"
      headerIcon={<CheckCircle2 className="h-5 w-5" />}
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Confirm the approval of this product enquiry. The customer will be notified of the approval status.
        </p>

        {/* Enquiry Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Enquiry Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Customer Name:</span>
              <p className="font-medium">{enquiry?.dealer?.contactPersonName || 'Alice Johnson'}</p>
            </div>
            <div>
              <span className="text-gray-500">Product:</span>
              <p className="font-medium">{enquiry?.productName || 'Modern Lounge Chair'}</p>
            </div>
            <div>
              <span className="text-gray-500">Quantity:</span>
              <p className="font-medium">{enquiry?.quantity || '2'}</p>
            </div>
            <div>
              <span className="text-gray-500">Price:</span>
              <p className="font-medium">₹{enquiry?.price || '25,000'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Approve Enquiry
          </button>
        </div>
      </div>
    </ModernModal>
  )
}
