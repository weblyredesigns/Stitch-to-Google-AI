import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Stitch-to-Google-AI/', // Matches your GitHub Pages repository name
  build: {
    outDir: 'dist',
  }
});