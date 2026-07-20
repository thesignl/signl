import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send/receive the httpOnly refresh cookie
  headers: { Accept: 'application/json' },
  timeout: 20_000,
})

const ACCESS_KEY = 'signl_access'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(ACCESS_KEY)
}

export function setAccessToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (token) window.localStorage.setItem(ACCESS_KEY, token)
  else window.localStorage.removeItem(ACCESS_KEY)
}

// Attach the access token on every browser request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Transparent token refresh on 401 ──────────────────────────────────────
// When an access token expires, the server replies 401. We attempt a single
// refresh using the httpOnly cookie, then replay the original request. A
// shared in-flight promise prevents a refresh stampede when many requests
// 401 simultaneously.
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    )
    const token = res.data?.data?.accessToken ?? null
    setAccessToken(token)
    return token
  } catch {
    setAccessToken(null)
    return null
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean; url?: string })
      | undefined

    const status = error.response?.status
    const isAuthEndpoint =
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/signup') ||
      original?.url?.includes('/auth/refresh')

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true
      refreshPromise = refreshPromise ?? refreshAccessToken()
      const newToken = await refreshPromise
      refreshPromise = null

      if (newToken) {
        original.headers = original.headers ?? {}
        ;(original.headers as Record<string, string>).Authorization = `Bearer ${newToken}`
        return api(original)
      }

      // Refresh failed → broadcast logout so the auth store can react.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('signl:session-expired'))
      }
    }

    return Promise.reject(error)
  },
)

export default api
