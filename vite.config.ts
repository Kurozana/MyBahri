import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves this project site under /MyBahri/. Dev stays at /.
// Keyed off `mode` (production for both `build` and `preview`) so local preview
// matches the deployed sub-path; dev (mode=development) stays at root.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/MyBahri/' : '/',
  plugins: [react(), tailwindcss()],
  // In dev, proxy API calls to the NestJS backend (avoids CORS; keeps the
  // front-end calling its default '/api' base).
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
  resolve: {
    alias: {
      // Portable, framework-agnostic layer — no DOM/web deps. Designed to lift
      // into a shared `packages/core` (used by web + React Native) later.
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
