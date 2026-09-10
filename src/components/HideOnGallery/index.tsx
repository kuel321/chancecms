'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export function HideOnGallery({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/gallery' || pathname.startsWith('/gallery/')) return null

  return <>{children}</>
}
