import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // For GitHub Pages production build
  const isProd = mode === 'production' && command === 'build'
  // For Surge deployment
  const isSurge = mode === 'surge' && command === 'build'
  
  return {
    plugins: [react()],
    // Use '/webb/' for GitHub Pages, '/' for Surge and local dev
    base: isProd ? '/webb/' : '/',
    // Server config for preview
    server: {
      port: 5173,
      host: true
    },
    preview: {
      port: 4173,
      host: true
    },
    build: {
      // Tối ưu chunking để tải nhanh hơn
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'katex-vendor': ['katex']
          }
        }
      },
      // Tăng chunk size limit
      chunkSizeWarningLimit: 1000,
      // Tối ưu minify (esbuild nhanh hơn terser)
      minify: 'esbuild',
      // Xóa console.log trong production
      esbuild: {
        drop: ['console', 'debugger']
      }
    }
  }
})

