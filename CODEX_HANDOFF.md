# Stay By Jordan — Codex Handoff

## Current State

- Project: `/home/iyin/work/sbj` in the Ubuntu WSL distribution
- Branch: `main`
- The approved frontend is committed and deployed successfully to Cloudflare Workers.
- Production and staging D1 databases and private R2 buckets have been created.
- Wrangler now contains production and staging bindings plus persistent runtime logging.
- D1/R2 resources are empty infrastructure only; schema, migrations, seed data, and backend code have not been implemented.
- The next commit is expected to contain the environment configuration, generated Cloudflare types, and updated specification/handoff.
- `SPEC.md` is the product and architecture source of truth.

## Product Summary

Stay By Jordan is a premium short-stay reservation webapp for two current residences:

- One two-bedroom apartment at `Glendale Pearl Estate, Wuye, Abuja, Nigeria`
- One three-bedroom apartment at `8a King AJ turner Crescent, Wuye, Abuja, Nigeria`

The data model must support future residences and other bedroom counts. Each residence is an individual bookable unit rather than a quantity attached permanently to a bedroom category.

Current stack:

- Next.js 16.2.9 App Router
- React 19.2.4
- TypeScript
- Tailwind CSS v4
- Kumo UI
- React Hook Form and Zod
- OpenNext Cloudflare
- Wrangler

## Repository Architecture Decision

Frontend and backend remain in this same Next.js repository and deploy as one Cloudflare Worker application.

This is a full-stack Next.js application, not a monorepo. Do not create a second backend repository or a separately deployed API for the first release.

The existing repository will contain:

- App Router pages and client components
- Next.js Route Handlers under `app/api/`
- Server-only modules under `lib/server/`
- Shared Zod schemas and TypeScript types
- D1 migrations under `migrations/`
- R2 upload and receipt-access logic
- Reservation expiry processing
- Admin auth checks and notification logic

Planned shape:

```text
app/api/
  availability/
  reservations/
  payments/
  admin/

lib/server/
  auth/
  db/
  notifications/
  reservations/
  uploads/

migrations/
```

OpenNext/Cloudflare Workers is the single runtime and deployment target. Reconsider a separate backend only if future requirements introduce multiple independent clients, heavy background workloads, or incompatible runtime needs.

## Approved Guest Journey

1. Guest views a residence and optional virtual walkthrough.
2. Guest selects a specific residence, check-in date, check-out date, guest count, and contact details.
3. The server checks availability and creates a 10-minute soft reservation window.
4. The guest sees the server-calculated total and admin-configured bank details.
5. The guest transfers manually and uploads payment proof.
6. The guest may still submit proof after the window expires.
7. Admin reviews payment and current availability.
8. Only admin confirmation creates the true date lock.
9. Guest receives confirmation, rejection, or cancellation notification.

KYC has been removed from scope. The existing `/kyc` route and related components should be deleted before or during backend implementation.

## Confirmed Business Rules

### Dates and occupancy

- Minimum stay: one night
- Check-in: 2:00 PM
- Check-out: 12:00 PM
- Check-out is exclusive for inventory, so another guest may check in on the previous guest's check-out date.
- Guest-count choices should be `1`, `2`, `3`, `4`, `5`, and `6+`.
- `6+` requires admin review and does not imply automatic unlimited occupancy approval.

### Pricing

- Nightly rates are set separately for each residence in the admin dashboard.
- One refundable caution fee is set in the admin dashboard and charged once per reservation.
- Total is `(nightly rate × nights) + caution fee`.
- The server calculates and snapshots all pricing.
- Long-stay discounts are handled personally and are not calculated automatically.

### Ten-minute window

- The window begins when the reservation is successfully created on the server.
- During the window, the requested nights are temporarily unavailable to new requests.
- At expiry, temporary availability claims are released.
- The guest sees a popup explaining that the reservation is now unlocked.
- The guest may still continue and submit payment proof.
- Late proof does not automatically reclaim or lock dates.
- Payment submission is not confirmation.
- Admin confirmation must recheck and claim all nights transactionally.

