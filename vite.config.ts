import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'spark': ['@sparkjsdev/spark'],
          'react-vendor': ['react', 'react-dom'],
          'icons': ['react-icons'],
        }
      }
    }
  }
})
