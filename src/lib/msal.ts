import type { PublicClientApplication } from '@azure/msal-browser'

/**
 * Microsoft auth (MSAL, auth-code + PKCE) for calendar access. The MSAL library
 * is dynamically imported so it only loads for users who actually connect a
 * calendar — keeping the home page lean for everyone else.
 */

const CLIENT_ID = '1d2d0862-f3c5-4d14-a95c-beb43ed23478'
const CONNECTED_FLAG = 'mybahri-calendar-connected'
export const CALENDAR_SCOPES = ['Calendars.Read']

let instancePromise: Promise<PublicClientApplication> | null = null

async function getInstance(): Promise<PublicClientApplication> {
  if (!instancePromise) {
    instancePromise = (async () => {
      const { PublicClientApplication } = await import('@azure/msal-browser')
      const instance = new PublicClientApplication({
        auth: {
          clientId: CLIENT_ID,
          authority: 'https://login.microsoftonline.com/common',
          // Matches the registered SPA redirect URI (Pages sub-path or localhost).
          redirectUri: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
        cache: { cacheLocation: 'localStorage' },
      })
      await instance.initialize()
      return instance
    })()
  }
  return instancePromise
}

/** Whether the user has connected a calendar before (used to avoid loading MSAL eagerly). */
export function isCalendarConnected(): boolean {
  return localStorage.getItem(CONNECTED_FLAG) === '1'
}

/** Interactive sign-in + consent; returns an access token. */
export async function connectCalendar(): Promise<string> {
  const instance = await getInstance()
  const result = await instance.loginPopup({ scopes: CALENDAR_SCOPES })
  instance.setActiveAccount(result.account)
  localStorage.setItem(CONNECTED_FLAG, '1')
  return result.accessToken
}

/** Silent token for an already-connected account, or null if none/expired. */
export async function getCalendarToken(): Promise<string | null> {
  const instance = await getInstance()
  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0]
  if (!account) return null
  try {
    const res = await instance.acquireTokenSilent({ scopes: CALENDAR_SCOPES, account })
    return res.accessToken
  } catch {
    return null
  }
}

export async function disconnectCalendar(): Promise<void> {
  localStorage.removeItem(CONNECTED_FLAG)
  const instance = await getInstance()
  await instance.clearCache()
}
