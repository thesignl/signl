'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { loginUser } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const setAuth = useAuthStore((s) => s.setAuth)
  const { toast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (!email) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const response = await loginUser(email, password)
      setAuth(response.data.user, response.data.accessToken)
      toast(`Welcome back, ${response.data.user.name.split(' ')[0]}.`, 'success')
      const next = params?.get('next') || '/'
      router.push(next)
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Sign in failed. Check your credentials and try again.'
      setErrors({ form: message })
      toast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-eyebrow">Signl Account</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">
          Sign in to continue reading and to access your saved analysis.
        </p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <Field
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@firm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            required
          />

          <Field
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="btn btn-sm btn-ghost"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{ height: 28, padding: '0 8px' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            }
          />

          {errors.form ? (
            <p className="field-error" role="alert">
              {errors.form}
            </p>
          ) : null}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
          >
            Sign in
          </Button>
        </form>

        <div className="auth-footer">
          New to Signl? <Link href="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  )
}
