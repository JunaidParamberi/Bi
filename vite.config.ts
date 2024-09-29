import { defineConfig } from 'vite';
import path from 'node:path';
import electron from 'vite-plugin-electron/simple';
import react from '@vitejs/plugin-react';


export default defineConfig({
  server: {
    port: 3000 // or whichever port you'd like to use
  },
  assetsInclude: ['*/.JPG'],
  base: './',  // Ensure relative paths for web build to work without a server
  plugins: [
    react(),
    process.env.TARGET_ENV === 'electron' && electron({
      main: {
        entry: 'electron/main.ts',  
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),  // Preload script
      },
      renderer: {},  
    }),
  ].filter(Boolean),  // Filter to remove 'false' values when building for web
});