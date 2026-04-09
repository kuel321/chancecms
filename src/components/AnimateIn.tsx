'use client'
import React from 'react'
import { motion, useInView, type Variants } from 'framer-motion'

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  /** Delay before the animation starts (seconds) */
  delay?: number
  /** Direction the element slides in from */
  from?: 'bottom' | 'left' | 'right' | 'none'
  /** Distance in px to travel */
  distance?: number
  /** Trigger once and stay visible */
  once?: boolean
}

export const AnimateIn: React.FC<AnimateInProps> = ({
  children,
  className,
  delay = 0,
  from = 'bottom',
  distance = 28,
  once = true,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '0px 0px -60px 0px' })

  const initial = {
    opacity: 0,
    x: from === 'left' ? -distance : from === 'right' ? distance : 0,
    y: from === 'bottom' ? distance : 0,
  }

  const variants: Variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

/** Wraps multiple children and staggers them in sequence */
interface StaggerInProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  from?: 'bottom' | 'left' | 'right' | 'none'
  distance?: number
  once?: boolean
}

export const StaggerIn: React.FC<StaggerInProps> = ({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  from = 'bottom',
  distance = 24,
  once = true,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '0px 0px -60px 0px' })

  const initial = {
    opacity: 0,
    x: from === 'left' ? -distance : from === 'right' ? distance : 0,
    y: from === 'bottom' ? distance : 0,
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }

  const itemVariants: Variants = {
    hidden: initial,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
