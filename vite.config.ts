import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// This is the complete, simplified configuration.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  // The 'define' block has been completely removed.
  // Vite will automatically handle any environment variables
  // that start with "VITE_"
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});