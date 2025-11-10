import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// For local development, use '/'
// For GitHub Pages, change to '/YOUR-REPO-NAME/' and update in App.jsx and 404.html too
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/Gia-su-10-diem/' : '/',
}))

