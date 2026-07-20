'use client'

import { useState, useEffect } from 'react'

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface RazorpayCheckoutOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  handler: (response: RazorpaySuccessResponse) => void
  modal?: {
    ondismiss?: () => void
  }
  prefill?: {
    name?: string
    email?: string
  }
  theme?: {
    color?: string
  }
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => { open: () => void }
  }
}

export function useRazorpay() {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.Razorpay) {
      setLoaded(true)
      return
    }
    // Reuse an existing tag if another mount already injected it.
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    )
    if (existing) {
      if (window.Razorpay) setLoaded(true)
      else {
        existing.addEventListener('load', () => setLoaded(true))
        existing.addEventListener('error', () => setFailed(true))
      }
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setLoaded(true)
    script.onerror = () => {
      setFailed(true)
      console.error('[Razorpay] Failed to load checkout.js')
    }
    document.head.appendChild(script)
    // Script is intentionally not removed on cleanup — keep it for reuse across navigations
  }, [])

  const openCheckout = (options: RazorpayCheckoutOptions) => {
    if (!window.Razorpay) throw new Error('Razorpay SDK not loaded.')
    new window.Razorpay(options).open()
  }

  return { loaded, failed, openCheckout }
}
