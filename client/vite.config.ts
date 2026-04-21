import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  envDir: '..',
  build: {
    cssMinify: false,
  },
  server: {
    port: 3002,
    proxy: {
      '/users': 'http://localhost:5001',
      '/sessions': 'http://localhost:5001',
      '/payments': 'http://localhost:5001',
      '/webhooks': 'http://localhost:5001',
    },
  },
  preview: {
    port: 3002,
  },
});
