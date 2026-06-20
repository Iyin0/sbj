# Stay By Jordan Product Spec

## Project Identity

Project directory: `sbj`

Future repository name: `stay-by-jordan`

Business display name: `Stay By Jordan`

Instagram handle: `@stay_by_jordan`

Instagram URL: `https://www.instagram.com/stay_by_jordan/`

WhatsApp URL: `https://wa.me/2349066875283`

Mobile phone: `+2349066875283`

Current status: approved frontend awaiting a frontend-baseline commit and test deployment, followed by backend implementation.

## Original Product Request

Build a fast, lightweight webapp for an Airbnb-style business hosted on Cloudflare Workers. Guests should be able to visit the site, view available reservation dates, request a reservation, see admin-configured payment details, receive a clear 10-minute payment window, upload payment proof, and await admin confirmation. The admin should receive notifications and be able to review, confirm, reject, cancel, or edit reservations.

The app should use Next.js and stay less complex/heavy. Google Sheets and Google Calendar may be used for owner-friendly records/calendar views, but they should not be the transactional source of truth for reservations.

## Current Technical Stack

- Next.js `16.2.9` with App Router
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- Kumo UI via `@cloudflare/kumo`
- React Hook Form
- Zod with `@hookform/resolvers`
- Phosphor icons via `@phosphor-icons/react`
- Cloudflare Workers deployment through `@opennextjs/cloudflare`
- Wrangler for preview/deployment validation

Important scripts:

- `pnpm dev`
- `pnpm lint`
- `pnpm build`
- `pnpm opennextjs-cloudflare build`
- `pnpm wrangler deploy --dry-run`
- `pnpm preview`
- `pnpm deploy`

## Cloudflare Configuration

Configured files:

- `open-next.config.ts`
- `wrangler.jsonc`
- `next.config.ts`

Current Worker name: `stay-by-jordan`

Current compatibility date: `2026-06-18`

Current bindings: static assets only through `ASSETS`.

Not yet configured:

- Cloudflare D1
- Cloudflare R2
- Cron triggers
- Resend secrets
- WhatsApp Business messaging credentials
- Cloudflare Access/Auth
- Custom domain
- Account ID/API token

Generated Cloudflare/OpenNext artifacts are ignored:

- `.open-next/`
- `.wrangler/`

## Product Architecture Direction

Approved first-release architecture:

- `Cloudflare Workers/OpenNext` for hosting and server runtime
- `Cloudflare D1` as the source of truth for residences, reservations, nightly availability, guests, payment status, admin settings, and audit events
- `Cloudflare R2` as private storage for payment receipts and later native 360 panorama assets
- `Cloudflare Cron` to expire 10-minute soft reservation windows and release their temporary availability claims
- `Resend` for transactional email notifications
- A future WhatsApp Business provider integration for automated WhatsApp notifications
- `Cloudflare Access` as the preferred first admin authentication layer
- `Cloudflare Turnstile` for anti-spam protection on public reservation and payment-submission forms
- Google Sheets as a secondary owner record/export only
- Google Calendar as a secondary calendar/sync view only

Google Sheets and Google Calendar should not be used to prevent double bookings or enforce reservation locking because they are not transactional enough for live reservation availability.

The 10-minute reservation window is a temporary availability claim, not a confirmed booking. Only an admin-confirmed reservation is a true date lock. A guest may still submit payment after the window expires, but the dates may have become available to other guests and confirmation is no longer assured.

## Current Page Map

- `/` premium landing page
- `/reservations` apartment selection and Kumo date-range calendar
- `/visualization` hosted Coohom walkthrough iframe with external fallback
- `/payment` manual transfer details and 10 minute payment window concept
- `/admin` owner dashboard preview
- `/about` concept and implementation direction
- `/policies` cancellations, refunds, house rules, check-in/out times, and guest guidance

The existing `/kyc` route and KYC components are to be removed before or during the backend phase. KYC is out of scope until the business explicitly resumes it.

## Virtual Walkthrough Requirement

The user currently wants the virtual walkthrough to be simple: open the provided hosted visualization link on a dedicated page. Native panorama hosting/viewing is a later option.

Current walkthrough URL is stored in `lib/site-data.ts` as `walkthroughUrl`.

Current behavior:

- `/visualization` attempts an iframe embed.
- It also provides an external open button because Coohom may block iframe embedding.

Later native direction:

- Store panorama images in R2.
- Store scenes/hotspots in D1.
- Use a native 360 viewer such as Photo Sphere Viewer, Pannellum, or Marzipano.

## Apartment Data

Current inventory consists of exactly two independently bookable residences:

- One two-bedroom apartment
- One three-bedroom apartment

Residence addresses:

- Two-bedroom: `Glendale Pearl Estate, Wuye, Abuja, Nigeria`
- Three-bedroom: `8a King AJ turner Crescent, Wuye, Abuja, Nigeria`

