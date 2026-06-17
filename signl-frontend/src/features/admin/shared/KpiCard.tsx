import { cn } from '@/lib/cn'

interface KpiCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  delta?: { value: string; direction: 'up' | 'dn' | 'flat' }
  sub?: string
}

export default function KpiCard({ label, value, icon, iconBg, delta, sub }: KpiCardProps) {
  return (
    <div className="admin-kpi">
      <div className="admin-kpi-top">
        <span className="admin-kpi-label">{label}</span>
        <span className="admin-kpi-icon" style={{ background: iconBg }}>
          {icon}
        </span>
      </div>
      <div className="admin-kpi-value">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {(delta || sub) && (
        <div className="admin-kpi-footer">
          {delta && (
            <span className={cn('admin-kpi-delta', delta.direction)}>
              {delta.direction === 'up' ? '↑' : delta.direction === 'dn' ? '↓' : '→'}
              {' '}{delta.value}
            </span>
          )}
          {sub && <p className="admin-kpi-sub">{sub}</p>}
        </div>
      )}
    </div>
  )
}
