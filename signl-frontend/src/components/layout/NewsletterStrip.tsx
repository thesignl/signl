'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { subscribeNewsletter } from '@/services/newsletter.service'
import { useToast } from '@/components/ui/Toast'

type SubmitState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

export default function NewsletterStrip() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<SubmitState>({ status: 'idle' })
  const { toast } = useToast()

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setState({
        status: 'error',
        message: 'Please enter a valid email address.',
      })
      return
    }
    setState({ status: 'loading' })
    try {
      const response = await subscribeNewsletter(email)
      const successMessage =
        response?.message ?? 'You are subscribed to The Signl Brief.'
      setState({ status: 'success', message: successMessage })
      toast(successMessage, 'success')
      setEmail('')
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Subscription could not be completed. Please try again.'
      setState({ status: 'error', message })
      toast(message, 'error')
    }
  }

  return (
    <section className="newsletter-strip" aria-labelledby="newsletter-title">
      <div className="container">
        <div className="newsletter-inner">
          <div>
            <div className="nl-eyebrow">The Signl Brief</div>
            <h2 id="newsletter-title" className="nl-title">
              One signal daily. Before the market reacts.
            </h2>
            <p className="nl-sub">
              Strategic intelligence, deep analysis, macro systems and market
              structure — delivered before market open.
            </p>
          </div>

          <form className="nl-form" onSubmit={handleSubscribe} noValidate>
            <label
              htmlFor="nl-email"
              style={{
                position: 'absolute',
                left: -10000,
                width: 1,
                height: 1,
                overflow: 'hidden',
              }}
            >
              Email address
            </label>
            <input
              id="nl-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@firm.com"
              className="nl-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={state.status === 'error' ? true : undefined}
              required
            />
            <Button
              type="submit"
              variant="accent"
              size="md"
              loading={state.status === 'loading'}
            >
              Subscribe
            </Button>
          </form>

          {state.status === 'success' ? (
            <p className="nl-message success" role="status">
              <span aria-hidden>✓</span>
              {state.message}
            </p>
          ) : null}
          {state.status === 'error' ? (
            <p className="nl-message error" role="alert">
              <span aria-hidden>!</span>
              {state.message}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
