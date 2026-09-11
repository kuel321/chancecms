import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatPrice, getStripe } from '@/utilities/stripe'
import { readPublicInvoice } from '@/utilities/invoiceLink'
import { InvoiceRefresh } from '@/components/InvoiceRefresh'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export default async function InvoicePage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  if (!/^[1-9]\d*\.[a-f0-9]{64}$/.test(reference)) notFound()
  let invoice
  try {
    invoice = await readPublicInvoice(await getPayload({ config }), getStripe(), reference)
  } catch {
    return (
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <h1>We couldn&apos;t check this invoice right now.</h1>
        <p style={{ marginTop: 20 }}>
          Please try again in a moment. If you have already paid, wait for confirmation before
          attempting another payment.
        </p>
        <InvoiceRefresh />
      </section>
    )
  }
  if (!invoice) notFound()
  const paid = invoice.status === 'paid'
  const open = invoice.status === 'open'
  return (
    <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 12 }}>
        {invoice.kind === 'deposit' ? 'Deposit request' : 'Invoice'}
        {invoice.number ? ` · ${invoice.number}` : ''}
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(32px, 6vw, 52px)',
          lineHeight: 1.15,
          margin: '20px 0',
        }}
      >
        {invoice.title}
      </h1>
      <p>Prepared for {invoice.customerName}</p>
      <div
        style={{
          marginTop: 32,
          padding: 28,
          border: '1px solid var(--color-rule)',
          borderRadius: 8,
          background: 'var(--color-cream)',
        }}
      >
        <p style={{ fontSize: 14 }}>{paid ? 'Invoice total' : 'Amount due'}</p>
        <p style={{ fontSize: 40, margin: '8px 0 20px' }}>
          {formatPrice(paid ? invoice.total : invoice.remaining, invoice.currency)}
        </p>
        {paid ? (
          <>
            <h2>Paid — thank you!</h2>
            <p style={{ marginTop: 12 }}>
              Your payment is confirmed. No further payment is needed.
            </p>
            {invoice.paidAt && (
              <p style={{ marginTop: 12 }}>
                Paid on{' '}
                {new Date(invoice.paidAt * 1000).toLocaleDateString('en-US', { timeZone: 'UTC' })}.
              </p>
            )}
          </>
        ) : open ? (
          <>
            {invoice.dueDate && (
              <p style={{ marginBottom: 20 }}>
                Due{' '}
                {new Date(invoice.dueDate * 1000).toLocaleDateString('en-US', { timeZone: 'UTC' })}
              </p>
            )}
            {invoice.paymentURL ? (
              <a
                className="btn-ember"
                href={invoice.paymentURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pay {formatPrice(invoice.remaining, invoice.currency)}
              </a>
            ) : (
              <p>We&apos;re waiting for payment confirmation.</p>
            )}
            <p style={{ marginTop: 20 }}>
              Secure payment opens in a new tab. This page updates when your payment is confirmed.
            </p>
            <InvoiceRefresh />
          </>
        ) : (
          <>
            <h2>{invoice.status === 'void' ? 'Invoice canceled' : 'Invoice closed'}</h2>
            <p style={{ marginTop: 12 }}>
              Online payment is unavailable for this invoice. Contact us if you need help.
            </p>
          </>
        )}
      </div>
      <p style={{ marginTop: 24, color: 'var(--color-muted)', fontSize: 13 }}>
        This private link is intended for the invoice recipient. Keep it for your records.
      </p>
    </section>
  )
}
