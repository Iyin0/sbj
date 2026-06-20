# Stay By Jordan — Codex Handoff

## Current State

- Project: `/home/iyin/work/sbj` in the Ubuntu WSL distribution
- Branch: `main`
- HEAD: `6ce8b80` (`Initial commit from Create Next App`)
- The approved frontend and documentation changes are still uncommitted.
- The user intends to create the frontend-baseline commit personally.
- The frontend may be deployed to Cloudflare for visual and interaction testing before backend work starts.
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

## Implementation Sequence

### Phase 0 — Frontend baseline

1. Run all frontend verification.
2. User creates the frontend-baseline commit.
3. Deploy to a Cloudflare `workers.dev` test URL.
4. Perform desktop/mobile visual and interaction QA.
5. Do not accept real bookings, transfers, or receipts on this deployment.

### Phase 1 — Product alignment and infrastructure

1. Remove KYC route/components and KYC mock statuses.
2. Change guest selection to end at `6+`.
3. Add caution fee to reservation/payment summaries.
4. Add expired-window popup that still permits payment submission.
5. Ensure placeholder bank details cannot be mistaken for live details.
6. Add or reserve the policies-page route.
7. Create D1 development and production databases.
8. Create a private R2 payment-receipt bucket.
9. Add Wrangler bindings and generated environment types.
10. Create migrations and seed both residences.
11. Configure Cloudflare Access for `/admin`.
12. Create Resend account/API key and verified sender.
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

## Frontend Test Deployment

The current frontend requires no D1 or R2 setup to deploy because `wrangler.jsonc` currently binds only static assets.

From `/home/iyin/work/sbj`:

```bash
pnpm install
pnpm lint
pnpm build
pnpm opennextjs-cloudflare build
pnpm wrangler deploy --dry-run
pnpm wrangler login
pnpm wrangler whoami
pnpm deploy
```

Cloudflare may ask the user to create a `workers.dev` subdomain on the first deployment. Worker name: `stay-by-jordan`.

This deployment is for testing only:

- `/admin` is public.
- Data is browser-local and not shared.
- No reservation locking exists across users.
- Bank details are placeholders.
- Payment uploads are not private server uploads.
- Do not accept real payments or personal payment receipts yet.

## Current Frontend Notes

- Frontend is static/prerendered.
- Pricing, blocked dates, countdowns, and admin actions are client-only.
- Reservation/payment handoffs use session storage.
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
pnpm wrangler deploy --dry-run
```

For documentation-only changes, inspect the diff and check internal consistency; a full build is not required.

## Remaining Inputs Needed Later

- Approved admin login email address
- Real bank name, account name, and account number
- Initial refundable caution-fee amount
- Initial nightly rates if different from current frontend defaults
- Resend sending domain/from-address
- Final cancellation, refund, caution-fee, and house-rule copy
- Decision and credentials for automated WhatsApp delivery
- Final policy for overlapping paid requests and refund timing
- Desired production custom domain
