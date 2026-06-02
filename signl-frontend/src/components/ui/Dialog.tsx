'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { CloseIcon } from './Icon'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  variant?: 'modal' | 'drawer'
  ariaLabel?: string
  children: ReactNode
  /** Hide the default header (caller renders their own). */
  hideHeader?: boolean
  /** Class for the panel — for custom widths/styling. */
  panelClassName?: string
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Accessible Dialog primitive used for the search command palette
 * and the saved-articles drawer. Implements:
 *   - Focus trap (Tab / Shift+Tab cycle inside the panel)
 *   - Esc to close
 *   - Click outside to close (overlay)
 *   - Body scroll lock
 *   - Restores focus to the previously focused element on close
 *   - role="dialog" + aria-modal
 */
export default function Dialog({
  open,
  onClose,
  title,
  variant = 'modal',
  ariaLabel,
  children,
  hideHeader,
  panelClassName,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Focus trap + restore focus
  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement | null

    const panel = panelRef.current
    if (!panel) return

    const focusables = panel.querySelectorAll<HTMLElement>(focusableSelector)
    const first = focusables[0]
    if (first) {
      first.focus()
    } else {
      panel.focus()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = panel.querySelectorAll<HTMLElement>(focusableSelector)
      if (items.length === 0) {
        e.preventDefault()
        return
      }
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  if (typeof window === 'undefined') return null

  const overlayClass = cn(
    'dialog-overlay',
    variant === 'drawer' && 'drawer',
  )

  return createPortal(
    <div
      className={overlayClass}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        tabIndex={-1}
        className={cn('dialog-panel', panelClassName)}
      >
        {!hideHeader && title ? (
          <div className="dialog-header">
            <h2 className="dialog-title">{title}</h2>
            <button
              type="button"
              className="icon-btn"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    document.body,
  )
}
