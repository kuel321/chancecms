import type { Metadata } from 'next'
import Link from 'next/link'
import { portalURL } from '@/utilities/stripe'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Billing | Chasing a Chance',
  robots: { index: false, follow: false },
}

export default function BillingPage() {
  const portal = portalURL()
  return (
    <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 24px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(32px, 6vw, 48px)' }}>
        Your billing, in one place.
      </h1>
      <p style={{ margin: '24px 0' }}>
        View invoices, update your payment method, and manage your subscription. Sign in securely
        with the email address you used at checkout.
      </p>
      {portal ? (
        <a className="btn-ember" href={portal}>
          Manage billing
        </a>
      ) : (
        <p>
          Online billing management is not available yet. Please contact us for help with your
          account.
        </p>
      )}
      <h2 style={{ marginTop: 48 }}>Pay an invoice or deposit</h2>
      <p style={{ margin: '16px 0' }}>
        Use the private payment link provided with your invoice. You can review the amount and pay
        securely through Stripe.
      </p>
      <p>
        Need a service? <Link href="/services">Browse our services and plans.</Link>
      </p>
    </section>
  )
}
