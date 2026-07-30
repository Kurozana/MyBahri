import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authApi } from '@core/api/auth'
import { setAuthToken } from '@core/api/client'
import type { UserDto } from '@core/api/types'

const TOKEN_KEY = 'mybahri-token'

type Status = 'loading' | 'authed' | 'anon'

type AuthContextValue = {
  user: UserDto | null
  status: Status
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null)
  const [status, setStatus] = useState<Status>('loading')

  // Restore session from a stored token on first load.
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setStatus('anon')
      return
    }
    setAuthToken(token)
    authApi
      .me()
      .then((u) => {
        setUser(u)
        setStatus('authed')
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setAuthToken(null)
        setStatus('anon')
      })
  }, [])

  const applySession = (token: string, u: UserDto) => {
    localStorage.setItem(TOKEN_KEY, token)
    setAuthToken(token)
    setUser(u)
    setStatus('authed')
  }

  const login = async (email: string, password: string) => {
    const { token, user: u } = await authApi.login(email, password)
    applySession(token, u)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setAuthToken(null)
    setUser(null)
    setStatus('anon')
  }

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