Do not use a terminal `expired` reservation status. Store window timestamps separately because an expired-window reservation can later become `payment_submitted`.

### Payment

- First release: manual bank transfer
- Bank name, account name, and account number are configured in the admin dashboard.
- Real payment instructions must not display until bank settings exist.
- Payment receipts are private R2 objects with temporary upload/read authorization.
- Placeholder account details currently exist in the frontend and must not be used for real payments.

### Admin

Preferred initial protection: Cloudflare Access using an approved admin email.

Admin can:

- View, search, filter, and inspect reservations
- View private payment proof
- Confirm, reject, cancel, and edit reservations
- Change dates with a fresh conflict check
- Set nightly rates and the refundable caution fee
- Set bank-transfer details
- Block and unblock dates
- Set notification email and WhatsApp number
- Export confirmed reservations
- View audit events

### Notifications

- Resend is the approved email provider.
- The Resend account/API key can be created before the custom domain is purchased, but production delivery requires a verified owned domain or sending subdomain.
- Prefer `send.<production-domain>` for transactional sending and keep the API key in Worker secrets.
- Admin notification email and WhatsApp number are dashboard settings.
- Guest email and WhatsApp number are collected during reservation.
- Email notifications should cover reservation creation/proof receipt and final status changes.
- Automated WhatsApp requires Meta WhatsApp Business Cloud API or another compatible provider; a phone number by itself cannot send automated messages.
- Until a WhatsApp provider is configured, use click-to-chat actions and automated email.

### Policies

A public policies page is required before production launch, covering:

- Cancellations
- Refunds
- Refundable caution-fee terms and return timing
- House rules
- Late payments and competing paid requests

The exact refund outcome when two guests pay for overlapping dates remains a pending policy decision. The system must never confirm both.

## Status Model

Reservation statuses:

- `pending_payment`
- `payment_submitted`
- `confirmed`
- `rejected`
- `cancelled`

Payment statuses:

- `not_submitted`
- `submitted`
- `verified`
- `refund_due`
- `refunded`

Window state comes from timestamps such as:

- `window_started_at`
- `window_expires_at`
- `window_released_at`
- `payment_submitted_at`

Every important mutation should append a reservation event/audit record.

## Backend Architecture

- Cloudflare Workers/OpenNext: server runtime
- D1: transactional source of truth
- R2: private payment-receipt storage
- Cron Trigger: expired soft-window cleanup
- Cloudflare Access: initial admin authentication
- Turnstile: public mutation protection
- Resend: transactional email
- WhatsApp Business integration: later automated WhatsApp delivery
- Google Sheets and Calendar: optional secondary exports only

Suggested tables:

- `residences`
- `reservations`
- `reservation_nights`
- `payments`
- `uploads`
- `blocked_nights`
- `app_settings`
- `reservation_events`
- `notification_deliveries`

`reservation_nights` must distinguish temporary and confirmed claims. Database constraints and transactions must prevent two confirmed claims for the same residence/night. Check-out dates are not inserted as occupied nights.

## Cloudflare Environment State

Production:

- Worker: `staybyjordan`
- D1: `staybyjordan-prd`
- R2: `staybyjordan-payment-receipts-prd`

Staging:

- Worker environment: `stg`
- Deployed Worker name: `staybyjordan-stg`
- D1: `staybyjordan-stg`
- R2: `staybyjordan-payment-receipts-stg`

Application binding names are deliberately identical in both environments:

- `DB`
- `PAYMENT_RECEIPTS`
- `ASSETS`

Environment rules:

- Top-level Wrangler configuration is production.
- `env.stg` is staging.
- Staging D1/R2 bindings use `remote: true` for explicit integration testing against real staging resources.
- Production bindings do not use `remote: true`.
- Normal local work should use simulated local resources unless staging integration testing is intentional.
- Persistent Worker logs are enabled at 100% sampling; traces are disabled.

Still pending:

- D1 migrations and seed data
- Cron trigger
- Turnstile widget/secrets
- Resend API key and verified sending domain
- Cloudflare Access and custom domain
- WhatsApp Business provider

## Implementation Sequence

