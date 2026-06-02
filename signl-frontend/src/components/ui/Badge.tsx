import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type BadgeVariant = 'pro' | 'free' | 'verified' | 'featured'

export default function Badge({
  variant = 'free',
  children,
  className,
}: {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn('badge', `badge-${variant}`, className)}>
      {children}
    </span>
  )
}
