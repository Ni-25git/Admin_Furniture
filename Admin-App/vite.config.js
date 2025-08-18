import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const LOCAL_ORIGIN = 'http://localhost:3000'
  const PROD_ORIGIN = 'https://admindashboardfurniture.vercel.app'

  return {
    plugins: [react()],
    server: {
      port: 3000,
      cors: {
        origin: [LOCAL_ORIGIN, PROD_ORIGIN],
        credentials: true,
      },
      proxy: {
        '/api': {
          target: 'https://module-funturine.vercel.app',
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              const reqHost = req.headers.host || ''
              const isLocal = reqHost.includes('localhost') || reqHost.includes('127.0.0.1')
              const originHeader = isLocal ? LOCAL_ORIGIN : PROD_ORIGIN
              proxyReq.setHeader('Origin', originHeader)
            })

            proxy.on('proxyRes', (proxyRes, req) => {
              const reqHost = req.headers.host || ''
              const isLocal = reqHost.includes('localhost') || reqHost.includes('127.0.0.1')
              const originHeader = isLocal ? LOCAL_ORIGIN : PROD_ORIGIN
              proxyRes.headers['access-control-allow-origin'] = originHeader
              proxyRes.headers['access-control-allow-credentials'] = 'true'
              proxyRes.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
              proxyRes.headers['access-control-allow-headers'] = 'Content-Type, Authorization'
            })
          },
        },
      },
    },
  }
})