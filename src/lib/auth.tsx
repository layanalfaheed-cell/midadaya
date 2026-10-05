import { createContext, useContext, useEffect, useState } from 'react'
import {
  getUser,
  handleAuthCallback,
  login as idLogin,
  logout as idLogout,
  onAuthChange,
  signup as idSignup,
  type User,
} from '@netlify/identity'

// Mirrors db/auth.ts so the UI can show admin tools; the server re-checks on every admin request.
export const ADMIN_EMAIL = 'midadsupport@gmail.com'
export const SUPPORT_EMAIL = 'Midadsupport@gmail.com'

export const userIsAdmin = (u: User | null) => !!u && (u.roles?.includes('admin') || u.email?.toLowerCase() === ADMIN_EMAIL)

type Auth = {
  user: User | null
  ready: boolean
  guest: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<User>
  signup: (email: string, password: string, name: string) => Promise<User>
  logout: () => Promise<void>
  continueAsGuest: () => void
}

const AuthContext = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [guest, setGuest] = useState(false)

  useEffect(() => {
    setGuest(localStorage.getItem('midad-guest') === '1')
    handleAuthCallback()
      .catch(() => null)
      .then(() => getUser())
      .then((u) => setUser(u))
      .finally(() => setReady(true))
    return onAuthChange((_e, u) => setUser(u))
  }, [])

  const continueAsGuest = () => {
    localStorage.setItem('midad-guest', '1')
    setGuest(true)
  }

  const value: Auth = {
    user,
    ready,
    guest: guest && !user,
    isAdmin: userIsAdmin(user),
    login: async (email, password) => {
      const u = await idLogin(email, password)
      setUser(u)
      return u
    },
    signup: async (email, password, name) => {
      const u = await idSignup(email, password, { full_name: name })
      if (u.confirmedAt) setUser(u)
      return u
    },
    logout: async () => {
      await idLogout().catch(() => undefined)
      localStorage.removeItem('midad-guest')
      setGuest(false)
      setUser(null)
    },
    continueAsGuest,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

// Netlify Forms submission (registered via public/__forms.html) so messages reach the support mailbox.
export async function submitForm(name: string, fields: Record<string, string>) {
  const body = new URLSearchParams({ 'form-name': name, ...fields }).toString()
  const res = await fetch('/__forms.html', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
  if (!res.ok) throw new Error(`form ${res.status}`)
}
