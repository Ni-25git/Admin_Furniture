# Environment Setup

## API Base URL Configuration

This application uses the `VITE_API_BASE_URL` environment variable to configure the API endpoint.

### Setting up the Environment Variable

#### Option 1: Create a .env file (Recommended)

Create a `.env` file in the root of the Admin-App directory with the following content:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Option 2: Set as system environment variable

On Windows:
```cmd
set VITE_API_BASE_URL=http://localhost:5000/api
```

On macOS/Linux:
```bash
export VITE_API_BASE_URL=http://localhost:5000/api
```

### Default Configuration

If no environment variable is set, the application will default to:
- API Base URL: `http://localhost:5000/api`

### Development vs Production

- **Development**: Uses the proxy configuration in `vite.config.js` for local development
- **Production**: Uses the full URL specified in `VITE_API_BASE_URL`

### API Endpoints

All API endpoints are centralized in `src/config/api.js` and use the `VITE_API_BASE_URL` environment variable.

### Restart Required

After setting the environment variable, restart your development server:

```bash
npm run dev
``` 