The data model must represent individual residences rather than assuming one permanent unit per bedroom count. This allows additional residences or different bedroom counts to be added later without redesigning reservations.

Guest-count selection should present `1`, `2`, `3`, `4`, `5`, and `6+` rather than an unbounded list. Selecting `6+` is a request for admin review, not automatic approval of unlimited occupancy.

## Reservation Flow

Approved guest flow:

1. Guest views apartment/residence information.
2. Guest opens virtual walkthrough.
3. Guest selects a specific residence and date range in `/reservations`.
4. Guest enters contact details and guest count.
5. Server verifies current availability and creates a `pending_payment` reservation with a 10-minute soft reservation window.
6. The selected nights are temporarily unavailable to new requests until the window expires.
7. Guest sees the total and admin-configured bank-transfer instructions.
8. Guest uploads payment proof, either before or after the 10-minute window ends.
9. If the window expires, a popup tells the guest that the reservation is now unlocked and the dates are no longer temporarily reserved. The popup must still allow the guest to continue to payment-proof submission.
10. Payment submission does not create a guaranteed date lock.
11. Admin reviews payment, guest details, current date availability, and any competing requests.
12. Admin confirms or rejects the request. Only confirmation creates the true date lock.
13. If approved, the guest receives confirmation by email and, once configured, WhatsApp.
14. Confirmed reservations may sync to Google Sheets and Google Calendar as secondary records.

The guest reservation flow ends after payment-proof submission:

- Tell the guest that the admin team will contact them shortly.
- State clearly that payment submission is not final confirmation.
- Mention the email update and configured WhatsApp contact.
- Provide WhatsApp, phone, and back-to-home actions.

### Availability and Date Rules

- Minimum stay: one night.
- Check-in time: `2:00 PM`.
- Check-out time: `12:00 PM`.
- Check-out is exclusive for inventory. For a stay from July 12 to July 15, the occupied nights are July 12, 13, and 14; July 15 can be another guest's check-in date.
- Past dates are disabled.
- Admin-blocked dates and confirmed reservation nights are unavailable.
- Active, unexpired 10-minute reservation windows are temporarily unavailable.
- When a soft window expires, its temporary nightly claims are released immediately.
- A late payment submission remains reviewable but does not reclaim dates automatically.
- Admin confirmation must run a fresh server-side availability check and claim all nights atomically.
- If any night has already been confirmed or admin-blocked, confirmation must fail and present the conflict to the admin.
- The unresolved business case for overlapping paid requests is handled manually until the refund policy is finalized. The admin must not confirm both.

### Pricing Rules

- Nightly rates are configured separately for each residence from the admin dashboard.
- A single refundable caution fee is configured from the admin dashboard and applied once per reservation.
- Reservation total:

```text
(nightly rate × number of nights) + refundable caution fee
```

- The server calculates all totals. Client-supplied totals are never trusted.
- The reservation stores snapshots of the nightly rate, caution fee, number of nights, subtotal, and total so later admin price changes do not alter an existing request.
- Long-stay discounts are communicated and handled personally; no automatic discount engine is required.
- Public copy may state that longer-stay offers are available by contacting the admin team.

### Reservation Window and Status Model

Window expiry must not be represented as a terminal reservation status because the guest may still submit proof afterward.

Core reservation statuses:

- `pending_payment`
- `payment_submitted`
- `confirmed`
- `rejected`
- `cancelled`

Core payment statuses:

- `not_submitted`
- `submitted`
- `verified`
- `refund_due`
- `refunded`

Important timestamps and flags:

- `window_started_at`
- `window_expires_at`
- `window_released_at`
- `payment_submitted_at`
- `confirmed_at`
- `rejected_at`
- `cancelled_at`
- `submitted_after_window` derived from the payment and window timestamps

All status changes and admin actions should be written to an append-only reservation event/audit table.

### Form and Handoff Rules

- Use React Hook Form and Zod for every submitted form.
- Use Kumo components for visible fields, selects, checkboxes, date pickers, overlays, and feedback.
- Homepage check-in and check-out use separate date-button popovers with one calendar month each.
- Guest contact and reservation data must be sent to the server and referenced by a non-sensitive reservation token or authenticated session. Do not place personal data in URL query parameters.
- The reservation calendar opens on the current month by default, or on the homepage-selected check-in month when dates were handed off.
- Public UI copy must read as a finished product. Do not expose terms such as MVP, prototype, demo, frontend preview, live version, or implementation notes to guests.

## Payment Direction

The first release uses manual bank transfer with proof upload.

Admin-configured payment settings:

- Bank name
- Account name
- Account number
- Refundable caution fee

Payment details must come from server-side admin settings. Placeholder bank details must not be shown in a real booking flow. If bank details have not been configured, the system must prevent a real payment request and show a contact/admin-assistance state instead.

