# Stripe billing setup

## Included

- `/services`: active fixed-price services and recurring plans, using live prices from Stripe.
- `/billing`: Stripe's email-authenticated customer portal and invoice payment guidance.
- `/billing/success`: payment status retrieved from Stripe, never inferred from the URL alone.
- Admin → Billing: services/plans, USD invoice/deposit drafts, Checkout payments, subscriptions, and a setup panel.
- `POST /api/stripe/checkout`: server-priced Checkout sessions with retry idempotency.
- `POST /api/stripe/webhook`: signed raw-body events, current Stripe state, retryable database writes.
- Admin invoice action generates and finalizes a hosted Stripe invoice and returns a private branded `/pay/<reference>` link. It does **not** email the client or charge a saved card.

Gallery access is independent of billing. No subscription entitlements or automatic service delivery are assumed.

## Account configuration

1. Use a Stripe sandbox/test account first. Set server environment variables (never commit actual values):

   ```dotenv
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/test_...
   STRIPE_AUTOMATIC_TAX=false
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

   Hosted Checkout does not need a browser publishable key. Use the same account and mode for keys, prices, portal, and webhooks. The SDK currently uses Stripe API `2026-08-26.dahlia`; configure snapshot webhook events with that version.

2. In Stripe, create products and **fixed** prices: one-time for services, recurring for subscriptions. Metered, tiered, quantity-transformed, free, and custom-amount pricing are not supported by this catalog. Add the `price_...` ID to Admin → Billing → Services & Plans. Save as available to validate it against Stripe. Test and live price IDs are different.
3. Activate the [no-code customer portal](https://docs.stripe.com/customer-management/activate-no-code-customer-portal), enable payment-method updates, invoices, and subscription cancellation, and paste its login URL into the environment. Enable plan switching only for the products/prices you want customers to switch between. The portal verifies ownership by email. Stripe documents how it selects a customer when several Customer records share an email; Checkout does not attach an unauthenticated visitor to an existing Customer just because they typed that email.
4. Configure Stripe business details, branding, receipts, support details, and subscription cancellation terms. If you enable Stripe Tax, configure the applicable Stripe settings first, then set `STRIPE_AUTOMATIC_TAX=true`. That flag applies to catalog Checkout. Custom USD invoices use the exact amount entered; manage any required invoice tax setup in Stripe before finalization instead of using this simple invoice action.
5. Register `https://chasingachance.com/api/stripe/webhook` with these snapshot events:

   ```text
   checkout.session.completed
   checkout.session.async_payment_succeeded
   checkout.session.async_payment_failed
   checkout.session.expired
   customer.subscription.created
   customer.subscription.updated
   customer.subscription.deleted
   invoice.paid
   invoice.payment_failed
   invoice.finalized
   invoice.voided
   invoice.marked_uncollectible
   charge.refunded
   ```

   Store its signing secret server-side. Unsupported events are acknowledged without changing records. Database failures return 500 so Stripe retries; unique Stripe IDs prevent duplicate records. Refunds of one-time Checkout payments update their payment records. Recurring invoice history, invoice refunds, disputes, and adjustments remain in Stripe and the portal; the subscription collection reflects subscription state, not an accounting ledger.

## Share a service with a client

Each available service has a branded page at `/services/<slug>`, for example `/services/domain-purchase`. In Admin → Billing → Services & Plans, save the service, then use **Copy client link**. Slugs are generated from the title on save and stay stable if you rename a service. Keep the slug unchanged after sharing. Existing records without a slug still work at `/services/<id>` until saved. Unavailable services return 404.

The client sees the service description and Stripe price on your site, then opens Stripe Checkout using the payment button. Canceling checkout returns to that service page. Local preview links use localhost; production links use the deployed site's domain. The Domain Purchase sandbox offer is available locally at `http://localhost:3002/services/domain-purchase` for $20. This does not register a domain or charge a real card.

## Creating an invoice or deposit

Create a draft with customer name/email, description, USD amount in whole cents (`25000` = `$250.00`), due days, and invoice/deposit kind. Save, then click **Generate / retrieve client invoice link** and copy the link. Creation retries reuse the same invoice, and billing details freeze once creation starts. To change an issued invoice, manage/void it in Stripe and create a new draft. Existing Stripe Customers are reused for admin-created invoices by exact email.

The client link opens a branded Chasing a Chance invoice page with the recipient, description, amount, due date, and payment status. Payment opens the Stripe hosted invoice in a new tab. The branded page checks Stripe again every 15 seconds while visible and when focused; paid or closed invoices have no payment button. The existing service links remain available separately.

