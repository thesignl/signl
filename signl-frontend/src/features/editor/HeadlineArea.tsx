'use client'

import { useEditorStore } from '@/store/editor.store'
import AutoTextarea from './AutoTextarea'

/** Headline + deck + signal — always visible at the top of the editor. */
export default function HeadlineArea() {
  const headline = useEditorStore((s) => s.state?.headline ?? '')
  const deck = useEditorStore((s) => s.state?.deck ?? '')
  const signal = useEditorStore((s) => s.state?.signal ?? '')
  const setHeadline = useEditorStore((s) => s.setHeadline)
  const patch = useEditorStore((s) => s.patch)

  return (
    <>
      <div className="ed-headline-area">
        <AutoTextarea
          className="ed-headline-input"
          placeholder="Write your headline…"
          rows={1}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
        />
        <AutoTextarea
          className="ed-deck-input"
          placeholder="Optional deck — a one-line sub-headline."
          rows={1}
          value={deck}
          onChange={(e) => patch({ deck: e.target.value })}
        />
      </div>

      <div className="ed-signal-box">
        <div className="ed-signal-label">▶ Signal — what to watch</div>
        <input
          className="ed-signal-input"
          placeholder="The single data point or event that resolves this thesis…"
          value={signal}
          onChange={(e) => patch({ signal: e.target.value })}
        />
      </div>
    </>
  )
}
