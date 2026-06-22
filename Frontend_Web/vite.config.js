import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('/lucide-react/') || id.includes('/recharts/') || id.includes('/react-toastify/')) {
              return 'ui';
            }
            if (id.includes('/leaflet/') || id.includes('/react-leaflet/')) {
              return 'map';
            }
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router-dom/')) {
              return 'vendor';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})