'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'
import { WordReveal } from '@/components/WordReveal'

type Props = {
  label?: string | null
  heading: string
  subheading?: string | null
}

export function PageHeroBlock({ label, heading, subheading }: Props) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section
      ref={ref}
      style={{
        background: 'var(--color-midnight)',
        padding: '120px 52px 100px',
        borderBottom: '1px solid rgba(240,224,199,0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        style={{ y, maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 2 }}
      >
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--color-ember)',
              marginBottom: 24,
            }}
          >
            {label}
          </motion.p>
        )}

        <WordReveal
          text={heading}
          as="h1"
          delay={0.15}
          stagger={0.07}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(38px, 5vw, 64px)',
            fontWeight: 400,
            lineHeight: 1.1,
            color: 'var(--color-linen)',
            marginBottom: subheading ? 32 : 0,
          }}
        />

        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            style={{
              fontSize: 17,
              fontWeight: 300,
              lineHeight: 1.85,
              color: 'rgba(240,224,199,0.55)',
              maxWidth: 520,
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
            }}
          >
            {subheading}
          </motion.p>
        )}
      </motion.div>
    </section>
  )
}
