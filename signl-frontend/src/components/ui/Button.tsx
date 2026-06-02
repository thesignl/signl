import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  iconBefore?: ReactNode
  iconAfter?: ReactNode
}

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  accent: 'btn-accent',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  link: 'btn-link',
}
const sizeClass: Record<Size, string> = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading,
    disabled,
    iconBefore,
    iconAfter,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'btn',
        sizeClass[size],
        variantClass[variant],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span aria-hidden className="btn-spinner">
          <svg width="14" height="14" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="40 60"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </span>
      ) : (
        iconBefore
      )}
      <span>{children}</span>
      {!loading && iconAfter}
    </button>
  )
})

export default Button
