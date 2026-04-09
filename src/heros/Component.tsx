import React from 'react'
import type { Page, Media } from '@/payload-types'
import RichText from '@/components/RichText'

type HeroProps = { hero: Page['hero'] }

function resolveHref(link: Page['hero']['link']): string {
  if (!link) return '#'
  if (link.type === 'custom') return link.url ?? '#'
  if (typeof link.reference?.value === 'object') {
    const val = link.reference.value as { slug?: string }
    return `/${val.slug ?? ''}`
  }
  return '#'
}

export function Hero({ hero }: HeroProps) {
  if (!hero || hero.type === 'none') return null

  const { type, richText, link, media } = hero
  const mediaUrl = media && typeof media === 'object' ? (media as Media).url : null

  /* ── High Impact: full-height split (text left, pine panel right) ── */
  if (type === 'highImpact') {
    return (
      <section style={{
        background: 'var(--color-cream)',
        minHeight: '94vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-rule)',
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* subtle radial glows */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 55% 70% at 75% 55%, rgba(241,90,36,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 60% at 5%  40%, rgba(0,38,15,0.04)  0%, transparent 60%)
          `,
        }} />

        {/* Text side */}
        <div style={{ padding: '100px 64px 80px', position: 'relative', zIndex: 2 }}>
          {richText && <RichText data={richText} enableGutter={false} />}
          {link?.label && (
            <div style={{ marginTop: 44 }}>
              <a href={resolveHref(link)} className={link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}>
                {link.label}
              </a>
            </div>
          )}
        </div>

        {/* Pine panel */}
        <div style={{
          height: '100%', minHeight: '94vh',
          background: 'var(--color-pine)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 2,
        }}>
          {mediaUrl
            ? <img src={mediaUrl} alt="" style={{ height: 200, filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.35))' }} />
            : <img src="/media/chance-logo-no-letters-png.png" alt="" style={{ height: 200, opacity: 0.6 }} />
          }
        </div>
      </section>
    )
  }

  /* ── Medium Impact: text + image side by side on cream bg ── */
  if (type === 'mediumImpact') {
    return (
      <section style={{
        background: 'var(--color-cream)',
        borderBottom: '1px solid var(--color-rule)',
        padding: '80px 52px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'flex', gap: 64, alignItems: 'center',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: '1 1 320px' }}>
            {richText && <RichText data={richText} enableGutter={false} />}
            {link?.label && (
              <div style={{ marginTop: 32 }}>
                <a href={resolveHref(link)} className={link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}>
                  {link.label}
                </a>
              </div>
            )}
          </div>
          {mediaUrl && (
            <div style={{ flex: '1 1 320px' }}>
              <img src={mediaUrl} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
          )}
        </div>
      </section>
    )
  }

  /* ── Low Impact: simple text banner ── */
  return (
    <section style={{
      background: 'var(--color-cream)',
      borderBottom: '1px solid var(--color-rule)',
      padding: '72px 52px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {richText && <RichText data={richText} enableGutter={false} />}
        {link?.label && (
          <div style={{ marginTop: 28 }}>
            <a href={resolveHref(link)} className={link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}>
              {link.label}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
