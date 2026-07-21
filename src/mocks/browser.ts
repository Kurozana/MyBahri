import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

/** Starts MSW in the browser. Called only in development from main.tsx. */
export async function enableMocking() {
  await worker.start({
    onUnhandledRequest: 'bypass', // let real assets/HMR through untouched
    quiet: false,
  })
}
