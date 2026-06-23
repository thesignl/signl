import SparkLine from '@/features/admin/shared/SparkLine'

interface ViewsChartProps {
  totalViews: number
  sparkData?: number[]
}

export default function ViewsChart({ totalViews, sparkData }: ViewsChartProps) {
  return (
    <div className="admin-card-new">
      <div className="admin-card-head">
        <span className="admin-card-title">Total Views</span>
        <span className="admin-card-title-meta">All time</span>
      </div>
      <div className="admin-card-body">
        <div className="admin-chart-shell">
          <div className="admin-chart-header">
            <div>
              <div className="admin-chart-total">
                {totalViews.toLocaleString()}
              </div>
              <p className="admin-chart-sub">cumulative article views</p>
            </div>
          </div>
          <SparkLine data={sparkData} />
        </div>
      </div>
    </div>
  )
}
