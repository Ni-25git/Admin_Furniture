# Admin Dashboard

A modern React-based admin dashboard for managing products, dealers, and enquiries.

## Features

- **Authentication**: Secure admin login system
- **Dashboard**: Overview with statistics and recent activities
- **Product Management**: Add, edit, delete products with image upload
- **Dealer Management**: Approve/reject dealer registrations
- **Enquiry Management**: Handle product enquiries with status updates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- React 18
- React Router DOM
- Axios for API calls
- Lucide React for icons
- React Hot Toast for notifications
- Tailwind CSS for styling
- Vite for build tooling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Configuration

The app uses the `VITE_API_BASE_URL` environment variable to configure the API endpoint. 

### Environment Setup

1. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://module-funturine.vercel.app/api
```

2. Or set as system environment variable:
```bash
export VITE_API_BASE_URL=https://module-funturine.vercel.app/api
```

For detailed setup instructions, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md).

### Default Configuration

If no environment variable is set, the app defaults to `https://module-funturine.vercel.app/api` and uses Vite's proxy configuration for development.

Make sure your backend server is running on the configured port.

## Build

To build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout with sidebar
│   └── ProductModal.jsx # Product add/edit modal
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Dashboard.jsx   # Dashboard page
│   ├── Products.jsx    # Products management
│   ├── Dealers.jsx     # Dealers management
│   ├── Enquiries.jsx   # Enquiries management
│   └── Login.jsx       # Login page
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Features Overview

### Dashboard
- Statistics cards showing totals
- Recent dealers and enquiries
- Quick overview of system status

### Products
- View all products with filtering
- Add new products with image upload
- Edit existing products
- Delete products (soft delete)
- Category and status filtering

### Dealers
- View all dealer registrations
- Approve or reject dealers
- View dealer details and history
- Search and filter functionality

### Enquiries
- View all product enquiries
- Approve, reject, or mark as under process
- Detailed enquiry information
- Status tracking and management

## Authentication

The app uses JWT tokens for authentication. Admin credentials are managed through the backend API.

## API Endpoints

All API endpoints are centralized in `src/config/api.js` and use the `VITE_API_BASE_URL` environment variable. The app connects to these backend endpoints:

- `/api/admin/login` - Admin authentication
- `/api/admin/dashboard` - Dashboard statistics
- `/api/products/admin/all` - Product management
- `/api/admin/dealers` - Dealer management
- `/api/enquiries/admin/all` - Enquiry management

For a complete list of endpoints, see `src/config/api.js`. 