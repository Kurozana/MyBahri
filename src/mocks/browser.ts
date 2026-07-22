import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/** Starts MSW in the browser. Called from main.tsx (dev + Pages demo build). */
export async function enableMocking() {
  await worker.start({
    onUnhandledRequest: 'bypass', // let real assets/HMR through untouched
    // Serve the worker under the app base so its scope covers /MyBahri/ on Pages.
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    quiet: false,
  })
}
