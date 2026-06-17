import { cn } from '@/lib/cn'

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'admin-pill-draft',
  REVIEW: 'admin-pill-review',
  PUBLISHED: 'admin-pill-published',
  ARCHIVED: 'admin-pill-archived',
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Draft',
  REVIEW: 'In Review',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
}

export default function AdminStatusPill({ status }: { status: string }) {
  return (
    <span className={cn('admin-pill', STATUS_CLASS[status] ?? 'admin-pill-draft')}>
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}
