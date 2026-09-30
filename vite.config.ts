import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures static deployment on GitHub Pages, Vercel, Netlify
  server: {
    port: 3000,
    open: true,
  },
});
