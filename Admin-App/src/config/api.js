// API Configuration
// Check if we're in development or production
export const IS_DEVELOPMENT = import.meta.env.DEV
export const API_BASE_URL = IS_DEVELOPMENT
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || 'https://module-funturine.vercel.app/api')

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/admin/login',
  
  // Dashboard
  DASHBOARD: '/admin/dashboard',
  
  // Products
  PRODUCTS: '/products',
  PRODUCTS_ADMIN_ALL: '/products/admin/all',
  PRODUCTS_CATEGORIES: '/products/categories/list',
  UPLOAD_IMAGES: '/upload/images',
  
  // Dealers
  DEALERS: '/admin/dealers',
  DEALER_DETAILS: (id) => `/admin/dealers/${id}`,
  APPROVE_DEALER: (id) => `/admin/dealers/${id}/approve`,
  REJECT_DEALER: (id) => `/admin/dealers/${id}/reject`,
  
  // Enquiries
  ENQUIRIES_ADMIN_ALL: '/enquiries/admin/all',
  ENQUIRY_DETAILS: (id) => `/enquiries/admin/${id}`,
  APPROVE_ENQUIRY: (id) => `/enquiries/admin/${id}/approve`,
  REJECT_ENQUIRY: (id) => `/enquiries/admin/${id}/reject`,
  UPDATE_ENQUIRY_STATUS: (id) => `/enquiries/admin/${id}/status`,
}

// Helper function to build full API URL
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
} 