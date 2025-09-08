import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Winning-Goals-Value-Bet/',  // ✅ GitHub Pages repo name
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Keep your @ alias
    },
  },
});
