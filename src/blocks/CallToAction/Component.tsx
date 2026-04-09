import React from 'react'
import type { CallToActionBlock as CallToActionBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'

function resolveHref(link: CallToActionBlockProps['links'][number]['link']): string {
  if (link.type === 'custom') return link.url ?? '#'
  if (typeof link.reference?.value === 'object') {
    const val = link.reference.value as { slug?: string }
    return `/${val.slug ?? ''}`
  }
  return '#'
}

export function CallToActionBlock({ richText, links }: CallToActionBlockProps) {
  return (
    <section style={{
      background: 'var(--color-midnight)',
      padding: '88px 52px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        {richText && <RichText data={richText} enableGutter={false} />}
        {links && links.length > 0 && (
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 44 }}>
            {links.map(({ link }, i) => (
              <a
                key={i}
                href={resolveHref(link)}
                target={link.newTab ? '_blank' : undefined}
                rel={link.newTab ? 'noopener noreferrer' : undefined}
                className={link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}
                style={link.appearance !== 'outline' ? {
                  background: 'var(--color-linen)',
                  color: 'var(--color-midnight)',
                } : {
                  borderColor: 'rgba(240,224,199,0.3)',
                  color: 'var(--color-linen)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
