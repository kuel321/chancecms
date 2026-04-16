'use client'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ease } from '@/utilities/motion'
import type { Variants } from 'framer-motion'

const features = [
  {
    title: 'Unlimited Pages & Content',
    body: 'Add as many pages, posts, and sections as your business needs. No tier limits, no content caps.',
  },
  {
    title: 'Ecommerce Ready',
    body: 'Sell products, take orders, and manage inventory. We can wire up a full storefront that you control.',
  },
  {
    title: 'Forms & Lead Capture',
    body: 'Contact forms, quote requests, sign-ups. Submissions go straight to your inbox or a connected CRM.',
  },
  {
    title: 'Newsletter & Email',
    body: 'Collect subscribers and send email campaigns without a separate platform eating into your budget.',
  },
  {
    title: 'Media Management',
    body: 'Upload photos, PDFs, and files in one place. Resize, organize, and reuse them across your whole site.',
  },
  {
    title: 'Simple for Your Whole Team',
    body: 'No training required. If someone on your team can send an email, they can update your website.',
  },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: ease },
  }),
}

export function HomeCMSFeatures() {
  const sectionRef = useRef<HTMLElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--color-midnight)',
        borderBottom: '1px solid var(--color-rule)',
        padding: '88px 52px',
        overflow: 'hidden',
      }}
    >
      <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: ease }}
        >
          <p className="sec-label" style={{ textAlign: 'center', marginBottom: 16 }}>
            Under the Hood
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(24px, 3vw, 38px)',
              fontWeight: 400,
              lineHeight: 1.15,
              textAlign: 'center',
              color: 'var(--color-linen)',
              marginBottom: 16,
            }}
          >
            Built to last, not just to launch.
          </h2>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.8,
              color: 'rgba(240,224,199,0.5)',
              textAlign: 'center',
              maxWidth: 560,
              margin: '0 auto 64px',
            }}
          >
            Every site we build runs on a CMS that can grow with your business. Here is what comes
            standard.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 1,
            border: '1px solid rgba(240,224,199,0.08)',
            marginBottom: 72,
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              style={{
                padding: '36px 32px',
                borderRight: '1px solid rgba(240,224,199,0.08)',
                borderBottom: '1px solid rgba(240,224,199,0.08)',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 2,
                  background: 'var(--color-ember)',
                  marginBottom: 18,
                }}
              />
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 17,
                  fontWeight: 400,
                  color: 'var(--color-linen)',
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: 'rgba(240,224,199,0.5)',
                }}
              >
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.img
          src="/3.png"
          alt="ChanceCMS feature overview"
          style={{
            width: '100%',
            display: 'block',
            borderRadius: 8,
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
            y: imgY,
          }}
        />
      </div>
    </section>
  )
}
