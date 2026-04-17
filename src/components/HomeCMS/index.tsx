'use client'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'

export function HomeCMS() {
  const sectionRef = useRef<HTMLElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const logoInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const logoY = useTransform(scrollYProgress, [0, 1], ['-18%', '18%'])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-pine)',
        borderTop: '1px solid var(--color-rule)',
        borderBottom: '1px solid var(--color-rule)',
        padding: '88px 52px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Floating scroll-following logo */}
      <motion.div
        style={{
          position: 'absolute',
          right: 28,
          top: '50%',
          marginTop: -110,
          y: logoY,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <motion.img
          src="/CHASING-A-CHANCE-REAL-FINAL-W-LETTERS.svg"
          alt=""
          className="background-logo"
          initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
          animate={logoInView ? { clipPath: 'inset(0% 0 0 0)', opacity: 0.18 } : {}}
          transition={{ duration: 1.4, ease: ease, delay: 0.3 }}
          style={{}}
        />
      </motion.div>
      <div
        ref={ref}
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          gap: 80,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: ease }}
          style={{ flex: '1 1 320px' }}
        >
          <p className="sec-label">You&apos;re in Control</p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(26px, 3.5vw, 42px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: 'var(--color-linen)',
              marginBottom: 24,
            }}
          >
            Update your site yourself,
            <br />
            no developer needed.
          </h2>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.85,
              color: 'var(--color-linen)',
              marginBottom: 20,
            }}
          >
            Every site we build comes with a clean, easy-to-use admin panel. Change your hours, post
            an announcement, add a new service whenever you need to, on your own schedule.
          </p>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.85,
              color: 'var(--color-linen)',
              marginBottom: 36,
            }}
          >
            No subscriptions to a page builder, just log in and go.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              color: 'var(--color-linen)',
            }}
          >
            {[
              'Edit content without touching code',
              'Publish & schedule pages or posts',
              'Upload photos and manage media',
              'Simple enough for anyone on your team',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-linen)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-linen)' }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15, ease: ease }}
          style={{ flex: '1 1 420px', position: 'relative' }}
        >
          <img
            src="/media/hh-cms-new-1.png"
            alt="ChanceCMS admin interface"
            style={{
              width: '100%',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              borderRadius: 6,
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
