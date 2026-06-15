'use client'

import EditorLayout from '@/features/editor/EditorLayout'
import { useEditorGuard } from '@/features/editor/useEditorGuard'

const SHORTCUTS: [string, string[]][] = [
  ['Save draft', ['⌘', 'S']],
  ['Open preview', ['⌘', 'P']],
  ['Publish (with confirmation)', ['⌘', '↵']],
  ['Switch to Summary tab', ['⌘', '1']],
  ['Switch to Article tab', ['⌘', '2']],
  ['Switch to Analysis tab', ['⌘', '3']],
  ['Close modal', ['Esc']],
]

export default function ShortcutsPage() {
  const { ready } = useEditorGuard()
  if (!ready) return null

  return (
    <EditorLayout
      activeNav="shortcuts"
      crumbs={[{ label: 'Editor' }, { label: 'Shortcuts' }]}
    >
      <div className="ed-list-page" style={{ maxWidth: 640 }}>
        <div className="ed-page-head">
          <div>
            <h1 className="ed-page-title">Keyboard Shortcuts</h1>
            <p className="ed-page-sub">
              Work faster. On Windows, ⌘ is the Control key.
            </p>
          </div>
        </div>
        <div className="ed-card">
          {SHORTCUTS.map(([action, keys]) => (
            <div
              key={action}
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--admin-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
                {action}
              </span>
              <span style={{ display: 'flex', gap: 5 }}>
                {keys.map((k, i) => (
                  <span className="ed-kbd" key={i}>
                    {k}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </EditorLayout>
  )
}