Payment receipts must be stored in a private R2 bucket with:

- Allow-listed PNG, JPEG, and PDF content types
- A maximum upload size
- Generated object keys rather than guest-supplied filenames
- Time-limited upload authorization
- Admin-only, time-limited read access
- Database metadata connecting each object to its reservation

Future payment gateway options remain Paystack, Flutterwave, or Stripe, but they are not part of the first backend phase.

## KYC Direction

KYC is paused and removed from the active product scope:

- Remove `/kyc` from the page map and active navigation/flow.
- Remove KYC from reservation statuses, database schema, upload requirements, and implementation tasks.
- Preserve no production KYC data.
- Reintroduce KYC only after a future business and retention-policy decision.

## Admin Requirements

The first admin should be protected with Cloudflare Access, using an approved admin email identity. Application-level roles can be added later if multiple staff members require different permissions.

Admin capabilities:

- View, search, and filter reservation requests
- View payment proof through temporary private links
- Confirm, reject, cancel, and edit reservations
- Change requested dates, subject to a fresh conflict check
- Set and update nightly rates
- Set the single refundable caution fee
- Set bank-transfer details
- Block and unblock date ranges
- Set notification email address
- Set notification WhatsApp number
- Export confirmed reservations
- View an audit history of important actions

Admin confirmation must be transactional: recheck every requested night, create the confirmed nightly locks, update the reservation, and append an audit event as one logical operation.

## Notification Requirements

- Use Resend for automated email.
- Admin notification destination email is configurable in the admin dashboard.
- Admin WhatsApp number is configurable in the admin dashboard.
- Guest email and WhatsApp number are collected with the reservation.
- Notify the admin when a reservation is created and when proof is submitted.
- Notify the guest when proof is received and when a request is confirmed, rejected, or cancelled.
- Notification failures must be logged and retryable; they must not roll back a successfully stored reservation or payment proof.
- A phone number alone cannot send automated WhatsApp messages. Automated WhatsApp delivery requires a later Meta WhatsApp Business Cloud API or compatible provider setup. Until configured, the product can provide click-to-chat WhatsApp actions while Resend handles automated email.

## Policies

A public policies page is required before production launch and should cover:

- Cancellation policy
- Refund policy
- Refundable caution-fee terms and return timing
- House rules
- Treatment of late payments and conflicting paid requests

Guests should accept the applicable policies during reservation submission once the final copy is supplied.


## Design Direction

The user rejected the first warm/average design and requested a premium, prestige feel.

Current approved direction to continue refining:

- Private hospitality concierge feel
- Ink-black background
- Champagne/gold accents
- Ivory premium surfaces
- Restrained typography
- Large whitespace
- Minimal, confident copy
- Operational screens should feel like a luxury booking desk, not generic SaaS

Global theme and visual primitives are in `app/globals.css`.

## Kumo UI Requirements

The user wants Kumo UI as the design library: `https://kumo-ui.com/`.

Kumo-first implementation rule:

- Use Kumo for every suitable standard interface primitive, including buttons, links, fields, selects, choice controls, cards/surfaces, standard grids, badges, tables, tabs, overlays, empty states, and feedback.
- Custom HTML and CSS are reserved for editorial structure, imagery, brand composition, or cases where Kumo has no appropriate component.
- Do not hand-roll a standard control or surface when Kumo provides an appropriate equivalent.
- Prefer a single barrel import from `@cloudflare/kumo` instead of multiple granular imports when practical.
- Keep custom styling focused on brand expression, editorial composition, spacing, imagery, and premium polish.

Recommended Kumo review checklist:

- Read Kumo installation docs.
- Read Kumo component docs for all listed components on the Kumo site.
- Inspect installed TypeScript definitions in `node_modules/@cloudflare/kumo/dist/src/components/*` when API details are unclear.
- Check whether each page can use Kumo components more consistently.
- Replace granular imports with barrel import syntax such as `import { Badge, Button, LayerCard } from "@cloudflare/kumo";` where exported.
- Verify Kumo compound components that require client-side rendering, such as `Table`, are isolated in client components when needed.

Known Kumo/OpenNext note:

- OpenNext/Wrangler currently emits a non-fatal duplicate `options` key warning from bundled Kumo dependency code.
- `pnpm wrangler deploy --dry-run` still validates successfully.

## Current Implementation Notes

Important files:

- `lib/site-data.ts`: static concept data, apartment data, payment details, walkthrough URL
- `components/site-header.tsx`: shared premium header
- `components/site-footer.tsx`: shared premium footer
- `components/section-heading.tsx`: shared page section intro
- `components/reservation-date-range.tsx`: client-side Kumo date range and booking form
- `components/admin-reservation-table.tsx`: client-side Kumo admin table
- `app/*/page.tsx`: route pages

