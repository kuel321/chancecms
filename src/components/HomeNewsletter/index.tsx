'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'

export function HomeNewsletter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{ background: 'var(--color-pine)', padding: '88px 52px' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: ease }}
        style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(240,224,199,0.45)',
            marginBottom: 16,
          }}
        >
          Stay in the Loop
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 400,
            color: 'var(--color-linen)',
            marginBottom: 14,
            lineHeight: 1.15,
          }}
        >
          Get updates delivered to you.
        </h2>
        <p
          style={{
            fontSize: 14,
            fontWeight: 300,
            lineHeight: 1.8,
            color: 'rgba(240,224,199,0.5)',
            marginBottom: 36,
          }}
        >
          News, announcements, and resources.
        </p>
        <form
          style={{ display: 'flex', gap: 0, maxWidth: 440, margin: '0 auto' }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Your email address"
            style={{
              flex: 1,
              padding: '14px 18px',
              background: 'var(--color-cream)',
              border: '1.5px solid rgba(0,38,15,0.18)',
              borderRight: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              color: 'var(--color-text)',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn-ember" style={{ flexShrink: 0 }}>
            Subscribe
          </button>
        </form>
      </motion.div>
    </section>
  )
}