### Phase 0 — Frontend baseline

Completed:

1. Frontend baseline committed.
2. OpenNext Cloudflare build/deploy pipeline corrected.
3. Frontend deployed to a `workers.dev` test URL.
4. Observability configured.
5. Production and staging D1/R2 resources created and bound.

Do not accept real bookings, transfers, or receipts on the current deployment.

### Phase 1 — Product alignment and infrastructure

1. Remove KYC route/components and KYC mock statuses.
2. Change guest selection to end at `6+`.
3. Add caution fee to reservation/payment summaries.
4. Add expired-window popup that still permits payment submission.
5. Ensure placeholder bank details cannot be mistaken for live details.
6. Add or reserve the policies-page route.
7. Create migrations and seed both residences.
8. Add server-only modules under `lib/server/`.
9. Add Next.js Route Handlers under `app/api/`.
10. Configure environment-specific secrets and local variables.
11. Configure Cloudflare Access for `/admin` after attaching a custom domain.
12. Create Resend account/API key and verify a sending domain.
13. Add Turnstile.

### Phase 2 — Reservation vertical slice

1. Replace client-only availability with D1 reads.
2. Create reservations and soft nightly claims atomically.
3. Calculate and snapshot rates/caution fee on the server.
4. Return an authoritative server expiry time.
5. Release soft claims through request-time cleanup and Cron.
6. Support late proof submission without relocking dates.
7. Store proof privately in R2 and metadata in D1.

### Phase 3 — Admin and notifications

1. Replace dashboard mock data with D1.
2. Add settings for prices, caution fee, bank data, and notification destinations.
3. Implement edit, block, confirm, reject, and cancel actions.
4. Add transactional conflict checks for confirmation.
5. Add Resend email delivery, retrying, and delivery logs.
6. Add WhatsApp automation only after provider credentials are available.

### Phase 4 — Launch readiness

1. Publish policy copy and acceptance.
2. Add exports and optional Google synchronization.
3. Perform security, privacy, concurrency, and mobile QA.
4. Attach a custom domain.
5. Only then accept real reservations and payment receipts.

## Deployment Configuration

Cloudflare Workers Builds is configured with:

- Build command: `pnpm exec opennextjs-cloudflare build`
- Production deploy command: `pnpm exec opennextjs-cloudflare deploy`
- Non-production/staging deploy command: `pnpm exec opennextjs-cloudflare deploy --env stg`
- Project path: `/`

The frontend deployment succeeds. It remains a testing deployment until the server implementation is complete:

- `/admin` is public.
- Data is browser-local and not shared.
- No reservation locking exists across users.
- Bank details are placeholders.
- Payment uploads are not private server uploads.
- Do not accept real payments or personal payment receipts yet.

## Current Frontend Notes

- The deployed frontend is static/prerendered.
- Pricing, blocked dates, countdowns, and admin actions are client-only.
- Reservation/payment handoffs use session storage.
- D1 and R2 bindings exist but are not used by application code yet.
- The visual direction is approved: premium private hospitality, ink/ivory/champagne palette, restrained typography, and Kumo-first standard controls.
- `/visualization` uses the hosted Coohom link with iframe attempt and external fallback.
- `/admin` remains a preview until Access and D1 are implemented.
- OpenNext/Wrangler may emit a known non-fatal duplicate `options` warning from bundled Kumo code.

## Required Verification

For code changes:

```bash
pnpm lint
pnpm build
pnpm opennextjs-cloudflare build
pnpm wrangler deploy --dry-run --env=""
pnpm wrangler deploy --dry-run --env stg
```

For documentation-only changes, inspect the diff and check internal consistency; a full build is not required.

## Remaining Inputs Needed Later

- Approved admin login email address
- Real bank name, account name, and account number
- Initial refundable caution-fee amount
- Initial nightly rates if different from current frontend defaults
- Purchased custom domain
- Resend verified sending subdomain/from-address
- Final cancellation, refund, caution-fee, and house-rule copy
- Decision and credentials for automated WhatsApp delivery
- Final policy for overlapping paid requests and refund timing
