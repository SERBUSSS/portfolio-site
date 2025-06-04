import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic' // This enables the new JSX transform
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  // Keep your existing build configuration
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})