// API Configuration

// Always use .env value for base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Helpful diagnostics in console for environment
console.log('API_BASE_URL:', API_BASE_URL)
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/admin/login',
  VALIDATE_TOKEN: '/admin/validate-token',
  
  // Dashboard
  DASHBOARD: '/admin/dashboard',
  
  // Products
  PRODUCTS: '/products',
  PRODUCTS_ADMIN_ALL: '/products/admin/all',
  PRODUCTS_CATEGORIES: '/products/categories/list',
  UPLOAD_IMAGES: '/products/upload-images',
  
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
  const fullUrl = `${API_BASE_URL}${endpoint}`
  console.log('Built API URL:', fullUrl)
  return fullUrl
}