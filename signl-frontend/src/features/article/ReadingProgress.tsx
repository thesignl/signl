'use client'

import { useEffect, useState } from 'react'

/**
 * Thin progress bar pinned under the navbar on /article/[slug].
 * Calmly indicates reading position — restrained, no glow, no shadow,
 * 80ms transition. Honors prefers-reduced-motion via the global rule
 * already in globals.css.
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - doc.clientHeight
      if (total <= 0) {
        setProgress(0)
        return
      }
      const next = Math.min(
        100,
        Math.max(0, (window.scrollY / total) * 100),
      )
      setProgress(next)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="story-progress" aria-hidden>
      <div
        className="story-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
