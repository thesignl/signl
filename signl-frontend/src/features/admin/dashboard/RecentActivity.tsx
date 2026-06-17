import ActivityItem from '@/features/admin/shared/ActivityItem'
import type { ActivityItem as ActivityItemType } from '@/types/admin'

export default function RecentActivity({ items }: { items: ActivityItemType[] }) {
  return (
    <div className="admin-card-new">
      <div className="admin-card-head">
        <span className="admin-card-title">Recent Activity</span>
      </div>
      <div className="admin-card-body">
        {items.length === 0 ? (
          <div className="admin-empty">No recent activity</div>
        ) : (
          <div className="admin-activity-list">
            {items.map((item, i) => (
              <ActivityItem key={i} item={item} />
            ))}
          </div>
        )}
      </div>
      <div className="admin-card-foot">
        <a href="/admin/activity" className="admin-card-more">View activity log →</a>
      </div>
    </div>
  )
}
