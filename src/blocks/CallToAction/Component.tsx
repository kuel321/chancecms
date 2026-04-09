import React from 'react'
import type { CallToActionBlock as CallToActionBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

export function CallToActionBlock({ richText, links }: CallToActionBlockProps) {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="max-w-3xl mx-auto px-6 text-center">
        {richText && <RichText data={richText} enableGutter={false} />}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {links.map(({ link }, i) => {
              const href =
                link.type === 'custom'
                  ? (link.url ?? '#')
                  : typeof link.reference?.value === 'object'
                    ? `/${(link.reference.value as { slug?: string }).slug ?? ''}`
                    : '#'

              const isOutline = link.appearance === 'outline'

              return (
                <a
                  key={i}
                  href={href}
                  target={link.newTab ? '_blank' : undefined}
                  rel={link.newTab ? 'noopener noreferrer' : undefined}
                  className={
                    isOutline
                      ? 'border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-gray-900 transition-colors'
                      : 'bg-white text-gray-900 px-6 py-3 rounded hover:bg-gray-100 transition-colors'
                  }
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
