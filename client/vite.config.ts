import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'postcss',
  },
  build: {
    cssMinify: false,
  },
  server: {
    host: '0.0.0.0',
    port: 3002,
    proxy: {
      '/users': 'http://server:5000',
      '/sessions': 'http://server:5000',
      '/payments': 'http://server:5000',
      '/webhooks': 'http://server:5000',
    },
  },
  preview: {
    port: 3002,
  },
});
