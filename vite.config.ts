import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Portable, framework-agnostic layer — no DOM/web deps. Designed to lift
      // into a shared `packages/core` (used by web + React Native) later.
      '@core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
