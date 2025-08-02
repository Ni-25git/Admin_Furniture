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

The app is configured to proxy API calls to `http://localhost:5000`. Make sure your backend server is running on that port.

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

The app connects to these backend endpoints:
- `/api/admin/login` - Admin authentication
- `/api/admin/dashboard` - Dashboard statistics
- `/api/products/admin/all` - Product management
- `/api/admin/dealers` - Dealer management
- `/api/enquiries/admin/all` - Enquiry management 