'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'

export function HomeCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section style={{ background: 'var(--color-midnight)', padding: '100px 52px' }}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: ease }}
        style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}
      >
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.35em',
          textTransform: 'uppercase', color: 'var(--color-ember)', marginBottom: 22,
        }}>
          Ready to Build?
        </p>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(30px, 4vw, 50px)',
          fontWeight: 400, lineHeight: 1.15,
          color: 'var(--color-linen)', marginBottom: 24,
        }}>
          Let's build your digital product <em style={{ fontStyle: 'italic', color: 'rgba(240,224,199,0.6)' }}>the right way.</em>
        </h2>
        <p style={{
          fontSize: 15, fontWeight: 300, lineHeight: 1.85,
          color: 'rgba(240,224,199,0.5)', maxWidth: 480, margin: '0 auto 44px',
        }}>
          From concept to launch — we design, develop, and deliver scalable web and software solutions tailored to your business.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#contact" className="btn-ember">Get Started</a>
          <a href="#portfolio" className="btn-outline" style={{ borderColor: 'rgba(240,224,199,0.25)', color: 'var(--color-linen)' }}>
            See Our Work
          </a>
        </div>
      </motion.div>
    </section>
  )
}