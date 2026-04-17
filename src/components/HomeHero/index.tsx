'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'
import { WordReveal } from '@/components/WordReveal'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: ease } },
}

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const logoY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section
      ref={sectionRef}
      className="hero-section"
      style={{
        background: 'var(--color-cream)',
        minHeight: '94vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-rule)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        style={{ padding: '100px 64px 80px', position: 'relative', zIndex: 2, y: textY }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-ember)',
            marginBottom: 22,
          }}
        >
          Web Design & Software for Local Business
        </p>
        <WordReveal
          text="Your business deserves a website that actually works."
          as="h1"
          delay={0.2}
          stagger={0.06}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: 'var(--color-midnight)',
            marginBottom: 26,
          }}
        />
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 16,
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1.85,
            color: 'var(--color-pine)',
            maxWidth: 420,
            position: 'relative',
            top: -20,
          }}
        >
          (And looks good too)
        </p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 300,
            lineHeight: 1.85,
            color: 'var(--color-muted)',
            maxWidth: 420,
            marginBottom: 44,
          }}
        >
          We build fast, professional websites and custom software for local businesses. Simple
          sites that get you found online, or full tools that run your operations.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#portfolio" className="btn-dark">
            See Our Work
          </a>
          <a href="#contact" className="btn-outline">
            Get a Free Quote
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          height: '100%',
          minHeight: '94vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.img
          src="/media/chance-logo-no-letters-png.png"
          alt="Chasing a Chance"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: ease }}
          style={{ height: 350, y: logoY }}
        />
      </motion.div>
    </section>
  )
}
