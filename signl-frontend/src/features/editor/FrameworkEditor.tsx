'use client'

import { useEditorStore } from '@/store/editor.store'
import AutoTextarea from './AutoTextarea'

/** The five-step Signl framework editor (Catalyst → Signal). */
export default function FrameworkEditor() {
  const steps = useEditorStore((s) => s.state?.analysisSteps ?? [])
  const updateStep = useEditorStore((s) => s.updateStep)

  return (
    <div className="ed-steps-section">
      <div className="ed-steps-label">Framework</div>
      {steps.map((step, i) => (
        <div className="ed-step-row" key={i}>
          <div className="ed-step-num">
            {step.num} · {step.label}
          </div>
          <AutoTextarea
            className="ed-step-text"
            placeholder="One or two sentences. Crisp."
            rows={2}
            value={step.text}
            onChange={(e) => updateStep(i, e.target.value)}
          />
        </div>
      ))}
    </div>
  )
}
