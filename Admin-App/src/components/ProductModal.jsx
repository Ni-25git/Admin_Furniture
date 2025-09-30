import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { X, Upload, Trash2, Plus } from 'lucide-react'
import { API_ENDPOINTS, buildApiUrl } from '../config/api'

// Category → Sub-Category mapping
const SUB_CATEGORIES = {
  'Chairs': [
    'Low Back Chair',
    'W/O Arm Chair',
    'Premium Chair Glossy',
    'Premium Chair Matt Glossy',
    'Warranty Chair Premium',
    'Mid Back Chair',
    'High Back Chair',
    'Square Back Chair',
    'Double Color Back Chair'
  ],
  'Tables': [
    'FixTable',
    'FoldingTable'
  ],
  'Kids Tange': [
    'Chair',
    'Table'
  ],
  'Stools': [],
  'Set of Chair & Table': []
}

const ProductModal = ({ product, onClose, onSaved }) => {
  console.log('ProductModal opened with product:',)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    productCode: '',
    productName: '',
    category: '',
    subCategory: '',
    description: '',
    price: '',
    colors: [],
    images: [],
    specifications: {},
    warranty: '',
    stockQuantity: ''
  })
  const [loading, setLoading] = useState(false)
  const [newColor, setNewColor] = useState('')
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [isEditing] = useState(!!product)
  const [categories, setCategories] = useState([  'Chairs',
      'Tables', 
      'Kids Tange',
      'Stools',
      'Set of Chair & Table'])
  // Derive sub-categories based on selected category
  const currentSubCategories = SUB_CATEGORIES[formData.category] || []

  useEffect(() => {
    if (product) {
      setFormData({
        productCode: product.productCode || '',
        productName: product.productName || '',
        category: product.category || '',
        subCategory: product.subCategory || '',
        description: product.description || '',
        price: product.price || '',
        colors: product.colors || [],
        images: product.images || [],
        specifications: product.specifications || {},
        warranty: product.warranty || '',
        stockQuantity: product.stockQuantity || ''
      })
    }
  }, [product])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Reset sub-category when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subCategory: ''
      }))
      return
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (e) => {
    const fileList = e.target.files
    if (!fileList || fileList.length === 0) return

    setLoading(true)
    try {
      const tryUpload = async (fieldName) => {
        const fd = new FormData()
        Array.from(fileList).forEach((file) => {
          fd.append(fieldName, file)
        })
        console.log(`Uploading ${fileList.length} file(s) as field:`, fieldName)
        return axios.post(buildApiUrl(API_ENDPOINTS.UPLOAD_IMAGES), fd, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }

      console.log('Upload URL:', buildApiUrl(API_ENDPOINTS.UPLOAD_IMAGES))

      let response
      try {
        // First attempt: common multi-file field
        response = await tryUpload('images')
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || ''
        console.warn('Upload failed with field "images". Message:', msg)
        if (/Unexpected field/i.test(msg)) {
          // Retry with single-file field name
          response = await tryUpload('image')
        } else {
          throw err
        }
      }

      console.log('Upload response data:', response?.data)
      const data = response?.data
      const extractUrls = (payload) => {
        if (!payload) return []
        if (Array.isArray(payload)) {
          return payload
            .map(item => (typeof item === 'string' ? item : (item?.url || item?.Location || item?.path)))
            .filter(Boolean)
        }
        const candidates = [
          payload.urls,
          payload.images,
          payload.files,
          payload.result,
          // Common API envelope: { success: true, data: [...] }
          payload.data,
          payload.data?.urls,
          payload.data?.images,
          payload.data?.files
        ]
        for (const maybeArr of candidates) {
          if (Array.isArray(maybeArr)) {
            const normalized = maybeArr
              .map(item => (typeof item === 'string' ? item : (item?.url || item?.Location || item?.path)))
              .filter(Boolean)
            if (normalized.length) return normalized
          }
        }
        if (typeof payload.url === 'string') return [payload.url]
        if (typeof payload.Location === 'string') return [payload.Location]
        if (typeof payload.path === 'string') return [payload.path]
        return []
      }
      const newUrls = extractUrls(data)
      console.log('Extracted image URLs:', newUrls)

      if (newUrls.length > 0) {
        setFormData(prev => {
          const updated = {
            ...prev,
            images: [...prev.images, ...newUrls]
          }
          console.log('Updated images array:', updated.images)
          return updated
        })
      }
      toast.success('Images uploaded successfully')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload images'
      toast.error(message)
    } finally {
      setLoading(false)
      e.target.value = null
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addColor = () => {
    if (newColor.trim()) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }))
      setNewColor('')
    }
  }

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim()
        }
      }))
      setNewSpecKey('')
      setNewSpecValue('')
    }
  }

  const removeSpecification = (key) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return {
        ...prev,
        specifications: newSpecs
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        console.log('Submitting update payload:', formData)
        await axios.put(buildApiUrl(`${API_ENDPOINTS.PRODUCTS}/${product._id}`), formData)
        toast.success('Product updated successfully')
      } else {
        console.log('Submitting create payload:', formData)
        await axios.post(buildApiUrl(API_ENDPOINTS.PRODUCTS), formData)
        toast.success('Product created successfully')
      }
      onSaved()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save product'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Code *
              </label>
              <input
                type="text"
                name="productCode"
                value={formData.productCode}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub Category (depends on Category) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sub Category {currentSubCategories.length > 0 ? '*' : ''}
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                disabled={!formData.category || currentSubCategories.length === 0}
                required={!!formData.category && currentSubCategories.length > 0}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">{!formData.category ? 'Select category first' : (currentSubCategories.length ? 'Select Sub Category' : 'No sub categories')}</option>
                {currentSubCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Warranty
              </label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                placeholder="e.g., 1 year"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Add color"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addColor}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  {color}
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload images
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                      ref={fileInputRef}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer group"
                    onClick={() => window.open(image, '_blank', 'noopener,noreferrer')}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(index) }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specifications
            </label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 mb-2">
              <input
                type="text"
                value={newSpecKey}
                onChange={(e) => setNewSpecKey(e.target.value)}
                placeholder="Specification name"
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Specification value"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">
                    <strong>{key}:</strong> {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSpecification(key)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductModal 

