'use client'

import './editor.css'
import EditorSidebar, {
  type EditorNav,
  type NavCounts,
} from './EditorSidebar'
import { useEditorCounts } from './useEditorCounts'

export interface Crumb {
  label: string
  href?: string
}

/**
 * The editor app shell: fixed sidebar + sticky topbar + content slot. Every
 * editor route renders inside this. `topbarExtra` (autosave) and `actions`
 * (Preview/Save/Publish) are page-supplied. When a page doesn't pass `counts`,
 * the shell fetches them itself so the sidebar badges are always correct.
 */
export default function EditorLayout({
  activeNav,
  counts,
  crumbs,
  topbarExtra,
  actions,
  children,
}: {
  activeNav: EditorNav
  counts?: NavCounts
  crumbs: Crumb[]
  topbarExtra?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  const fetched = useEditorCounts(counts === undefined)
  const effectiveCounts = counts ?? fetched

  return (
    <div className="ed-app">
      <div className="ed-shell">
        <EditorSidebar active={activeNav} counts={effectiveCounts} />

        <div className="ed-main">
          <header className="ed-topbar">
            <div className="ed-topbar-left">
              <div className="ed-crumb">
                {crumbs.map((c, i) => (
                  <span key={i} style={{ display: 'contents' }}>
                    {i > 0 ? <span className="sep">/</span> : null}
                    <span
                      className={i === crumbs.length - 1 ? 'current' : undefined}
                    >
                      {c.label}
                    </span>
                  </span>
                ))}
              </div>
              {topbarExtra}
            </div>
            <div className="ed-topbar-right">{actions}</div>
          </header>

          <div className="ed-content">{children}</div>
        </div>
      </div>
    </div>
  )
}
