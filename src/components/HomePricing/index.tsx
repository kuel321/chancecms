'use client'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import { ease } from '@/utilities/motion'
import type { Variants } from 'framer-motion'

type Tier = {
  name: string
  price: string
  care: string
  who: string
  outcome: string
  featured?: boolean
  details: {
    heading: string
    body: string
    includes: string[]
    notFor?: string
  }
}

const tiers: Tier[] = [
  {
    name: 'Monthly Option',
    price: '$300 / mo',
    care: '12 months, then care plan',
    who: 'Want to get online without writing a big check upfront.',
    outcome:
      'We build and launch your site, you pay monthly. Hosting included for the full year, then rolls into a care plan.',
    details: {
      heading: 'Same site, spread out over 12 months.',
      body: 'This is not a watered-down version of anything. You get a fully custom site built the same way as any other project. The only difference is how you pay for it. $300 a month for 12 months covers the design, the build, and hosting for that entire year. When the 12 months are up, your site is yours and you move onto a standard $150/mo care plan.',
      includes: [
        'Full custom design and development',
        'Hosting included for 12 months',
        'Content management system',
        'Mobile friendly',
        'Contact form and basic SEO',
        'Rolls into care plan after year one',
      ],
      notFor:
        'If you need a complex site with a blog, ecommerce, or advanced features, this plan works best for straightforward service business sites.',
    },
  },
  {
    name: 'Grow',
    price: '$4,000 – $5,000',
    care: '$200 / mo care plan',
    who: 'Businesses that publish content, capture leads, and want to build an audience over time.',
    outcome:
      'A full content platform — blog, newsletter, analytics, and lead capture — not just a brochure site.',
    featured: true,
    details: {
      heading: 'For businesses that need more than a static site.',
      body: 'Grow is for businesses that are actively marketing. You need somewhere to publish updates, a way to collect emails, and visibility into what is working. This tier includes a blog or news section you can update yourself, a newsletter signup that connects to your email platform, Google Analytics, and a content workflow your whole team can use without training.',
      includes: [
        'Everything in Launch',
        'Blog or news section',
        'Newsletter signup and email integration',
        'Google Analytics setup',
        'Advanced SEO configuration',
        'Lead capture forms',
        'Content workflow for your team',
        '$200 / mo care plan (hosting, updates, support)',
      ],
      notFor:
        'If you just need a clean site with your services, hours, and a contact form — Launch is the right fit and will save you money.',
    },
  },
  {
    name: 'Launch',
    price: '$2,000 – $2,500',
    care: '$150 / mo care plan',
    who: 'Service businesses that need to look professional and be easy to find online.',
    outcome:
      'A clean, fast, fully custom site that represents your business well and gets out of your way.',
    details: {
      heading: 'Get your business online the right way.',
      body: 'Launch is for businesses that need a solid web presence — not a template, not a page builder, but a real custom site built for you. Your services, your story, your contact info, done well. Clients can find you, see what you do, and reach out. That is the job. We do it fast and we do it right.',
      includes: [
        'Fully custom design (not a template)',
        'Up to 6 pages',
        'Mobile friendly',
        'Contact form',
        'Basic SEO setup',
        'Smooth animations (Framer Motion)',
        'Content management — update it yourself',
        '$150 / mo care plan (hosting, updates, support)',
      ],
      notFor:
        'If you need a blog, newsletter, or want to actively publish content to grow an audience, Grow is the better fit.',
    },
  },
]

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: ease },
  }),
}