The app is currently static/prerendered. There are no server actions, D1 queries, R2 uploads, auth, or live notifications yet.

Current frontend-only behavior that must be replaced during backend work:

- Reservation handoff and countdown use `sessionStorage`.
- Blocked dates, nightly pricing, and admin actions use client state or `localStorage`.
- Payment details are static placeholders.
- `/admin` is publicly accessible and is not safe for real operational data.
- The current frontend does not prevent competing reservations across browsers or devices.
- `/kyc` and its related components still exist in code and must be removed.

## Future Implementation Tasks

### Phase 0 — Frontend Baseline and Test Deployment

1. Run the required frontend verification commands.
2. The user commits the approved frontend and current documentation as the frontend baseline.
3. Deploy that baseline to a `workers.dev` test URL.
4. Perform desktop/mobile visual and interaction QA.
5. Do not accept real reservations, transfers, or payment receipts from this test deployment.

### Phase 1 — Product Alignment and Backend Foundation

1. Remove KYC from the active frontend and codebase.
2. Update guest-count choices to end at `6+`.
3. Add the refundable caution fee to reservation and payment summaries.
4. Add a clear expired-window popup that allows late proof submission.
5. Add the future policies-page shell or keep policy acceptance disabled until copy is ready.
6. Create D1 development and production databases.
7. Add migrations and seed the two current residence records.
8. Create a private R2 bucket for payment receipts.
9. Add environment bindings, generated Cloudflare types, and local development configuration.
10. Add Cloudflare Access protection for `/admin`.
11. Add Turnstile and server-side verification to public mutation endpoints.

### Phase 2 — Reservation Vertical Slice

1. Read availability from D1.
2. Create a reservation and its temporary nightly claims atomically.
3. Calculate and snapshot nightly rates, caution fee, subtotal, and total on the server.
4. Return a server-generated reservation token and authoritative `window_expires_at`.
5. Release expired soft claims through request-time cleanup plus Cron.
6. Allow late payment-proof submission without silently relocking dates.
7. Upload payment proof privately to R2.
8. Record reservation/payment events in an audit log.

### Phase 3 — Admin Operations and Notifications

1. Replace dashboard preview data with live D1 data.
2. Implement admin settings for rates, caution fee, bank details, notification email, and notification WhatsApp number.
3. Implement confirm, reject, cancel, edit, block-date, and unblock-date actions.
4. Make confirmation perform a fresh transactional conflict check.
5. Add Resend email notifications and retry/logging behavior.
6. Add WhatsApp click-to-chat first; add automated WhatsApp only after Business API credentials are configured.

### Phase 4 — Policies, Reporting, and Optional Integrations

1. Publish cancellation, refund, caution-fee, and house-rule copy.
2. Add guest policy acceptance and policy-version snapshots.
3. Add confirmed-reservation exports.
4. Add Google Sheets and Calendar secondary synchronization if desired.
5. Evaluate Paystack, Flutterwave, or Stripe only after the manual-transfer flow is stable.

## Initial Data Model Direction

- `residences`: individual bookable units, bedroom count, address, active state
- `residence_rates`: current admin-configured nightly rate or a settings-backed equivalent
- `reservations`: guest details, requested dates, pricing snapshots, status, and window timestamps
- `reservation_nights`: one row per occupied night, with temporary or confirmed claim state
- `payments`: proof state, submitted amount/note, timestamps, verification/refund state
- `uploads`: private R2 object metadata
- `blocked_nights`: admin-created unavailability
- `app_settings`: caution fee, bank details, notification destinations, check-in/out values
- `reservation_events`: append-only audit history
- `notification_deliveries`: channel, template/event, attempts, provider response, and status

Use database constraints and transactions to prevent two confirmed reservations for the same residence/night. Temporary claims should be releasable without deleting reservation/payment history.

## Frontend Test Deployment Setup

The frontend can be deployed before D1, R2, Resend, or Access are configured, because the current build uses only the `ASSETS` binding.

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

On first use, Cloudflare may ask the account owner to register a `workers.dev` subdomain. The deployed Worker name is `stay-by-jordan`, so the initial test URL will be under that account's `workers.dev` domain.

Frontend deployment cautions:

- Treat this deployment as a visual/interaction test, not a live booking system.
- `/admin` is public until Cloudflare Access is configured.
- Reservations and admin changes are browser-local and do not synchronize between users.
- Placeholder bank details must not be used for real transfers.
- Do not collect real payment proof until private R2 storage and server authorization exist.
- A custom domain can be attached after the test deployment is accepted.

## Verification Standard

After code changes, run:

```bash
pnpm lint
pnpm build
pnpm opennextjs-cloudflare build
pnpm wrangler deploy --dry-run
```

If only Markdown/spec files change, a full build is not required, but checking affected files manually is still expected.
