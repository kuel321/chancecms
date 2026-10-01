import type { Metadata } from 'next'
import { readFile } from 'fs/promises'
import path from 'path'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Quote, User } from '@/payload-types'
import { signaturesDir } from '@/collections/Signatures'
import { calculateQuote, formatMoney } from '@/utilities/quotePricing'
import { PrintButton } from './PrintButton'

export const dynamic = 'force-dynamic'

type Args = { params: Promise<{ id: string }> }

async function getQuote(id: string): Promise<{ quote: Quote; user: User }> {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) redirect(`/admin/login?redirect=${encodeURIComponent(`/quotes/${id}`)}`)

  const quote = await payload
    .findByID({ collection: 'quotes', id, depth: 0, user, overrideAccess: false })
    .catch(() => null)
  if (!quote) notFound()
  return { quote, user: user as User }
}

// Signatures live outside public/, so the image is inlined as a data URI instead of
// linking to a URL that would need its own auth.
async function getSignatureSrc(quote: Quote, user: User): Promise<string | null> {
  if (quote.kind !== 'inKind' || !quote.signature) return null
  const payload = await getPayload({ config: configPromise })
  const signature = await payload
    .findByID({
      collection: 'signatures',
      id: typeof quote.signature === 'object' ? quote.signature.id : quote.signature,
      depth: 0,
      user,
      overrideAccess: false,
    })
    .catch(() => null)
  if (!signature?.filename || !signature.mimeType) return null
  const file = await readFile(path.join(signaturesDir, path.basename(signature.filename))).catch(
    () => null,
  )
  return file ? `data:${signature.mimeType};base64,${file.toString('base64')}` : null
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  })
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { quote } = await getQuote((await params).id)
  const recipient = quote.clientCompany || quote.clientName
  // The browser uses the page title as the default PDF filename.
  return {
    title:
      quote.kind === 'inKind'
        ? `${quote.quoteNumber} ${recipient} - In-Kind Contribution from ${quote.donorName}`
        : `${quote.quoteNumber} ${recipient} - Chasing a Chance Quote`,
  }
}

