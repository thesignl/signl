import AnalysisCard
from './AnalysisCard'

import SignalCard
from './SignalCard'

export default function
AnalysisFeed({

  articles

}: {

  articles: any[]
}) {

  return (

    <div
      className="
        analysis-main-grid
      "
    >

      <div>

        {articles.map((article) => (

          <AnalysisCard

            key={article.id}

            article={article}
          />
        ))}

      </div>

      <div
        className="
          analysis-sidebar-col
        "
      >

        <SignalCard
          title="Rupee Liquidity Compression"
          text="Bond markets are pricing tighter liquidity before policy action."
        />

        <SignalCard
          title="Private Capex Rotation"
          text="Capital expenditure is rotating toward energy and infra clusters."
        />

        <SignalCard
          title="Banking Breadth Weakness"
          text="Financials continue underperforming broader market expansion."
        />

      </div>

    </div>
  )
}