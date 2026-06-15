'use client'

import { useEditorStore } from '@/store/editor.store'
import { countAllWords, estReadTime } from './editor.helpers'
import { Pill } from './EditorBits'

export default function StatsStrip({
  lastSavedLabel,
}: {
  lastSavedLabel: string
}) {
  const state = useEditorStore((s) => s.state)
  const saveStatus = useEditorStore((s) => s.saveStatus)
  if (!state) return null

  const words = countAllWords(state)
  const read = estReadTime(state)
  const saveText =
    saveStatus === 'saving'
      ? 'Saving…'
      : saveStatus === 'error'
        ? 'Save failed'
        : `Saved ${lastSavedLabel}`

  return (
    <div className="ed-stats">
      <div className="ed-stats-group">
        <span className="ed-stat">
          <strong>{words}</strong>words
        </span>
        <span className="ed-stat">
          <strong>{read}</strong>min read
        </span>
        <span className="ed-stat">
          {state.depths.length} depth{state.depths.length > 1 ? 's' : ''}
        </span>
      </div>
      <div className="ed-stats-status">
        <Pill status={state.status} />
        <span style={{ color: 'var(--ink-5)' }}>·</span>
        <span>{saveText}</span>
      </div>
    </div>
  )
}
