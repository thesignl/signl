import AdminStatusPill from '@/features/admin/shared/AdminStatusPill'
import type { QueueItem } from '@/types/admin'

export default function EditorialQueue({ items }: { items: QueueItem[] }) {
  return (
    <div className="admin-card-new">
      <div className="admin-card-head">
        <span className="admin-card-title">Editorial Queue</span>
        <span className="admin-card-title-meta">{items.length} items</span>
      </div>
      <div className="admin-card-body">
        {items.length === 0 ? (
          <div className="admin-empty">Queue is clear</div>
        ) : (
          <div className="admin-feed-list">
            {items.map((item) => (
              <div key={item.id} className="admin-feed-row">
                <div className="admin-feed-body">
                  <p className="admin-feed-headline" title={item.title}>{item.title}</p>
                  <div className="admin-feed-meta">
                    <span>{item.authorName}</span>
                    <span>·</span>
                    <span>{item.when}</span>
                  </div>
                </div>
                <AdminStatusPill status={item.status} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="admin-card-foot">
        <a href="/admin/articles" className="admin-card-more">Manage articles →</a>
      </div>
    </div>
  )
}