function TierDrawer({ tier, onClose }: { tier: Tier; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,34,2,0.6)',
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
        }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-cream)',
          borderTop: '1px solid var(--color-rule)',
          padding: '52px 52px 64px',
          zIndex: 10001,
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 32,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ember)',
                  marginBottom: 8,
                }}
              >
                {tier.name}
              </p>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(22px, 3vw, 34px)',
                  fontWeight: 400,
                  color: 'var(--color-midnight)',
                  lineHeight: 1.2,
                }}
              >
                {tier.details.heading}
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 24,
                color: 'var(--color-muted)',
                lineHeight: 1,
                padding: '4px 8px',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'var(--color-midnight)',
              marginBottom: 40,
            }}
          >
            {tier.details.body}
          </p>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}
          >
            {tier.details.includes.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--color-pine)',
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    color: 'var(--color-midnight)',
                    lineHeight: 1.6,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {tier.details.notFor && (
            <div
              style={{ borderTop: '1px solid var(--color-rule)', paddingTop: 24, marginBottom: 36 }}
            >
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: 'var(--color-muted)',
                  lineHeight: 1.7,
                }}
              >
                <strong style={{ color: 'var(--color-midnight)' }}>Not the right fit if: </strong>
                {tier.details.notFor}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#contact" onClick={onClose} className="btn-dark">
              Get Started
            </a>
            <button onClick={onClose} className="btn-outline" style={{ cursor: 'pointer' }}>
              Back to Pricing
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export function HomePricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [activeDrawer, setActiveDrawer] = useState<Tier | null>(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Launch',
    message: '',
  })
  const [contactMethods, setContactMethods] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, contactMethods }),
    })
    setSubmitted(true)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    background: 'var(--color-cream)',
    border: '1.5px solid var(--color-rule)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    color: 'var(--color-midnight)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'var(--color-muted)',
    marginBottom: 6,
    display: 'block',
  }

  return (
    <>
      <section
        id="pricing"
        className="pricing-section"
        style={{
          background: 'var(--color-cream)',
          borderBottom: '1px solid var(--color-rule)',
          padding: '88px 52px',
          overflow: 'hidden',
        }}
      >
        <div ref={ref} style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: ease }}
            style={{ marginBottom: 64 }}
          >
            <p className="sec-label">Pricing</p>
            <h2 className="sec-heading">Simple, honest pricing.</h2>
            <p
              style={{
                fontSize: 15,
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'var(--color-muted)',
                maxWidth: 500,
              }}
            >
              No surprise fees. No locked-in contracts. Every project includes a monthly care plan —
              hosting, updates, and a real person to call.
            </p>
          </motion.div>

          {/* Tier cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
              marginBottom: 40,
            }}
          >
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                style={{
                  background: tier.featured ? 'var(--color-pine)' : 'var(--color-parchment)',
                  border: tier.featured
                    ? '1px solid var(--color-pine)'
                    : '1px solid var(--color-rule)',
                  padding: '40px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {tier.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--color-ember)',
                      background: 'rgba(241,90,36,0.12)',
                      padding: '4px 10px',
                    }}
                  ></div>
                )}

                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: tier.featured ? 'rgba(240,224,199,0.5)' : 'var(--color-muted)',
                    marginBottom: 12,
                  }}
                >
                  {tier.name}
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(22px, 2.5vw, 30px)',
                    fontWeight: 400,
                    color: tier.featured ? 'var(--color-linen)' : 'var(--color-midnight)',
                    marginBottom: 6,
                    lineHeight: 1.1,
                  }}
                >
                  {tier.price}
                </p>

                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    color: tier.featured ? 'var(--color-ember)' : 'var(--color-pine)',
                    marginBottom: 20,
                  }}
                >
                  {tier.care}
                </p>

                <p
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: tier.featured ? 'rgba(240,224,199,0.4)' : 'var(--color-muted)',
                    marginBottom: 8,
                  }}
                >
                  Best for
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: 1.7,
                    color: tier.featured ? 'rgba(240,224,199,0.6)' : 'var(--color-muted)',
                    marginBottom: 20,
                  }}
                >
                  {tier.who}
                </p>

                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 300,
                    lineHeight: 1.8,
                    color: tier.featured ? 'rgba(240,224,199,0.75)' : 'var(--color-midnight)',
                    flex: 1,
                  }}
                >
                  {tier.outcome}
                </p>

                <a
                  href="#contact"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    marginTop: 32,
                    padding: '12px 0',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    border: `1.5px solid ${tier.featured ? 'var(--color-ember)' : 'var(--color-midnight)'}`,
                    color: tier.featured ? 'var(--color-ember)' : 'var(--color-midnight)',
                  }}
                >
                  Get Started
                </a>
                <button
                  onClick={() => setActiveDrawer(tier)}
                  style={{
                    marginTop: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: tier.featured ? 'rgba(240,224,199,0.4)' : 'var(--color-muted)',
                    padding: 0,
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  More Details ↓
                </button>
              </motion.div>
            ))}
          </div>

          {/* Monthly build callout */}
          {/* Custom / Build callout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.2, ease: ease }}
            style={{
              background: 'var(--color-midnight)',
              border: '1px solid rgba(240,224,199,0.08)',
              padding: '32px 40px',
              marginBottom: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--color-ember)',
                  marginBottom: 8,
                }}
              >
                Need Something Custom?
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(18px, 2vw, 24px)',
                  fontWeight: 400,
                  color: 'var(--color-linen)',
                  marginBottom: 8,
                  lineHeight: 1.2,
                }}
              >
                Ecommerce, software, or anything built from scratch.
              </h3>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 300,
                  lineHeight: 1.75,
                  color: 'rgba(240,224,199,0.5)',
                  maxWidth: 520,
                }}
              >
                If the tiers above don't fit what you need, let's talk. We scope custom projects
                together — storefronts, internal tools, booking systems, web applications. If you
                can describe the problem, we can build the solution.
              </p>
            </div>
            <a href="#contact" className="btn-ember" style={{ flexShrink: 0 }}>
              Let&apos;s Talk
            </a>
          </motion.div>

          {/* Contact form */}
          <motion.div
            id="contact"
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.3, ease: ease }}
            className="pricing-form"
            style={{
              background: 'var(--color-parchment)',
              border: '1px solid var(--color-rule)',
              padding: '56px 52px',
            }}
          >
            <p className="sec-label" style={{ marginBottom: 12 }}>
              Get in Touch
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(22px, 2.5vw, 32px)',
                fontWeight: 400,
                color: 'var(--color-midnight)',
                marginBottom: 36,
                lineHeight: 1.2,
              }}
            >
              Tell us about your project.
            </h3>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px solid var(--color-rule)',
                  background: 'var(--color-cream)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 22,
                    color: 'var(--color-pine)',
                    marginBottom: 8,
                  }}
                >
                  Got it, thanks!
                </p>
                <p style={{ fontSize: 14, fontWeight: 300, color: 'var(--color-muted)' }}>
                  We will be in touch within one business day.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <div
                  className="pricing-form-grid-2"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
                >
                  <div>
                    <label style={labelStyle}>Your Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Smith"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@yourbusiness.com"
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div
                  className="pricing-form-grid-2"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}
                >
                  <div>
                    <label style={labelStyle}>Phone (optional)</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(304) 555-0100"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>What are you looking for?</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option>Launch</option>
                      <option>Grow</option>
                      <option>Build / Custom</option>
                      <option>Monthly Build ($300/mo)</option>
                      <option>Ecommerce Store</option>
                      <option>Campaign / Political Site</option>
                      <option>Care Plan Only</option>
                      <option>Not sure yet</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Preferred contact method</label>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 4 }}>
                    {['Email', 'Phone call', 'Text message'].map((method) => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 300, color: 'var(--color-midnight)' }}>
                        <input
                          type="checkbox"
                          checked={contactMethods.includes(method)}
                          onChange={() =>
                            setContactMethods(prev =>
                              prev.includes(method)
                                ? prev.filter(m => m !== method)
                                : [...prev, method]
                            )
                          }
                          style={{ accentColor: 'var(--color-pine)', width: 15, height: 15, cursor: 'pointer' }}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tell us more</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="What does your business do? What's working or not working right now? Any deadline we should know about?"
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div>
                  <button type="submit" className="btn-dark" style={{ cursor: 'pointer' }}>
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {activeDrawer && <TierDrawer tier={activeDrawer} onClose={() => setActiveDrawer(null)} />}
      </AnimatePresence>
    </>
  )
}
