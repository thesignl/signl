'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Field from '@/components/ui/Field'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { signupUser } from '@/services/auth.service'

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    form?: string
  }>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Please enter your name.'
    else if (name.trim().length < 2) next.name = 'Name must be at least 2 characters.'
    if (!email) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Choose a password.'
    else if (password.length < 8)
      next.password = 'Use at least 8 characters.'
    else if (!/[a-z]/.test(password))
      next.password = 'Include at least one lowercase letter.'
    else if (!/[A-Z]/.test(password))
      next.password = 'Include at least one uppercase letter.'
    else if (!/[0-9]/.test(password))
      next.password = 'Include at least one number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await signupUser(name.trim(), email.trim(), password)
      toast('Account created. Welcome to Signl.', 'success')
      router.push('/login')
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Could not create your account. Please try again.'
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
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">
          One signal daily. Deep analysis, briefs and learn tracks — calibrated
          for serious readers.
        </p>

        <form className="auth-form" onSubmit={onSubmit} noValidate>
          <Field
            label="Full name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

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
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            helper="Minimum 8 characters."
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
            Create account
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
