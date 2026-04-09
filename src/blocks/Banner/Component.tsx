import React from 'react'
import type { BannerBlock as BannerBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

const styleMap = {
  info: 'bg-blue-50 border-blue-300 text-blue-900',
  warning: 'bg-yellow-50 border-yellow-300 text-yellow-900',
  error: 'bg-red-50 border-red-300 text-red-900',
  success: 'bg-green-50 border-green-300 text-green-900',
}

export function BannerBlock({
  style = 'info',
  content,
  className,
}: BannerBlockProps & { className?: string }) {
  return (
    <div className={cn('border-l-4 px-4 py-3 rounded my-4', styleMap[style ?? 'info'], className)}>
      {content && <RichText data={content} enableGutter={false} enableProse={false} />}
    </div>
  )
}
