import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface FieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  helper?: string
  error?: string | null
  trailing?: ReactNode
}

const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, helper, error, trailing, id: providedId, className, ...rest },
  ref,
) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  const helperId = helper ? `${id}-helper` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy =
    [helperId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn('field-input', className)}
          {...rest}
        />
        {trailing ? (
          <div
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            {trailing}
          </div>
        ) : null}
      </div>
      {helper && !error ? (
        <p id={helperId} className="field-helper">
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
})

export default Field
