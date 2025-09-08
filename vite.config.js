import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Winning-Goals-Value-Bet/', // 👈 important for GitHub Pages
})
