'use client'

import EditorLayout from '@/features/editor/EditorLayout'
import { useEditorGuard } from '@/features/editor/useEditorGuard'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const { ready, user } = useEditorGuard()
  const { toast } = useToast()
  if (!ready) return null

  const initials = (user?.name ?? 'SD')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const label = (text: string) => (
    <div
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '.08em',
        textTransform: 'uppercase',
        color: 'var(--ink-4)',
        marginBottom: 5,
        fontWeight: 500,
      }}
    >
      {text}
    </div>
  )

  return (
    <EditorLayout
      activeNav="profile"
      crumbs={[{ label: 'Editor' }, { label: 'Profile' }]}
    >
      <div className="ed-list-page" style={{ maxWidth: 720 }}>
        <div className="ed-page-head">
          <div>
            <h1 className="ed-page-title">Profile</h1>
            <p className="ed-page-sub">
              Your account details. Some of these appear on author bylines.
            </p>
          </div>
        </div>

        <div className="ed-card" style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              gap: 18,
              alignItems: 'center',
              marginBottom: 24,
              paddingBottom: 24,
              borderBottom: '1px solid var(--admin-border)',
            }}
          >
            <div
              className="ed-avatar"
              style={{ width: 64, height: 64, fontSize: 22 }}
            >
              {initials}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {user?.name ?? 'Signl Desk'}
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11.5,
                  color: 'var(--ink-4)',
                  marginBottom: 6,
                }}
              >
                {user?.email}
              </div>
              <span className="ed-pill ed-pill-published">
                {user?.role ?? 'EDITOR'}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div>
              {label('Display name')}
              <input
                className="ed-side-input"
                style={{ padding: '10px 12px', fontSize: 13.5 }}
                defaultValue={user?.name ?? ''}
              />
            </div>
            <div>
              {label('Email (read-only)')}
              <input
                className="ed-side-input"
                style={{
                  padding: '10px 12px',
                  fontSize: 13.5,
                  background: 'var(--paper-2)',
                }}
                value={user?.email ?? ''}
                readOnly
              />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            {label('Bio')}
            <textarea
              className="ed-side-textarea"
              rows={3}
              style={{ padding: '10px 12px', fontSize: 13.5, lineHeight: 1.6 }}
              placeholder="A short bio for your author byline."
            />
          </div>

          <div style={{ marginTop: 8, textAlign: 'right' }}>
            <button
              className="ed-btn ed-btn-primary"
              onClick={() =>
                toast('Profile changes are local for now.', 'info')
              }
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </EditorLayout>
  )
}
