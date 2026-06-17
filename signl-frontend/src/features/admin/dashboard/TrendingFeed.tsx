import type { TrendingArticle } from '@/types/admin'

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export default function TrendingFeed({ articles }: { articles: TrendingArticle[] }) {
  return (
    <div className="admin-card-new">
      <div className="admin-card-head">
        <span className="admin-card-title">Trending Articles</span>
        <span className="admin-card-title-meta">By views</span>
      </div>
      <div className="admin-card-body">
        {articles.length === 0 ? (
          <div className="admin-empty">No published articles yet</div>
        ) : (
          <div className="admin-feed-list">
            {articles.map((a, i) => (
              <div key={a.id} className="admin-feed-row">
                <span className="admin-feed-rank">{i + 1}</span>
                <div className="admin-feed-body">
                  <p className="admin-feed-headline" title={a.title}>{a.title}</p>
                  <div className="admin-feed-meta">
                    <span>{a.categoryName}</span>
                    <span>·</span>
                    <span>{a.authorName}</span>
                  </div>
                </div>
                <span className="admin-feed-stat">{formatViews(a.views)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="admin-card-foot">
        <a href="/admin/analytics" className="admin-card-more">View analytics →</a>
      </div>
    </div>
  )
}
