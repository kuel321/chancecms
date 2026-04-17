'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'

type Props = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  style?: React.CSSProperties
  className?: string
  delay?: number
  stagger?: number
}

export function WordReveal({
  text,
  as: Tag = 'h2',
  style,
  className,
  delay = 0,
  stagger = 0.07,
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-40px' })
  const words = text.split(' ')

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement & HTMLParagraphElement>}
      className={className}
      style={{ ...style, display: 'flex', flexWrap: 'wrap', columnGap: '0.28em', rowGap: 0 }}
    >
      {words.map((word, i) => (
        <span key={i} style={{ overflow: 'hidden', display: 'inline-block', lineHeight: 'inherit' }}>
          <motion.span
            display="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: delay + i * stagger, ease: ease }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
