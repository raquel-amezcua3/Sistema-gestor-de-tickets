import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['sistema-gestor-de-tickets.onrender.com']
  },
  // Si también usas el comando dev en Render, agrégalo aquí también:
  server: {
    allowedHosts: ['sistema-gestor-de-tickets.onrender.com']
  }
})