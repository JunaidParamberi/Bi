import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.JPG'],
  base: '/',  // Absolute asset paths so deep links like /world/Kenya resolve assets correctly
  plugins: [react()],
})
