import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL?.replace('/api', '') || 'https://module-funturine.vercel.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}) 