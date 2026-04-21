'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import type { Media } from '@/payload-types'
import { ease } from '@/utilities/motion'
import { WordReveal } from '@/components/WordReveal'

type Project = {
  id: number
  clientName: string
  description?: string | null
  image: number | Media
  url?: string | null
  order?: number | null
}

const IFRAME_WIDTH = 1440
const IFRAME_HEIGHT = 3000

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  // Re-fires on every viewport enter/exit — used to trigger mobile auto-play
  const mobileInView = useInView(containerRef, { once: false, margin: '-40px' })
  const [hovered, setHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)
  const [iframeScale, setIframeScale] = useState(0.25)
  const [containerHeight, setContainerHeight] = useState(220)

  const imageUrl =
    project.image && typeof project.image === 'object' ? (project.image as Media).url : null

  useEffect(() => {
    setIsMobile(window.matchMedia('(hover: none)').matches)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const { width, height } = containerRef.current.getBoundingClientRect()
    setIframeScale(width / IFRAME_WIDTH)
    setContainerHeight(height)
  }, [])

  // On mobile: reload iframe each time it leaves the viewport so animations replay on re-entry
  useEffect(() => {
    if (isMobile && !mobileInView) {
      setReloadKey(k => k + 1)
    }
  }, [isMobile, mobileInView])

  const scrollTarget = Math.max(0, IFRAME_HEIGHT * iframeScale - containerHeight - 20)
  const showIframe = project.url && (isMobile ? mobileInView : hovered)

  const handleMouseLeave = () => {
    setHovered(false)
    setReloadKey(k => k + 1)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div
        ref={containerRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          overflow: 'hidden',
          background: 'var(--color-parchment)',
          border: '1px solid var(--color-rule)',
          marginBottom: 20,
          aspectRatio: '16/10',
          position: 'relative',
        }}
      >
        {/* Screenshot — fades out when iframe is showing */}
        <motion.div
          animate={{ opacity: showIframe ? 0 : 1 }}
          transition={{ duration: 0.35, ease }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={project.clientName}
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', filter: 'grayscale(100%)' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                No Image
              </span>
            </div>
          )}
        </motion.div>

        {/* Live iframe */}
        {showIframe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease }}
            style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
          >
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -scrollTarget }}
              transition={{ duration: 14, delay: 0.5, ease: 'linear' }}
            >
              <iframe
                key={reloadKey}
                src={project.url!}
                style={{
                  width: IFRAME_WIDTH,
                  height: IFRAME_HEIGHT,
                  border: 'none',
                  transformOrigin: '0 0',
                  transform: `scale(${iframeScale})`,
                  pointerEvents: 'none',
                  display: 'block',
                }}
                tabIndex={-1}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Card meta — always visible */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, color: 'var(--color-midnight)', lineHeight: 1.3 }}>
          {project.clientName}
        </h3>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-pine)',
              textDecoration: 'none',
              flexShrink: 0,
              marginLeft: 16,
            }}
          >
            Visit →
          </a>
        )}
      </div>
      {project.description && (
        <p style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-muted)', lineHeight: 1.7 }}>
          {project.description}
        </p>
      )}
    </motion.div>
  )
}

export function HomePortfolio({ projects }: { projects: Project[] }) {
  return (
    <section id="portfolio" style={{ padding: '88px 52px', borderBottom: '1px solid var(--color-rule)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p className="sec-label">Our Work</p>
        <WordReveal text="Here's some of our work." as="h2" className="sec-heading" style={{ marginBottom: 60 }} />

        {projects.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', fontWeight: 300, fontStyle: 'italic' }}>
            Portfolio items will appear here once added in the admin panel.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 40 }}>
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
