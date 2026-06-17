interface SparkLineProps {
  data?: number[]
  color?: string
  height?: number
}

export default function SparkLine({
  data = [],
  color = 'var(--accent)',
  height = 56,
}: SparkLineProps) {
  if (data.length < 2) {
    return (
      <div className="admin-chart-placeholder">
        <span className="admin-chart-placeholder-text">
          Time-series data available after full analytics rollout
        </span>
      </div>
    )
  }

  const w = 300
  const h = height
  const pad = 4
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  })

  const fillPath = `M${pts[0]} L${pts.join(' L')} L${w - pad},${h - pad} L${pad},${h - pad} Z`
  const linePath = `M${pts[0]} L${pts.join(' L')}`

  return (
    <svg
      className="admin-sparkline"
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#spark-fill)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
