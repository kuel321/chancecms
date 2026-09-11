import type { Metadata } from 'next'
import Link from 'next/link'
import { getStripe } from '@/utilities/stripe'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Checkout status | Chasing a Chance',
  robots: { index: false, follow: false },
}

export default async function CheckoutSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  let paid = false
  let found = false
  if (session_id && /^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(session_id)) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id)
      found = session.metadata?.source === 'chancecms'
      paid =
        found &&
        (session.payment_status === 'paid' || session.payment_status === 'no_payment_required')
    } catch {
      /* Do not expose customer data or Stripe errors on a public page. */
    }
  }
  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 48 }}>
        {paid
          ? 'Thank you for your order.'
          : found
            ? 'Your payment is processing.'
            : 'Check your payment status.'}
      </h1>
      <p style={{ margin: '24px 0' }}>
        {paid
          ? 'Your payment is confirmed. We look forward to working with you.'
          : found
            ? 'Some payment methods take longer to confirm. You can check your invoices through Billing.'
            : 'We could not confirm a checkout from this link. Check Billing or contact us before trying another payment.'}
      </p>
      <Link href="/billing" className="btn-ember">
        Go to billing
      </Link>
    </section>
  )
}
