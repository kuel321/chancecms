'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const items = [
  'Web Design',
  'Custom Software',
  'Hosting & Support',
  'Local Business',
  'Campaign Sites',
  'Ecommerce',
  'West Virginia',
]

const track = [...items, ...items, ...items]

export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Scroll drives the marquee: left at top, right at bottom of viewport crossing
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-33.333%'])

  return (
    <div
      ref={ref}
      style={{
        background: 'var(--color-midnight)',
        borderTop: '1px solid rgba(240,224,199,0.06)',
        borderBottom: '1px solid rgba(240,224,199,0.06)',
        overflow: 'hidden',
        padding: '18px 0',
      }}
    >
      <motion.div
        style={{
          x,
          display: 'flex',
          gap: 0,
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0,
              fontFamily: 'var(--font-sans)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: i % 2 === 0 ? 'rgba(240,224,199,0.4)' : 'var(--color-ember)',
              whiteSpace: 'nowrap',
              paddingRight: 40,
            }}
          >
            {item}
            <span style={{ marginLeft: 40, color: 'rgba(240,224,199,0.15)', letterSpacing: 0 }}>
              ·
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