export default async function QuotePage({ params }: Args) {
  const { quote, user } = await getQuote((await params).id)
  const signatureSrc = await getSignatureSrc(quote, user)
  const { lines, total, monthly, hasVolunteer, estimatedVolunteerValue } = calculateQuote(quote)
  // In-kind donations are personal, so they carry none of the studio's branding.
  const inKind = quote.kind === 'inKind'

  return (
    <div className={inKind ? 'quote-theme-personal' : undefined}>
      <div className="quote-toolbar">
        <a href={`/admin/collections/quotes/${quote.id}`} className="btn-outline">
          Edit quote
        </a>
        <PrintButton />
      </div>

      <article className="quote-sheet">
        <header className="quote-header">
          {inKind ? (
            <div className="quote-brand">
              <div>
                <div className="quote-brand-name">{quote.donorName}</div>
                <div className="quote-brand-tagline">In-kind contribution record</div>
              </div>
            </div>
          ) : (
            <div className="quote-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/chance-logo-no-letters-png.png" alt="" width={48} height={48} />
              <div>
                <div className="quote-brand-name">Chasing a Chance</div>
                <div className="quote-brand-tagline">Big attention. Small studio.</div>
              </div>
            </div>
          )}
          <div className="quote-id">
            <div className="quote-eyebrow">{inKind ? 'In-kind contribution' : 'Quote'}</div>
            <div className="quote-number">{quote.quoteNumber}</div>
          </div>
        </header>

        <section className="quote-meta">
          {inKind && (
            <div>
              <div className="quote-eyebrow">Contributor</div>
              <p>
                <strong>{quote.donorName}</strong>
                {quote.donorAddress && (
                  <>
                    <br />
                    <span className="quote-address">{quote.donorAddress}</span>
                  </>
                )}
                {quote.donorEmail && (
                  <>
                    <br />
                    {quote.donorEmail}
                  </>
                )}
                {quote.donorOccupation && (
                  <>
                    <br />
                    Occupation: {quote.donorOccupation}
                  </>
                )}
                {quote.donorEmployer && (
                  <>
                    <br />
                    Employer: {quote.donorEmployer}
                  </>
                )}
              </p>
            </div>
          )}
          <div>
            <div className="quote-eyebrow">{inKind ? 'Contribution to' : 'Prepared for'}</div>
            <p>
              <strong>{quote.clientName}</strong>
              {quote.clientCompany && (
                <>
                  <br />
                  {quote.clientCompany}
                </>
              )}
              {quote.clientEmail && (
                <>
                  <br />
                  {quote.clientEmail}
                </>
              )}
            </p>
          </div>
          <div className="quote-dates">
            <div>
              <div className="quote-eyebrow">{inKind ? 'Date' : 'Issued'}</div>
              <p>{formatDate(quote.issueDate)}</p>
            </div>
            {inKind && quote.election && (
              <div>
                <div className="quote-eyebrow">Election</div>
                <p>{`${new Date(quote.issueDate).getFullYear()} ${quote.election === 'primary' ? 'Primary' : 'General'}`}</p>
              </div>
            )}
            {!inKind && quote.validUntil && (
              <div>
                <div className="quote-eyebrow">Valid until</div>
                <p>{formatDate(quote.validUntil)}</p>
              </div>
            )}
          </div>
        </section>

        <h1 className="quote-title">{quote.title}</h1>

        <table className="quote-lines">
          <thead>
            <tr>
              <th>{inKind ? 'Description' : 'Item'}</th>
              <th>{inKind ? 'Value' : 'Amount'}</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}>
                <td>
                  <div className="quote-line-label">{line.label}</div>
                  {line.detail && <div className="quote-line-detail">{line.detail}</div>}
                </td>
                <td className={line.included || line.volunteer ? 'quote-included' : undefined}>
                  {line.volunteer ? (
                    <>
                      Volunteer, no charge
                      {line.estimate !== undefined && (
                        <div className="quote-line-estimate">
                          Est. value {formatMoney(line.estimate)}
                        </div>
                      )}
                    </>
                  ) : line.included
                      ? 'Included'
                      : formatMoney(line.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="quote-totals">
          {hasVolunteer && (
            <div className="quote-total-row quote-total-note">
              <span>Volunteer services</span>
              <strong>No charge</strong>
            </div>
          )}
          <div className="quote-total-row">
            <span>{inKind ? 'Reportable in-kind value' : 'Project total'}</span>
            <strong>{formatMoney(total)}</strong>
          </div>
          {estimatedVolunteerValue !== null && estimatedVolunteerValue > 0 && (
            <div className="quote-total-row quote-total-estimate">
              <span>Estimated value of volunteer services (not a contribution)</span>
              <span>{formatMoney(estimatedVolunteerValue)}</span>
            </div>
          )}
          {monthly !== null && (
            <div className="quote-total-row quote-total-monthly">
              <span>Hosting &amp; Support</span>
              <strong>{formatMoney(monthly)}/month</strong>
            </div>
          )}
        </section>

        {quote.notes && (
          <section className="quote-text">
            <div className="quote-eyebrow">Notes</div>
            <p>{quote.notes}</p>
          </section>
        )}
        {inKind && quote.donationStatement && (
          <section className="quote-text">
            <div className="quote-eyebrow">Contribution statement</div>
            <p>{quote.donationStatement}</p>
          </section>
        )}
        {inKind && (
          <section className="quote-signatures">
            <div>
              <div className="quote-signature-line">
                {signatureSrc && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={signatureSrc} alt={`Signature of ${quote.donorName}`} />
                    <span>{formatDate(new Date().toISOString())}</span>
                  </>
                )}
              </div>
              <div className="quote-eyebrow">Contributor signature &amp; date</div>
            </div>
            {quote.showReceivedBy !== false && (
              <div>
                <div className="quote-signature-line" />
                <div className="quote-eyebrow">Received for the campaign by &amp; date</div>
              </div>
            )}
          </section>
        )}
        {!inKind && quote.terms && (
          <section className="quote-text">
            <div className="quote-eyebrow">Terms</div>
            <p>{quote.terms}</p>
          </section>
        )}

        {!inKind && (
          <footer className="quote-footer">chasingachance.com · Hurricane, West Virginia</footer>
        )}
      </article>
    </div>
  )
}
