'use client'

import { useEffect, useRef, type TextareaHTMLAttributes } from 'react'

/**
 * A textarea that grows with its content (no scrollbar, no fixed rows). Used for
 * the headline, deck, synopsis, block bodies and framework steps so the writing
 * surface reads like a document, matching the reference editor.
 */
export default function AutoTextarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const resize = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  useEffect(() => {
    resize()
  }, [props.value])

  return (
    <textarea
      {...props}
      ref={ref}
      onInput={(e) => {
        resize()
        props.onInput?.(e)
      }}
    />
  )
}
