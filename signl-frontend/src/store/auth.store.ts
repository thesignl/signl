import { create } from 'zustand'
import { setAccessToken, getAccessToken } from '@/lib/axios'
import { logoutUser, type AuthUser } from '@/services/auth.service'

interface AuthStore {
  user: AuthUser | null
  token: string | null
  hydrated: boolean
  setAuth: (user: AuthUser, token: string) => void
  setUser: (user: AuthUser) => void
  hydrate: () => void
  logout: () => void
}

const USER_KEY = 'signl_user'

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  hydrated: false,

  setAuth: (user, token) => {
    setAccessToken(token)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    set({ user, token })
  },

  setUser: (user) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
    set({ user })
  },

  // Restore session from localStorage on first client mount.
  hydrate: () => {
    if (typeof window === 'undefined') return
    const token = getAccessToken()
    const rawUser = window.localStorage.getItem(USER_KEY)
    let user: AuthUser | null = null
    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as AuthUser
      } catch {
        user = null
      }
    }
    set({ user, token, hydrated: true })
  },

  logout: () => {
    // Fire-and-forget server cookie clear; never block UI on it.
    void logoutUser().catch(() => {})
    setAccessToken(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(USER_KEY)
    }
    set({ user: null, token: null })
  },
}))

// React to transparent-refresh failure broadcast from the axios interceptor.
if (typeof window !== 'undefined') {
  window.addEventListener('signl:session-expired', () => {
    useAuthStore.getState().logout()
  })
}
