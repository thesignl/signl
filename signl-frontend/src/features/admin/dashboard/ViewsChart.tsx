import SparkLine from '@/features/admin/shared/SparkLine'

export default function ViewsChart({ totalViews }: { totalViews: number }) {
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
          <SparkLine />
        </div>
      </div>
    </div>
  )
}
