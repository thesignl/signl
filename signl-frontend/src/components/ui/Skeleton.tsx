import { cn } from '@/lib/cn'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  rounded?: boolean
}

export default function Skeleton({
  width = '100%',
  height = 16,
  className,
  rounded,
}: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        width,
        height,
        borderRadius: rounded ? 999 : undefined,
      }}
      aria-hidden
    />
  )
}
