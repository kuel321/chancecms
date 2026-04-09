'use client'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export function HomeHero() {
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

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        style={{ padding: '100px 64px 80px', position: 'relative', zIndex: 2 }}
      >
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.35em',
          textTransform: 'uppercase', color: 'var(--color-ember)', marginBottom: 22,
        }}>
          Websites & Software Solutions
        </p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(40px, 5vw, 64px)',
          fontWeight: 400, lineHeight: 1.1,
          color: 'var(--color-midnight)', marginBottom: 26,
        }}>
          Digital products built to <em style={{ fontStyle: 'italic', color: 'var(--color-pine)' }}>perform.</em>
        </h1>
        <p style={{
          fontSize: 16, fontWeight: 300, lineHeight: 1.85,
          color: 'var(--color-muted)', maxWidth: 420, marginBottom: 44,
        }}>
          We design and develop fast, modern websites and scalable software solutions for businesses ready to grow, streamline operations, and stand out online.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <a href="#portfolio" className="btn-dark">See Our Work</a>
          <a href="#contact" className="btn-outline">Get Started</a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          height: '100%', minHeight: '94vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', zIndex: 2,
        }}
      >
        <motion.img
          src="/media/chance-logo-no-letters-png.png"
          alt="Chasing a Chance"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 350 }}
        />
      </motion.div>
    </section>
  )
}