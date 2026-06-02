import Skeleton from '@/components/ui/Skeleton'

export default function AnalysisLoading() {
  return (
    <>
      <header className="page-header-dark">
        <div className="container">
          <Skeleton height={12} width={140} />
          <div style={{ height: 16 }} />
          <Skeleton height={36} width="70%" />
        </div>
      </header>
      <div className="page-shell">
        <div className="container">
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width={70} height={28} rounded />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--paper-3)',
                borderRadius: 10,
                padding: 24,
                marginBottom: 18,
              }}
            >
              <Skeleton height={18} width="80%" />
              <div style={{ height: 12 }} />
              <Skeleton height={14} width="60%" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
