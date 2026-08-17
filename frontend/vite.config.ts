import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function backendProxyUrl(): string {
  if (process.env.VITE_BACKEND_URL) return process.env.VITE_BACKEND_URL;

  const envPath = path.resolve(__dirname, '../backend/.env');
  if (fs.existsSync(envPath)) {
    const port = fs.readFileSync(envPath, 'utf8').match(/^PORT=(\d+)/m)?.[1];
    if (port) return `http://127.0.0.1:${port}`;
  }

  return 'http://127.0.0.1:4000';
}

const backendUrl = backendProxyUrl();

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
