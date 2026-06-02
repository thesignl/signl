import Skeleton from '@/components/ui/Skeleton'

export default function HomeLoading() {
  return (
    <div className="container" style={{ padding: '40px 32px' }}>
      <Skeleton height={36} width="60%" />
      <div style={{ height: 24 }} />
      <Skeleton height={20} width="80%" />
      <div style={{ height: 12 }} />
      <Skeleton height={20} width="70%" />
      <div style={{ height: 40 }} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton height={140} />
            <div style={{ height: 12 }} />
            <Skeleton height={18} width="80%" />
            <div style={{ height: 8 }} />
            <Skeleton height={12} width="50%" />
          </div>
        ))}
      </div>
    </div>
  )
}
