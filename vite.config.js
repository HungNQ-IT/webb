import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// For local development, use '/'
// For GitHub Pages, use '/webb/' (match your repository name)
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/webb/' : '/',
}))

