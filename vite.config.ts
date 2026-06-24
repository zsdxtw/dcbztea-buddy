import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: false,
    strictPort: false,
    hmr: {
      host: 'localhost',
      port: 3000,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand'],
  },
});