Invoice links are signed using `PAYLOAD_SECRET` and the invoice's existing operation key. They require no client login, so share them only with the intended recipient. Rotating `PAYLOAD_SECRET` invalidates previously shared branded links; retrieve new links afterward. These pages omit analytics, prevent referrer sharing, and request search-engine exclusion. No additional database migration is needed for the branded page.

The action uses `auto_advance=false`: it neither emails nor automatically collects payment. Do not enable sending or automatic collection without deciding your customer communication policy. Payment is still possible through the hosted URL.

## Local verification

Sandbox credentials supplied during setup are stored only in the ignored `.env`. The publishable key is retained as `STRIPE_PUBLISHABLE_KEY`, but hosted Checkout does not use it. Two clearly named Stripe sandbox prices and a sandbox customer portal have been provisioned. Their IDs are in `.tmp/stripe-sandbox.json` (also ignored).

For the isolated preview, use database `file:./.tmp/stripe-sandbox.db`, `NEXT_PUBLIC_SERVER_URL=http://localhost:3002`, `NEXT_DIST_DIR=.tmp/stripe-next`, and `PAYLOAD_SCHEMA_PUSH=false`, then run `npm run dev -- --port 3002`. The database has the complete migration chain applied. Disabling schema push avoids mixing automatic development schema changes with explicit migrations.

Run `node scripts/stripe-listen.mjs` in another terminal to forward real sandbox events to port 3002. This test-only helper stores the listener signing secret in `.env` without printing it; start or restart the preview after the listener is ready. `STRIPE_SANDBOX_ORIGIN` can select another localhost port. The CLI listener must remain running for local payment records to update.

With `DATABASE_URL=file:./.tmp/stripe-sandbox.db` and `NODE_ENV=production` set for the verification command, run `node --import tsx scripts/verify-stripe-sandbox.ts`. The test script refuses to use the regular database or a live Stripe key. It seeds test offers and an isolated admin, creates Checkout sessions, pays a sandbox invoice, creates and cancels a subscription, and waits for real webhook updates. The isolated admin login is saved in `.tmp/stripe-sandbox-admin.json`; no credentials are committed. Test invoice records are retained for inspection. `node scripts/stripe-sandbox.mjs` can recreate/reuse the sandbox prices and portal.

Verified during setup: both Checkout session modes and retry reuse, actual Stripe price rendering, admin-only invoice generation, invoice immutability, invoice payment webhook, active subscription webhook, and cancellation webhook. Hosted Checkout completion and the portal's email sign-in still require a manual browser test; automated verification does not send sign-in emails.

```sh
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the listener's signing secret into `.env`, then restart the dev server. Activate one test one-time offer and one recurring offer. Complete Checkout with Stripe's test card `4242 4242 4242 4242`, any future expiry, and any CVC. Verify payment and subscription records; cancel a checkout; try a declined test card; test a delayed payment; resend a webhook; refund the one-time payment in Stripe; cancel a subscription in the portal; generate and pay a test invoice. The site must not treat merely visiting the success page as payment.

Automated mocked tests run with `npm exec vitest run tests/int/stripe.int.spec.ts`. They do not contact Stripe or create real payments. Full checkout, email login, and settlement need a configured Stripe sandbox and cannot be verified using fake credentials.

## Database and deployment

`src/migrations` includes the original server schema and gallery migration copied from the deployed checkout, followed by the billing migration. Those first two are already recorded on production and must not be replayed manually. Back up SQLite using its `.backup` command before applying migrations.

Run on the server after fetching the code and installing dependencies:

```sh
npm run payload -- migrate:status
npm run payload -- migrate
npm run generate:types
npm run generate:importmap
npm run build
pm2 restart chancecms --update-env
```

The existing server `deploy.sh` does not apply migrations: run the migration step before restarting the new build. Set `NEXT_PUBLIC_SERVER_URL=https://chasingachance.com` in production. Enable a real Stripe webhook before accepting checkout. Test mode must be verified before substituting live keys and prices. This change does not deploy itself or configure live-mode Stripe settings.

The server's migration files were previously untracked. Before the first pull of this change, preserve that server directory in a backup location so Git can check out the newly tracked migration history. Preserve server lockfile edits too. Do not copy a local CLI signing secret to production: register the deployed webhook URL in Stripe and use that endpoint's own secret.

References: [Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment), [webhook signatures](https://docs.stripe.com/webhooks), [hosted invoices](https://docs.stripe.com/api/invoices/finalize).
