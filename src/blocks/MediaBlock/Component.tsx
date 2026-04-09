import React from 'react'
import type { MediaBlock as MediaBlockProps, Media } from '@/payload-types'

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
  enableGutter = true,
  disableInnerContainer = false,
}: Props) {
  if (!media || typeof media !== 'object') return null
  const { url, alt } = media as Media
  if (!url) return null

  const isFullscreen = position === 'fullscreen'

  return (
    <section style={{ padding: isFullscreen ? 0 : '40px 52px' }}>
      <div style={!disableInnerContainer && enableGutter && !isFullscreen ? { maxWidth: 1100, margin: '0 auto' } : {}}>
        <img src={url} alt={alt ?? ''} style={{ width: '100%', display: 'block' }} />
      </div>
    </section>
  )
}
