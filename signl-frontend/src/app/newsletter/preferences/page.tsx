'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import Button from '@/components/ui/Button'
import {
  getNewsletterPreferences,
  updateNewsletterPreferences,
  type PreferenceCategory,
} from '@/services/newsletter.service'

function PreferencesInner() {
  const params = useSearchParams()
  const token = params.get('token') ?? ''

  const [email, setEmail] = useState('')
  const [categories, setCategories] = useState<PreferenceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Missing preferences token.')
      setLoading(false)
      return
    }
    getNewsletterPreferences(token)
      .then((data) => {
        setEmail(data.email)
        setCategories(data.categories)
      })
      .catch(() => setError('This preferences link is invalid or has expired.'))
      .finally(() => setLoading(false))
  }, [token])

  function toggle(id: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, subscribed: !c.subscribed } : c)),
    )
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    try {
      await updateNewsletterPreferences(
        token,
        categories.map((c) => ({ categoryId: c.id, subscribed: c.subscribed })),
      )
      setSaved(true)
    } catch {
      setError('Could not save your preferences. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="nl-pref-note">Loading your preferences…</p>
  if (error) return <p className="nl-pref-note nl-pref-error">{error}</p>

  return (
    <div className="nl-pref-card">
      <h1 className="nl-pref-title">Email preferences</h1>
      <p className="nl-pref-sub">
        Choose which newsletters you receive at <strong>{email}</strong>.
      </p>

      {categories.length === 0 ? (
        <p className="nl-pref-note">No newsletter types are available yet.</p>
      ) : (
        <ul className="nl-pref-list">
          {categories.map((c) => (
            <li key={c.id} className="nl-pref-item">
              <div>
                <div className="nl-pref-item-name">{c.name}</div>
                {c.description ? <div className="nl-pref-item-desc">{c.description}</div> : null}
              </div>
              <label className="nl-pref-switch">
                <input
                  type="checkbox"
                  checked={c.subscribed}
                  onChange={() => toggle(c.id)}
                  aria-label={`Receive ${c.name}`}
                />
                <span className="nl-pref-slider" aria-hidden />
              </label>
            </li>
          ))}
        </ul>
      )}

      <div className="nl-pref-actions">
        <Button variant="accent" size="md" loading={saving} onClick={save}>
          Save preferences
        </Button>
        {saved ? <span className="nl-pref-saved" role="status">✓ Saved</span> : null}
      </div>
    </div>
  )
}

export default function NewsletterPreferencesPage() {
  return (
    <div className="nl-pref-page">
      <Suspense fallback={<p className="nl-pref-note">Loading…</p>}>
        <PreferencesInner />
      </Suspense>
    </div>
  )
}
