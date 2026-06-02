import Skeleton from '@/components/ui/Skeleton'

export default function ArticleLoading() {
  return (
    <div className="story-page">
      <div className="story-container">
        <Skeleton width={120} height={12} />
        <div style={{ height: 18 }} />
        <Skeleton height={36} width="90%" />
        <div style={{ height: 12 }} />
        <Skeleton height={36} width="60%" />
        <div style={{ height: 28 }} />
        <Skeleton height={92} />
        <div style={{ height: 24 }} />
        <Skeleton height={14} width="40%" />
        <div style={{ height: 28 }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <Skeleton height={14} width={`${80 + (i % 3) * 5}%`} />
          </div>
        ))}
      </div>
    </div>
  )
}
