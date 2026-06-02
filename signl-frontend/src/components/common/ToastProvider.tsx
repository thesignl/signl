'use client'

import type { ReactNode } from 'react'
import { ToastRegion } from '@/components/ui/Toast'

export default function ToastProvider({ children }: { children: ReactNode }) {
  return <ToastRegion>{children}</ToastRegion>
}
