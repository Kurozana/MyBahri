import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { configureApi } from '@core/api/client'

// Inject the backend base URL here (the only web/Vite-specific config point).
// Swap to a real backend/GCP endpoint later via VITE_API_BASE_URL — core is untouched.
configureApi(import.meta.env.VITE_API_BASE_URL ?? '/api')

async function bootstrap() {
  // In development, start Mock Service Worker so the app runs against mock APIs.
  if (import.meta.env.DEV) {
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
