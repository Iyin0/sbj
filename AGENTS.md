<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Stay By Jordan Context

Read `SPEC.md` before making product, UI, architecture, or Cloudflare-related changes. It is the source of truth for the current concept, pages, design direction, and future tasks.

Project identity:

- Directory: `sbj`
- Future repo name: `stay-by-jordan`
- Business name: `Stay By Jordan`
- Instagram handle: `@stay_by_jordan`

Current stack:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Kumo UI via `@cloudflare/kumo`
- OpenNext Cloudflare via `@opennextjs/cloudflare`
- Wrangler

Current product:

- Premium short-stay reservation concept for two-bedroom and three-bedroom apartments.
- Pages: `/`, `/reservations`, `/visualization`, `/kyc`, `/payment`, `/admin`, `/about`.
- `/visualization` uses the provided hosted Coohom walkthrough link with iframe attempt plus external fallback.
- Apartment addresses are placeholders. Public Instagram fetch did not expose usable address text. Do not invent addresses.
- Current app is static/prerendered. D1, R2, auth, notifications, cron expiry, Sheets sync, and Calendar sync are future work.

Design direction:

- Premium/prestige/private hospitality concierge.
- Ink-black base, champagne accents, ivory surfaces, restrained typography, generous whitespace.
- Avoid generic SaaS or average rental templates.
- Keep the experience calm, high-trust, and owner-controlled.

Kumo UI guidance:

- The user specifically wants Kumo UI as the design library.
- Before major UI changes, review relevant Kumo docs at `https://kumo-ui.com/` and installed type definitions in `node_modules/@cloudflare/kumo/dist/src/components/`.
- Prefer single barrel imports from `@cloudflare/kumo`, for example `import { Badge, Button, LayerCard } from "@cloudflare/kumo";`, unless a component is unavailable from the barrel export or there is a concrete reason to use granular imports.
- Use Kumo components for every suitable standard interface primitive, including buttons, links, fields, selects, choice controls, cards/surfaces, standard grids, badges, tables, tabs, overlays, empty states, and feedback.
- Custom HTML and CSS are reserved for editorial structure, imagery, brand composition, or cases where Kumo has no appropriate component. Do not hand-roll a standard control or surface that Kumo already provides.
- Kumo compound components that rely on client behavior may need to live inside client components. `components/admin-reservation-table.tsx` is currently a client wrapper for Kumo `Table`.

Cloudflare notes:

- `wrangler.jsonc` uses Worker name `stay-by-jordan`.
- No Cloudflare account credentials, account ID, zone ID, D1, R2, or secrets are configured yet.
- `.open-next/` and `.wrangler/` are generated artifacts and ignored.
- OpenNext/Wrangler may emit a non-fatal duplicate `options` warning from bundled Kumo dependency code; dry-run still validates.

Verification:

- For code changes, run `pnpm lint`, `pnpm build`, `pnpm opennextjs-cloudflare build`, and `pnpm wrangler deploy --dry-run`.
- For Markdown-only changes, a full build is not required.
