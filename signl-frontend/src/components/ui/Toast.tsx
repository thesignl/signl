'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ToastTone = 'info' | 'success' | 'error'

interface Toast {
  id: number
  tone: ToastTone
  message: string
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastRegion({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])

  const toast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = Date.now() + Math.random()
      setItems((prev) => [...prev, { id, tone, message }])
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id))
      }, 4200)
    },
    [],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="toast-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {items.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const [out, setOut] = useState(false)
  useEffect(() => {
    const t = window.setTimeout(() => setOut(true), 4000)
    return () => window.clearTimeout(t)
  }, [])
  return (
    <div className={cn('toast', toast.tone)} data-state={out ? 'closing' : 'open'}>
      <span className="toast-icon" aria-hidden>
        {toast.tone === 'success' ? '✓' : toast.tone === 'error' ? '!' : 'i'}
      </span>
      <span>{toast.message}</span>
    </div>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // Soft fallback so components remain usable in tests / SSR previews.
    return {
      toast: (msg: string) => {
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.info('[toast]', msg)
        }
      },
    }
  }
  return ctx
}
