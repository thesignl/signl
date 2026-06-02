import Skeleton from '@/components/ui/Skeleton'

export default function LearnLoading() {
  return (
    <main className="learn-page">
      <div className="container">
        <section className="learn-hero">
          <Skeleton height={12} width={120} />
          <div style={{ height: 14 }} />
          <Skeleton height={32} width="60%" />
          <div style={{ height: 16 }} />
          <Skeleton height={14} width="80%" />
        </section>

        <div style={{ display: 'flex', gap: 8, padding: '24px 0 8px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width={120} height={28} rounded />
          ))}
        </div>

        <div className="learn-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--paper-3)',
                borderRadius: 8,
                padding: 24,
              }}
            >
              <Skeleton height={12} width={80} />
              <div style={{ height: 14 }} />
              <Skeleton height={18} width="90%" />
              <div style={{ height: 8 }} />
              <Skeleton height={14} width="80%" />
              <div style={{ height: 16 }} />
              <Skeleton height={12} width={140} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
