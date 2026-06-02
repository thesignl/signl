import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
})

// Attach the JWT from localStorage on every browser request.
// Centralizing this in an interceptor lets services stay token-agnostic
// and prevents the two competing auth-transport patterns the codebase
// previously had (cookies vs. manually-attached Authorization headers).
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
