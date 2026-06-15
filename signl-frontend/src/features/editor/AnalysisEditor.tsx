'use client'

import FrameworkEditor from './FrameworkEditor'
import BlockEditor from './BlockEditor'

/** Analysis pane — framework intro, the 5-step framework, then the Pro body. */
export default function AnalysisEditor() {
  return (
    <>
      <div className="ed-analysis-intro">
        <div className="ed-analysis-intro-icon">5</div>
        <div className="ed-analysis-intro-body">
          <strong>The five-step Signl framework</strong> — every analysis
          follows the same spine: Catalyst, Context, Transmission, Outlook,
          Signal. Fill in each step in one or two sentences. The longer-form
          analysis body sits below.
        </div>
      </div>

      <FrameworkEditor />

      <div className="ed-analysis-divider">Full analysis body — Pro-only</div>

      <BlockEditor blockKey="analysisBlocks" />
    </>
  )
}
