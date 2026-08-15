import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// Backend'in yerel varsayılanı backend/.env.example ile aynı olmalı.
// Gerekirse VITE_BACKEND_URL=http://localhost:PORT ile ayrıca değiştirilebilir.
const backendUrl = process.env.VITE_BACKEND_URL ?? 'http://localhost:3003';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/uploads': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
});
