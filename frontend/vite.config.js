import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Docker resolves "backend"; local development resolves "localhost".
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/auth': process.env.API_PROXY_TARGET || 'http://localhost:8000',
      '/transactions': process.env.API_PROXY_TARGET || 'http://localhost:8000',
      '/predict': process.env.API_PROXY_TARGET || 'http://localhost:8000',
    },
  },
});
