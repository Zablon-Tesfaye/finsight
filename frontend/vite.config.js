import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], server: { host: '0.0.0.0', proxy: { '/auth': 'http://backend:8000', '/transactions': 'http://backend:8000', '/predict': 'http://backend:8000' } } });
