'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'
import type { Variants } from 'framer-motion'

const services = [
  {
    label: 'Web Design & Development',
    description:
      'Professional websites built from scratch. Fast, mobile-friendly, and designed to make a strong first impression. Every site uses Framer Motion for smooth animations — the same library powering Figma, Linear, and Vercel. We have built sites for local campaigns, small businesses, and media companies including WV Cams.',
    cta: 'Get a site built',
  },
  {
    label: 'Custom Software',
    description:
      'When off-the-shelf tools fall short, we build the real thing. Custom dashboards, internal tools, and web applications tailored to how your business actually runs. Our work has supported clients ranging from local operations to the U.S. Department of Defense.',
    cta: 'Tell us what you need',
  },

  {
    label: 'Hosting & Ongoing Support',
    description:
      'We keep your site running and up to date. No mystery bills or surprise fees. You get reliable hosting, quick fixes when something breaks, and a real person to call.',
    cta: 'Ask about support plans',
  },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: ease },
  }),
}

export function HomeServices() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section
      id="services"
      style={{
        background: 'var(--color-cream)',
        padding: '88px 52px',
        borderBottom: '1px solid var(--color-rule)',
      }}
    >
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p className="sec-label">What We Do</p>
        <h2 className="sec-heading" style={{ marginBottom: 60 }}>
          Services built for real businesses.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 32,
          }}
        >
          {services.map((service, i) => (
            <motion.div
              key={service.label}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              style={{
                background: 'var(--color-parchment)',
                border: '1px solid var(--color-rule)',
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 2,
                  background: 'var(--color-ember)',
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: 'var(--color-midnight)',
                }}
              >
                {service.label}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'var(--color-muted)',
                  flex: 1,
                }}
              >
                {service.description}
              </p>
              <a
                href="mailto:chasingachancellc@gmail.com"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-pine)',
                  textDecoration: 'none',
                  marginTop: 8,
                }}
              >
                {service.cta} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
