import React from 'react'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import type { Media } from '@/payload-types'

type HeroProps = {
  hero: Page['hero']
}

export function Hero({ hero }: HeroProps) {
  if (!hero || hero.type === 'none') return null

  const { type, richText, media } = hero

  const mediaUrl =
    media && typeof media === 'object' ? (media as Media).url : null

  if (type === 'highImpact') {
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center text-center bg-gray-900 text-white overflow-hidden">
        {mediaUrl && (
          <img
            src={mediaUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-20">
          {richText && <RichText data={richText} enableGutter={false} />}
        </div>
      </section>
    )
  }

  if (type === 'mediumImpact') {
    return (
      <section className="bg-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row gap-8 items-center">
          {richText && (
            <div className="flex-1">
              <RichText data={richText} enableGutter={false} />
            </div>
          )}
          {mediaUrl && (
            <div className="flex-1">
              <img src={mediaUrl} alt="" className="rounded-lg w-full object-cover" />
            </div>
          )}
        </div>
      </section>
    )
  }

  // lowImpact
  return (
    <section className="py-12 border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        {richText && <RichText data={richText} enableGutter={false} />}
      </div>
    </section>
  )
}
