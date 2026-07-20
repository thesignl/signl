'use client'

import { useEditorStore } from '@/store/editor.store'
import AutoTextarea from './AutoTextarea'

/** Summary pane — synopsis + a 3-point (max 5) teaser. */
export default function SummaryEditor() {
  const synopsis = useEditorStore((s) => s.state?.synopsis ?? '')
  const points = useEditorStore((s) => s.state?.summaryPoints ?? [])
  const patch = useEditorStore((s) => s.patch)
  const addSummaryPoint = useEditorStore((s) => s.addSummaryPoint)
  const updateSummaryPoint = useEditorStore((s) => s.updateSummaryPoint)
  const removeSummaryPoint = useEditorStore((s) => s.removeSummaryPoint)

  return (
    <>
      <div className="ed-summary-box">
        <div className="ed-summary-label">
          Synopsis — always free, always visible
        </div>
        <AutoTextarea
          className="ed-synopsis"
          placeholder="A single paragraph that tells the reader what this story is — and why it matters. This is what every reader sees, free or Pro."
          rows={3}
          value={synopsis}
          onChange={(e) => patch({ synopsis: e.target.value })}
        />

        <div className="ed-summary-points">
          <div className="ed-summary-points-label">Three-point teaser</div>
          <div>
            {points.map((p, i) => (
              <div className="ed-summary-point" key={i}>
                <input
                  className="ed-summary-point-input"
                  placeholder={`Point ${i + 1} — short, decisive, no filler`}
                  value={p}
                  onChange={(e) => updateSummaryPoint(i, e.target.value)}
                />
                <button
                  className="ed-summary-point-remove"
                  title="Remove"
                  onClick={() => removeSummaryPoint(i)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {points.length < 5 ? (
            <button className="ed-summary-add" onClick={addSummaryPoint}>
              + Add point
            </button>
          ) : null}
        </div>
      </div>

      <p className="ed-note">
        The summary is the <strong>contract</strong>{' '}with every reader. Even
        non-subscribers will see this. Write it as if the article behind it
        didn&apos;t exist.
      </p>
    </>
  )
}
