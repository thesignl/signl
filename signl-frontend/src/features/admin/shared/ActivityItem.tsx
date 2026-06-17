import type { ActivityItem as ActivityItemType } from '@/types/admin'
import { cn } from '@/lib/cn'

export default function ActivityItem({ item }: { item: ActivityItemType }) {
  return (
    <div className="admin-activity-item">
      <span
        className={cn('activity-dot', `activity-dot-${item.type}`)}
        aria-hidden="true"
      />
      <div className="admin-activity-body">
        <p className="admin-activity-text">
          <strong>{item.who}</strong> {item.description}
        </p>
        <p className="admin-activity-time">{item.when}</p>
      </div>
    </div>
  )
}
