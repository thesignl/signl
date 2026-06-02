'use client'

import useBookmarks from '@/hooks/useBookmarks'

export default function BookmarkProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useBookmarks()
  return <>{children}</>
}
