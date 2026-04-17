'use client'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'
import { WordReveal } from '@/components/WordReveal'

function FadeUp({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default function AboutPage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <>
      {/* Hero */}
      <section
        ref={heroRef}
        className="about-hero"
        style={{
          background: 'var(--color-midnight)',
          padding: '120px 52px 100px',
          borderBottom: '1px solid rgba(240,224,199,0.08)',
          overflow: 'hidden',
          position: 'relative',
          // mobile handled by .about-hero class
        }}
      >
        <motion.div
          style={{ y: heroY, maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 2 }}
        >
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
            Hurricane, WV — Est. 2023
          </motion.p>
          <WordReveal
            text="Built around a very good boy."
            as="h1"
            delay={0.15}
            stagger={0.07}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(38px, 5vw, 64px)',
              fontWeight: 400,
              lineHeight: 1.1,
              color: 'var(--color-linen)',
              marginBottom: 32,
            }}
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            style={{
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.85,
              color: 'rgba(240,224,199,0.55)',
              maxWidth: 520,
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
            }}
          >
            Chasing a Chance is a web design and software company based in Hurricane, West Virginia.
          </motion.p>
        </motion.div>
      </section>

      {/* Origin — photo + logo side by side */}
      <section
        className="about-section"
        style={{
          background: 'var(--color-cream)',
          padding: '100px 52px',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <FadeUp>
            <p className="sec-label">The "Chance" in Chasing a Chance</p>
          </FadeUp>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 64,
              alignItems: 'center',
              marginTop: 48,
            }}
            className="about-origin-grid"
          >
            {/* Photo side */}
            <FadeUp delay={0.1}>
              <img
                src="/about-media/chance.jpg"
                alt="Chance"
                style={{
                  width: '100%',
                  display: 'block',
                  filter: 'grayscale(20%)',
                }}
              />
            </FadeUp>

            {/* Story side */}
            <FadeUp delay={0.25}>
              <div
                className="about-story-inner"
                style={{ display: 'flex', gap: 36, alignItems: 'center' }}
              >
                <img
                  src="/CHASING-A-CHANCE-REAL-FINAL-W-LETTERS.svg"
                  alt="Chasing a Chance logo"
                  className="about-story-logo"
                  style={{ width: 232, height: 'auto', flexShrink: 0 }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: 1.9,
                      color: 'var(--color-midnight)',
                      marginBottom: 20,
                    }}
                  >
                    In 2017, we walked into the Kanawha County Animal Shelter and left with a dog
                    named Chance (Well, the shelter named him "Harvey" but c'mon, did he look like a
                    Harvey?). He was our first dog. The logo is drawn from a photo of him in our
                    backyard.
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: 1.9,
                      color: 'var(--color-midnight)',
                      marginBottom: 20,
                    }}
                  >
                    When the business started in 2023, naming it after him felt right. He had a way
                    of making everything feel worth showing up for.
                  </p>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 400,
                      lineHeight: 1.9,
                      color: 'var(--color-midnight)',
                      marginBottom: 20,
                    }}
                  >
                    Chance was diagnosed with cancer and passed in 2025. We want his name to live on
                    in a company that builds good things for good people.
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* About the work */}
      <section
        className="about-section"
        style={{
          background: 'var(--color-parchment)',
          padding: '100px 52px',
          borderBottom: '1px solid var(--color-rule)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 80,
            alignItems: 'start',
          }}
          className="about-work-grid"
        >
          <FadeUp>
            <p className="sec-label" style={{ marginBottom: 16 }}>
              The Work
            </p>
            <p
              style={{
                fontSize: 13,
                fontWeight: 400,
                lineHeight: 1.8,
                color: 'var(--color-muted)',
              }}
            >
              Hurricane, WV
              <br />
              Est. 2023
            </p>
          </FadeUp>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <FadeUp delay={0.1}>
              <WordReveal
                text="We build things that actually work for the businesses that use them."
                as="h2"
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 400,
                  color: 'var(--color-midnight)',
                  lineHeight: 1.2,
                  marginBottom: 32,
                }}
              />
            </FadeUp>

            <FadeUp delay={0.15}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.9,
                  color: 'var(--color-muted)',
                }}
              >
                Chasing a Chance started as a freelance operation and grew into a full web design
                and software shop. The clients range from local service businesses and political
                campaigns to media companies and federal contractors. The work ranges from a clean
                five-page site for a plumber in Putnam County to custom software supporting
                operations for the U.S. Department of Defense.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.9,
                  color: 'var(--color-muted)',
                }}
              >
                The approach is the same regardless of the project. Figure out what the client
                actually needs, build it well, and make sure they can use it without a manual. No
                bloated proposals. No mystery invoices. Just good work delivered straight.
              </p>
            </FadeUp>

            <FadeUp delay={0.25}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 400,
                  lineHeight: 1.9,
                  color: 'var(--color-muted)',
                }}
              >
                Based in Hurricane, West Virginia. Working with clients across the state and beyond.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: 'var(--color-cream)',
          padding: '88px 52px',
          textAlign: 'center',
        }}
      >
        <FadeUp>
          <p className="sec-label" style={{ marginBottom: 20 }}>
            Let&apos;s Work Together
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(22px, 3vw, 36px)',
              fontWeight: 400,
              color: 'var(--color-midnight)',
              marginBottom: 36,
              lineHeight: 1.3,
            }}
          >
            Good websites for good businesses.
          </p>
          <a href="/#contact" className="btn-dark">
            Start a Project
          </a>
        </FadeUp>
      </section>
    </>
  )
}
