import {
  getAnalysisFeed
}
from '@/services/article.service'

import AnalysisFeed
from '@/features/analysis/AnalysisFeed'

import FrameworkTabs
from '@/features/analysis/FrameworkTabs'

export default async function
AnalysisPage() {

  const articles =
    await getAnalysisFeed()

  return (

    <main className="analysis-page">

      <div className="analysis-page-header">

        <div className="container">

          <div className="analysis-page-eyebrow">

            SIGNL INTELLIGENCE
          </div>

          <h1 className="analysis-page-title">

            Deep systems analysis.
          </h1>

          <p className="analysis-page-sub">

            Macro systems, market
            structure, geopolitics,
            capital flows and strategic
            operational intelligence.
          </p>

        </div>

      </div>

      <div className="container">

        <FrameworkTabs />

        <AnalysisFeed
          articles={articles}
        />

      </div>

    </main>
  )
}