'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

/**
 * Like framer-motion's useInView({ once: true }) but also triggers immediately
 * if the element is already in the viewport on mount (e.g. navigated to via hash link).
 */
export function useIsVisible(margin = '-60px') {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin })
  const [alreadyVisible, setAlreadyVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setAlreadyVisible(true)
    }
  }, [])

  return { ref, visible: inView || alreadyVisible }
}
