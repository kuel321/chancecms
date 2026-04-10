'use client'
import React from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { Page, Media } from '@/payload-types'
import RichText from '@/components/RichText'
import { ease } from '@/utilities/motion'

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: ease } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

export function Hero({ hero }: HeroProps) {
  if (!hero || hero.type === 'none') return null

  const { type, richText, link, media } = hero
  const mediaUrl = media && typeof media === 'object' ? (media as Media).url : null

  /* ── High Impact ── */
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
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 55% 70% at 75% 55%, rgba(241,90,36,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 60% at 5%  40%, rgba(0,38,15,0.04)  0%, transparent 60%)
          `,
        }} />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          style={{ padding: '100px 64px 80px', position: 'relative', zIndex: 2 }}
        >
          {richText && <RichText data={richText} enableGutter={false} />}
          {link?.label && (
            <div style={{ marginTop: 44 }}>
              <a href={resolveHref(link)} className={link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}>
                {link.label}
              </a>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          style={{
            height: '100%', minHeight: '94vh',
            background: 'var(--color-pine)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 2,
          }}
        >
          <motion.img
            src={mediaUrl ?? '/media/chance-logo-no-letters-png.png'}
            alt=""
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: mediaUrl ? 1 : 0.6, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: ease }}
            style={{ height: 200, filter: 'drop-shadow(0 16px 48px rgba(0,0,0,0.35))' }}
          />
        </motion.div>
      </section>
    )
  }

  /* ── Medium Impact ── */
  if (type === 'mediumImpact') {
    return (
      <section style={{
        background: 'var(--color-cream)',
        borderBottom: '1px solid var(--color-rule)',
        padding: '80px 52px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ flex: '1 1 320px' }}>
            {richText && <RichText data={richText} enableGutter={false} />}
            {link?.label && (
              <div style={{ marginTop: 32 }}>
                <a href={resolveHref(link)} className={link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}>
                  {link.label}
                </a>
              </div>
            )}
          </motion.div>
          {mediaUrl && (
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
              style={{ flex: '1 1 320px' }}
            >
              <img src={mediaUrl} alt="" style={{ width: '100%', display: 'block' }} />
            </motion.div>
          )}
        </div>
      </section>
    )
  }

  /* ── Low Impact ── */
  return (
    <section style={{
      background: 'var(--color-cream)',
      borderBottom: '1px solid var(--color-rule)',
      padding: '72px 52px',
    }}>
      <motion.div variants={fadeUp} initial="hidden" animate="show" style={{ maxWidth: 1100, margin: '0 auto' }}>
        {richText && <RichText data={richText} enableGutter={false} />}
        {link?.label && (
          <div style={{ marginTop: 28 }}>
            <a href={resolveHref(link)} className={link.appearance === 'outline' ? 'btn-outline' : 'btn-dark'}>
              {link.label}
            </a>
          </div>
        )}
      </motion.div>
    </section>
  )
}
