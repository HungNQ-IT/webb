import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // For GitHub Pages production build
  const isProd = mode === 'production' && command === 'build'
  
  return {
    plugins: [react()],
    // Use '/webb/' for GitHub Pages, '/' for local dev and preview
    base: isProd ? '/webb/' : '/',
    // Server config for preview
    server: {
      port: 5173,
      host: true
    },
    preview: {
      port: 4173,
      host: true
    }
  }
})

