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
  resolve: {
    alias: {
      // Portable, framework-agnostic layer — no DOM/web deps. Designed to lift
      // into a shared `packages/core` (used by web + React Native) later.
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
