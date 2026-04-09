'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function HomeCMS() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{
      background: 'var(--color-pine)',
      borderTop: '1px solid var(--color-rule)',
      borderBottom: '1px solid var(--color-rule)',
      padding: '88px 52px',
      overflow: 'hidden',
    }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 80, alignItems: 'center', flexWrap: 'wrap' }}>

        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: '1 1 320px' }}
        >
          <p className="sec-label">The CMS</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(26px, 3.5vw, 42px)',
            fontWeight: 400, lineHeight: 1.15,
            color: 'var(--color-linen)', marginBottom: 24,
          }}>
            A minimal, elegant<br />editing experience.
          </h2>
          <p style={{
            fontSize: 15, fontWeight: 300, lineHeight: 1.85,
            color: 'var(--color-linen)', marginBottom: 20,
          }}>
            Every site we build is powered by a clean, purpose-built admin panel. No bloated dashboards, no overwhelming menus — just a focused interface that makes updating your content feel effortless.
          </p>
          <p style={{
            fontSize: 15, fontWeight: 300, lineHeight: 1.85,
            color: 'var(--color-linen)', marginBottom: 36,
          }}>
            Publish a post, update your homepage, or add new pages — all without touching a line of code.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, color: 'var(--color-linen)' }}>
            {[
              'Draft & publish workflow',
              'Live preview as you edit',
              'Media management built in',
              'Role-based access control',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--color-linen)', flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-linen)' }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={{ flex: '1 1 420px', position: 'relative' }}
        >
          {/* Decorative pine bar behind the screenshot */}
          <div />
          <img
            src="/media/hh-cms-new-1.png"
            alt="ChanceCMS admin interface"
            style={{
              width: '100%',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
            }}
          />
        </motion.div>

      </div>
    </section>
  )
}
