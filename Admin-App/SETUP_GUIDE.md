# Setup Guide to Fix API Issues

## Current Issue
You're experiencing a 500 Internal Server Error when trying to approve dealers. This is likely due to API configuration issues.

## Steps to Fix

### 1. Create Environment File
Create a `.env` file in the Admin-App directory with the following content:

```env
VITE_API_BASE_URL=https://module-funturine.vercel.app/api
```

### 2. Restart Development Server
After creating the `.env` file, restart your development server:

```bash
npm run dev
```

### 3. Check Browser Console
Open your browser's developer tools (F12) and check the console for:
- API_BASE_URL configuration
- Authentication token status
- Detailed error messages when approving dealers

### 4. Test API Connection
Use the "Test API Connection" button on the Dealers page to verify API connectivity.

### 5. Verify Authentication
Make sure you're logged in as an admin. The approval requests require a valid authentication token.

## Debugging Information

The updated code now includes:
- Detailed console logging for API requests
- Better error handling with specific error messages
- API connection testing functionality
- Proper authentication header handling

## Common Issues and Solutions

### Issue: 500 Internal Server Error
**Possible Causes:**
- Backend API endpoint not implemented
- Authentication token missing or invalid
- CORS issues
- Backend server down

**Solutions:**
1. Check if you're logged in (authentication token present)
2. Verify the backend API is running
3. Check browser console for detailed error messages
4. Contact backend developer if endpoint is missing

### Issue: CORS Errors
**Solution:** The Vite configuration has been updated to handle CORS headers.

### Issue: Authentication Errors
**Solution:** Make sure you're logged in as an admin user.

## Testing Steps

1. **Login Test:** Ensure you can log in successfully
2. **API Test:** Use the "Test API Connection" button
3. **Dealer Approval Test:** Try approving a dealer and check console logs
4. **Error Analysis:** Review console output for specific error details

## Contact Support

If issues persist after following these steps, please provide:
- Console error messages
- Network tab request/response details
- Backend API status 