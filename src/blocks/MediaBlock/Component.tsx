import React from 'react'
import type { MediaBlock as MediaBlockProps, Media } from '@/payload-types'
import { cn } from '@/utilities/ui'

type Props = MediaBlockProps & {
  className?: string
  imgClassName?: string
  captionClassName?: string
  enableGutter?: boolean
  disableInnerContainer?: boolean
}

export function MediaBlock({
  media,
  position = 'default',
  className,
  imgClassName,
  captionClassName,
  enableGutter = true,
  disableInnerContainer = false,
}: Props) {
  if (!media || typeof media !== 'object') return null

  const { url, alt, caption } = media as Media

  if (!url) return null

  const isFullscreen = position === 'fullscreen'

  return (
    <section className={cn('py-8', isFullscreen ? 'w-full' : '', className)}>
      <div className={cn(!disableInnerContainer && enableGutter ? 'max-w-5xl mx-auto px-6' : '')}>
        <img
          src={url}
          alt={alt ?? ''}
          className={cn('w-full rounded-lg object-cover', imgClassName)}
        />
        {caption && (
          <p className={cn('text-sm text-gray-500 mt-2 text-center', captionClassName)}>
            {typeof caption === 'string' ? caption : ''}
          </p>
        )}
      </div>
    </section>
  )
}
