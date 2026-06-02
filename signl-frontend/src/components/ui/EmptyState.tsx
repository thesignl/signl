import type { ReactNode } from 'react'

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-title">{title}</div>
      {description ? (
        <p className="empty-state-desc">{description}</p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </div>
  )
}
