import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_API_URL,
        changeOrigin: true,
      },
    },
  },
  plugins: [react(),tailwindcss()],
})
