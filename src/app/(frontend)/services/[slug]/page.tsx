import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CheckoutButton } from '@/components/CheckoutButton'
import { formatPrice, getStripe, validatePrice } from '@/utilities/stripe'

export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ canceled?: string }> }

const getOffer = cache(async (slug: string) => {
  if (/^\d+$/.test(slug) && !Number.isSafeInteger(Number(slug))) return null
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'billing-offers',
    overrideAccess: false,
    depth: 0,
    limit: 1,
    where: {
      and: [
        { active: { equals: true } },
        /^\d+$/.test(slug) ? { id: { equals: Number(slug) } } : { slug: { equals: slug } },
      ],
    },
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const offer = await getOffer((await params).slug)
  return {
    title: offer ? `${offer.title} | Chasing a Chance` : 'Service not found',
    description: offer?.description || undefined,
  }
}

export default async function ServicePage({ params, searchParams }: Props) {
  const offer = await getOffer((await params).slug)
  if (!offer) notFound()
  const { canceled } = await searchParams
  let price = null
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
    try {
      const current = await getStripe().prices.retrieve(offer.stripePriceID, {
        expand: ['product'],
      })
      validatePrice(current)
      price = current
    } catch {
      /* Keep the description readable when payments are unavailable. */
    }
  }
  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
      <p className="eyebrow">Chasing a Chance</p>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(36px, 6vw, 60px)',
          lineHeight: 1.15,
        }}
      >
        {offer.title}
      </h1>
      {offer.description && (
        <p style={{ margin: '24px 0', whiteSpace: 'pre-line', lineHeight: 1.7 }}>
          {offer.description}
        </p>
      )}
      {canceled && (
        <p role="status" style={{ margin: '24px 0' }}>
          Checkout was canceled. You can try again whenever you&apos;re ready.
        </p>
      )}
      <div
        style={{
          marginTop: 32,
          padding: 28,
          border: '1px solid var(--color-rule)',
          borderRadius: 8,
        }}
      >
        {price ? (
          <>
            <p style={{ fontSize: 32, marginBottom: 16 }}>
              {formatPrice(price.unit_amount!, price.currency)}
              {price.recurring && (
                <span style={{ fontSize: 18 }}>
                  {' '}
                  / {price.recurring.interval_count > 1 ? `${price.recurring.interval_count} ` : ''}
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
            <p style={{ marginBottom: 24 }}>Review your total and pay securely through Stripe.</p>
            <CheckoutButton offerID={offer.id} subscription={price.type === 'recurring'} />
          </>
        ) : (
          <p>Online payment is temporarily unavailable. Please contact us for help.</p>
        )}
      </div>
    </section>
  )
}
