import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CheckoutButton } from '@/components/CheckoutButton'
import { formatPrice, getStripe, validatePrice } from '@/utilities/stripe'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Services & Plans | Chasing a Chance' }

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams
  const payload = await getPayload({ config })
  const { docs: offers } = await payload.find({
    collection: 'billing-offers',
    overrideAccess: false,
    depth: 0,
    sort: 'sortOrder',
    limit: 100,
  })
  const ready = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET)
  const cards = await Promise.all(
    offers.map(async (offer) => {
      if (!ready) return { offer, price: null }
      try {
        const price = await getStripe().prices.retrieve(offer.stripePriceID, {
          expand: ['product'],
        })
        validatePrice(price)
        return { offer, price }
      } catch {
        return { offer, price: null }
      }
    }),
  )
  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px' }}>
      <p className="eyebrow">Work with us</p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 6vw, 64px)' }}>
        Services &amp; plans
      </h1>
      <p style={{ margin: '20px 0 32px' }}>
        Choose a service or an ongoing plan. Have a custom project in mind?{' '}
        <Link href="/about">Get in touch.</Link>
      </p>
      {canceled && (
        <p role="status" style={{ marginBottom: 24 }}>
          Checkout was canceled. You can choose a service and try again whenever you&apos;re ready.
        </p>
      )}
      {cards.length === 0 && (
        <p>We&apos;re putting our services together. Contact us for a project quote.</p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 24,
        }}
      >
        {cards.map(({ offer, price }) => (
          <article
            key={offer.id}
            style={{ border: '1px solid var(--color-muted)', padding: 28, borderRadius: 8 }}
          >
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28 }}>
              <Link href={`/services/${offer.slug || offer.id}`}>{offer.title}</Link>
            </h2>
            <p style={{ whiteSpace: 'pre-line', margin: '16px 0' }}>{offer.description}</p>
            {price ? (
              <>
                <p style={{ fontSize: 24, marginBottom: 8 }}>
                  {formatPrice(price.unit_amount!, price.currency)}
                  {price.recurring && (
                    <span style={{ fontSize: 16 }}>
                      {' '}
                      /{' '}
                      {price.recurring.interval_count > 1
                        ? `${price.recurring.interval_count} `
                        : ''}
                      {price.recurring.interval}
                      {price.recurring.interval_count > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
                {price.recurring && (
                  <p style={{ marginBottom: 16 }}>
                    Renews automatically. Manage or cancel through Billing.
                  </p>
                )}
                <p style={{ marginBottom: 20 }}>Final total shown at checkout.</p>
                <CheckoutButton offerID={offer.id} subscription={price.type === 'recurring'} />
              </>
            ) : (
              <p>Online checkout is temporarily unavailable. Please contact us.</p>
            )}
          </article>
        ))}
      </div>
      <p style={{ marginTop: 36 }}>
        Already a client? <Link href="/billing">Manage billing and subscriptions.</Link>
      </p>
    </section>
  )
}
