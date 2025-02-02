import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173, // Use a fixed port for local development
    host: true, // Allow external IP access
    open: true, // Automatically open the app in the browser during development
  },
  build: {
    outDir: 'dist', // Ensure that build output goes into the 'dist' folder
  },
  preview: {
    host: '0.0.0.0', // Bind to all interfaces for external access
    port: 4173, // Port for the preview server
    allowedHosts: ['https://notesfront-6stp.onrender.com/'], // Corrected hostname
  },
});
