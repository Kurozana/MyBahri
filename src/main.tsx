import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { configureApi } from '@core/api/client'

// API base is derived from the app base URL (so it lives under /MyBahri/ on Pages,
// which keeps it inside the mock service-worker's scope). Override with
// VITE_API_BASE_URL when pointing at a real backend/GCP endpoint.
configureApi(import.meta.env.VITE_API_BASE_URL ?? `${import.meta.env.BASE_URL}api`)

async function bootstrap() {
  // Start Mock Service Worker in dev, and in the Pages demo build (VITE_ENABLE_MOCKS).
  if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { enableMocking } = await import('./mocks/browser')
    await enableMocking()
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
