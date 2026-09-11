import Link from 'next/link'
import { portalURL } from '@/utilities/stripe'

export default function BillingSetup() {
  const checks = [
    ['Stripe secret key', Boolean(process.env.STRIPE_SECRET_KEY)],
    ['Webhook signing secret', Boolean(process.env.STRIPE_WEBHOOK_SECRET)],
    ['Customer portal login', Boolean(portalURL())],
  ] as const
  return (
    <section
      style={{
        margin: '24px 0',
        padding: 24,
        border: '1px solid var(--theme-elevation-200)',
        borderRadius: 6,
      }}
    >
      <h2>Billing</h2>
      <p>
        Create services and plans using Stripe price IDs, or prepare a client invoice or deposit.
      </p>
      <ul>
        {checks.map(([label, ready]) => (
          <li key={label}>
            {label}: {ready ? 'Configured' : 'Not configured'}
          </li>
        ))}
      </ul>
      <p>
        {process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')
          ? 'Live mode'
          : 'Test mode / not configured'}{' '}
        · Settings presence does not verify the Stripe connection.
      </p>
      <p>
        <Link href="/admin/collections/billing-offers">Services &amp; plans</Link> ·{' '}
        <Link href="/admin/collections/billing-invoices">Invoices &amp; deposits</Link> ·{' '}
        <Link href="/admin/collections/billing-payments">Payments</Link> ·{' '}
        <Link href="/admin/collections/billing-subscriptions">Subscriptions</Link>
      </p>
      <p>
        <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer">
          Open Stripe Dashboard
        </a>{' '}
        for products, prices, refunds, disputes, and tax settings.
      </p>
    </section>
  )
}
