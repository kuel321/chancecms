'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Media } from '@/payload-types'
import { ease } from '@/utilities/motion'

type Project = {
  id: number
  clientName: string
  description?: string | null
  image: number | Media
  url?: string | null
  order?: number | null
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const imageUrl =
    project.image && typeof project.image === 'object' ? (project.image as Media).url : null

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: ease }}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div
        style={{
          overflow: 'hidden',
          background: 'var(--color-parchment)',
          border: '1px solid var(--color-rule)',
          marginBottom: 20,
          aspectRatio: '16/10',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.clientName}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              filter: 'grayscale(100%)',
              transition: 'transform 0.5s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              No Image
            </span>
          </div>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 18,
            fontWeight: 400,
            color: 'var(--color-midnight)',
            lineHeight: 1.3,
          }}
        >
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
        <p style={{ fontSize: 13, fontWeight: 300, color: 'var(--color-muted)', lineHeight: 1.7 }}>
          {project.description}
        </p>
      )}
    </motion.div>
  )
}

export function HomePortfolio({ projects }: { projects: Project[] }) {
  return (
    <section
      id="portfolio"
      style={{ padding: '88px 52px', borderBottom: '1px solid var(--color-rule)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p className="sec-label">Our Work</p>
        <h2 className="sec-heading">Websites we've built</h2>

        {projects.length === 0 ? (
          <p style={{ color: 'var(--color-muted)', fontWeight: 300, fontStyle: 'italic' }}>
            Portfolio items will appear here once added in the admin panel.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 40,
            }}
          >
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
