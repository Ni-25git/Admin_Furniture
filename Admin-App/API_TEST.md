# API Connection Test Guide

## Backend URL Updated
The application has been updated to use the correct backend URL:
- **Backend URL**: `https://module-funturine.vercel.app/api`

## How to Test

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Open Browser
Navigate to: `http://localhost:3000`

### 3. Test API Connection
1. Open browser developer tools (F12)
2. Go to the Console tab
3. Look for API configuration logs:
   - `API_BASE_URL: https://module-funturine.vercel.app/api`
   - `IS_DEVELOPMENT: true`

### 4. Test Login
1. Try to log in with admin credentials
2. Check console for API requests
3. Verify authentication token is received

### 5. Test Dealer Approval
1. Go to the Dealers page
2. Click "Test API Connection" button
3. Try to approve a dealer
4. Check console for detailed logs

## Expected Console Output
```
API_BASE_URL: https://module-funturine.vercel.app/api
IS_DEVELOPMENT: true
VITE_API_BASE_URL: undefined
Built API URL: https://module-funturine.vercel.app/api/admin/dealers/...
```

## Troubleshooting

### If API calls fail:
1. Check if the backend is accessible: `https://module-funturine.vercel.app/api`
2. Verify CORS is enabled on the backend
3. Check authentication token is present
4. Review console error messages

### If the app doesn't start:
1. Make sure all dependencies are installed: `npm install`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check for port conflicts on 3000

## API Endpoints Being Used
- Login: `POST /admin/login`
- Dashboard: `GET /admin/dashboard`
- Dealers: `GET /admin/dealers`
- Approve Dealer: `PUT /admin/dealers/{id}/approve`
- Reject Dealer: `PUT /admin/dealers/{id}/reject` 