import type { PublicClientApplication } from '@azure/msal-browser'

/**
 * Microsoft auth (MSAL, auth-code + PKCE) for calendar access. MSAL is loaded
 * dynamically so it only ships to users who connect a calendar.
 */

const CLIENT_ID = '1d2d0862-f3c5-4d14-a95c-beb43ed23478'
const CONNECTED_FLAG = 'mybahri-calendar-connected'
export const CALENDAR_SCOPES = ['Calendars.Read']

let instancePromise: Promise<PublicClientApplication> | null = null

/** Remove a stuck MSAL "interaction in progress" marker from a cancelled sign-in. */
function clearStaleInteraction() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.toLowerCase().includes('interaction.status'))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}

async function getInstance(): Promise<PublicClientApplication> {
  if (!instancePromise) {
    instancePromise = (async () => {
      const { PublicClientApplication } = await import('@azure/msal-browser')
      const instance = new PublicClientApplication({
        auth: {
          clientId: CLIENT_ID,
          authority: 'https://login.microsoftonline.com/common',
          // Must exactly match a registered SPA redirect URI (Pages/localhost).
          redirectUri: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
        cache: { cacheLocation: 'localStorage' },
      })
      await instance.initialize()
      // Complete a returning redirect sign-in, if any.
      try {
        const resp = await instance.handleRedirectPromise()
        if (resp?.account) instance.setActiveAccount(resp.account)
      } catch (e) {
        console.error('[calendar] redirect handling failed', e)
      }
      // Clear any stuck "interaction in progress" left by an interrupted sign-in.
      clearStaleInteraction()
      return instance
    })()
  }
  return instancePromise
}

/** Warm MSAL ahead of a click so the sign-in popup isn't blocked. */
export function preloadMsal(): void {
  void getInstance()
}

export function isCalendarConnected(): boolean {
  return localStorage.getItem(CONNECTED_FLAG) === '1'
}

/** Interactive sign-in + consent; returns an access token. Falls back to a
 *  full-page redirect if the popup is blocked. */
export async function connectCalendar(): Promise<string> {
  const instance = await getInstance()
  try {
    const result = await instance.loginPopup({ scopes: CALENDAR_SCOPES })
    instance.setActiveAccount(result.account)
    localStorage.setItem(CONNECTED_FLAG, '1')
    return result.accessToken
  } catch (e) {
    const code = (e as { errorCode?: string })?.errorCode
    if (code === 'popup_window_error' || code === 'empty_window_error') {
      // Popup blocked → set the flag so we auto-load on return, then redirect.
      localStorage.setItem(CONNECTED_FLAG, '1')
      await instance.loginRedirect({ scopes: CALENDAR_SCOPES })
      return new Promise<string>(() => {}) // navigation happens; keep caller pending
    }
    // A previous sign-in was interrupted → clear it so the next click works.
    if (code === 'interaction_in_progress') {
      clearStaleInteraction()
    }
    throw e
  }
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
