import React from 'react'
import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

const spanMap = { oneThird: '33%', half: '50%', twoThirds: '66%', full: '100%' }

export function ContentBlock({ columns }: ContentBlockProps) {
  if (!columns?.length) return null

  return (
    <section style={{ padding: '88px 52px' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'flex', flexWrap: 'wrap', gap: 40,
      }}>
        {columns.map((col, i) => (
          <div key={i} style={{ flex: `1 1 ${spanMap[col.size ?? 'full']}`, minWidth: 280 }}>
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
                className={col.link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}
                style={{ marginTop: 24 }}
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
