import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

const sizeMap = {
  oneThird: 'md:col-span-4',
  half: 'md:col-span-6',
  twoThirds: 'md:col-span-8',
  full: 'md:col-span-12',
}

export function ContentBlock({ columns }: ContentBlockProps) {
  if (!columns?.length) return null

  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-8">
        {columns.map((col, i) => (
          <div key={i} className={cn('col-span-12', sizeMap[col.size ?? 'full'])}>
            {col.richText && <RichText data={col.richText} enableGutter={false} />}
            {col.enableLink && col.link && (
              <a
                href={
                  col.link.type === 'custom'
                    ? (col.link.url ?? '#')
                    : typeof col.link.reference?.value === 'object'
                      ? `/${(col.link.reference.value as { slug?: string }).slug ?? ''}`
                      : '#'
                }
                target={col.link.newTab ? '_blank' : undefined}
                rel={col.link.newTab ? 'noopener noreferrer' : undefined}
                className="inline-block mt-4 text-sm font-medium underline hover:no-underline"
              >
                {col.link.label}
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
