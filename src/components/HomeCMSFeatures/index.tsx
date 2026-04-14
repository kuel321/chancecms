'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'

export function HomeCMSFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{
      background: 'var(--color-midnight)',
      borderBottom: '1px solid var(--color-rule)',
      padding: '88px 52px',
      overflow: 'hidden',
    }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: ease }}
        style={{ maxWidth: 1100, margin: '0 auto' }}
      >
        <p className="sec-label" style={{ textAlign: 'center', marginBottom: 16 }}>Features</p>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(24px, 3vw, 38px)',
          fontWeight: 400, lineHeight: 1.15, textAlign: 'center',
          color: 'var(--color-linen)', marginBottom: 52,
        }}>
          Everything you need, nothing you don&apos;t.
        </h2>
        <img
          src="/3.png"
          alt="ChanceCMS feature overview"
          style={{
            width: '100%',
            display: 'block',
            borderRadius: 8,
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}
        />
      </motion.div>
    </section>
  )
}
