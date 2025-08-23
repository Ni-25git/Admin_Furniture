import React from 'react'
import { X } from 'lucide-react'

const ModernModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  headerColor = 'bg-green-600',
  headerIcon,
  maxWidth = 'max-w-md'
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl ${maxWidth} w-full max-h-[90vh] overflow-hidden`}>
        {/* Header */}
        <div className={`${headerColor} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            {headerIcon && (
              <div className="text-white">
                {headerIcon}
              </div>
            )}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ModernModal
