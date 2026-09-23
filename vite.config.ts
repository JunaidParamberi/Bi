import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.JPG'],
  base: './',  // Relative asset paths so the build works from any sub-path
  plugins: [react()],
})
