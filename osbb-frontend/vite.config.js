import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: ['osbbplus.onrender.com', 'localhost', '127.0.0.1']
  }
})
