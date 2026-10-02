# Project's Auto Detailing — website

Marketing and booking site for Project's Auto Detailing, an owner-operated, fully mobile auto
detailer. Kevin (known to customers as "Project") founded the business in 2024 at sixteen, and does
the work himself at the customer's home or workplace. The home city, region and service area are set
in `src/config/site.ts`. Every page is built to turn a visitor into a booking: services and transparent pricing, a
gallery of real work, FAQs, and an online booking flow that emails the shop.

Business facts (name, phone, hours, prices, services) live in a handful of typed data files, so the
owner's details can change without touching page code.

## Stack

| Layer     | Choice                                                                               |
| --------- | ------------------------------------------------------------------------------------ |
| Framework | [Next.js 16](https://nextjs.org) App Router, React 19, TypeScript (strict)           |
| Styling   | Tailwind CSS v4, CSS-first tokens in `src/app/globals.css` (no `tailwind.config.js`) |
| Motion    | [`motion`](https://motion.dev) (`motion/react`), respects `prefers-reduced-motion`   |
| Forms     | `react-hook-form` + `zod` v4                                                         |
| Email     | [Resend](https://resend.com) (optional; logs to the console when unset)              |
| Icons     | `lucide-react`                                                                       |
| Tests     | Vitest + Testing Library (unit), Playwright (end-to-end)                             |
| Hosting   | Vercel                                                                               |

> Next.js 16 differs from older versions (async `params`, `PageProps<'/route'>` helpers, `proxy.ts`
> instead of middleware). The bundled docs in `node_modules/next/dist/docs/` are the source of truth.

## Getting started

Requires Node.js 20.9+ (22 recommended) and pnpm 10 (`corepack enable` picks the pinned version).

```bash
pnpm install
cp .env.example .env.local   # optional: every variable has a safe default
pnpm dev                     # http://localhost:3000
```

## Scripts

| Command                             | What it does                                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm dev`                          | Start the dev server with hot reload                                                                                           |
| `pnpm build`                        | Production build (also prerenders the sitemap, robots, social image and icons)                                                 |
| `pnpm start`                        | Serve the production build on port 3000                                                                                        |
| `pnpm lint`                         | ESLint (Next.js core-web-vitals + TypeScript rules)                                                                            |
| `pnpm typecheck`                    | `tsc --noEmit`. On a fresh clone, run `pnpm exec next typegen` (or `pnpm dev`/`pnpm build`) once first to generate route types |
| `pnpm test`                         | Unit tests with Vitest                                                                                                         |
| `pnpm test:watch`                   | Vitest in watch mode                                                                                                           |
| `pnpm test:e2e`                     | Playwright smoke tests against `pnpm start` (run `pnpm build` first)                                                           |
| `pnpm format` / `pnpm format:check` | Prettier with Tailwind class sorting                                                                                           |

## Environment variables

Copy `.env.example` to `.env.local` for local work and set the same keys in Vercel for production.

| Variable               | Required       | Purpose                                                                                                                              |
| ---------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Production     | Canonical origin for metadata, sitemap, robots and JSON-LD, e.g. `https://projectsautodetailing.com`                                 |
| `NEXT_PUBLIC_GA_ID`    | No             | Google Analytics 4 ID (`G-XXXXXXX`). Blank disables analytics. Must be set at build time; it also opens the CSP for Google's domains |
| `RESEND_API_KEY`       | For live email | Sends booking and contact emails. Blank logs submissions to the server console instead                                               |
| `BOOKING_NOTIFY_EMAIL` | For live email | Inbox that receives new bookings and messages                                                                                        |
| `BOOKING_FROM_EMAIL`   | For live email | Verified Resend sender, e.g. `"Project's Auto Detailing <bookings@projectsautodetailing.com>"`                                       |

## Project structure

```text
src/
  app/                 Routes (App Router). One folder per page, plus:
    sitemap.ts         /sitemap.xml   (static routes + one entry per service)
    robots.ts          /robots.txt    (blocks everything on Vercel preview deployments)
    manifest.ts        /manifest.webmanifest
    opengraph-image.tsx, twitter-image.tsx, icon.tsx, apple-icon.tsx   Generated at build
    privacy/, terms/   Legal pages
  components/
    ui/                Shared primitives: Button, Card, Section, Container, Badge, Logo...
    layout/            Header, footer, page hero, CTA banner
    analytics.tsx      Optional GA4 loader + trackEvent() helper
  config/site.ts       Business identity: name, contact details, hours, socials, stats, logo
  data/                Services and prices, FAQ, gallery, testimonials, process steps
  lib/
    seo/               JSON-LD builders, buildMetadata(), sitemap routes, social image renderer
    utils.ts           cn(), formatPrice(), absoluteUrl()
e2e/                   Playwright specs
public/images/         Photography and logo (see CREDITS.md)
```

## Editing content

Almost every change is a data edit. Pages, metadata, structured data and the sitemap update automatically.

| To change                                                                     | Edit                                                                                                                                                                                           |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Business name, phone, email, address, hours, service area, social links, logo | `src/config/site.ts`                                                                                                                                                                           |
| Main navigation                                                               | `navigation` in `src/config/site.ts`                                                                                                                                                           |
| Service packages, what each includes, prices by vehicle class, durations      | `src/data/services.ts`                                                                                                                                                                         |
| FAQ questions and answers (also feeds the FAQ rich result)                    | `src/data/faq.ts`                                                                                                                                                                              |
| Gallery photos, captions and filters                                          | `src/data/gallery.ts`                                                                                                                                                                          |
| Customer reviews (ships empty, see below)                                     | `src/data/testimonials.ts`                                                                                                                                                                     |
| "How it works" steps                                                          | `src/data/process.ts`                                                                                                                                                                          |
| Brand colors, radii, shadows, fonts                                           | Tokens at the top of `src/app/globals.css`                                                                                                                                                     |
| Privacy policy and terms                                                      | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` (the cancellation fee and work-vehicle surcharge sit in the `policy` object at the top of the terms page; keep them in step with the FAQ) |

### Services and prices

The catalog is the client's, recorded in `docs/SERVICES-SPEC.md`: four packages, all performed on
site (mobile), with no add-ons.

| Slug             | Package                                                                              |
| ---------------- | ------------------------------------------------------------------------------------ |
| `basic-wash`     | Basic Package — Exterior Wash                                                        |
| `premium-detail` | Premium Package — Exterior Detail (everything in Basic, plus more)                   |
| `full-deluxe`    | Full Deluxe Package — Inside + Outside (everything in Premium, plus the interior)    |
| `working-truck`  | Working Truck (starting price; a surcharge applies to extremely dirty work vehicles) |

Prices live per vehicle class in `src/data/services.ts`. **Any price marked `PLACEHOLDER` in that
file was not supplied by the client and must be replaced with a real one before launch.** Keep
`docs/SERVICES-SPEC.md`, `src/data/services.ts`, the FAQ and the `policy` object in the terms page in
step when anything changes.

### Founder and claims

- `siteConfig.founder` holds the owner's `name`, `nickname`, `title`, `since`, `startedAtAge`,
  `photo` / `photoSquare` (in `public/images/team/`) and `bio`. The About page and the JSON-LD
  `founder` field read from it.
- `siteConfig.claims` lists statements the site may make only when they are true and documented:
  - `insured` (`false` today): set to `true` only once a current liability policy is in place. While
    it is `false`, no page may say the business is insured.
  - Any other flag in `claims` stays off (`false` / `null`) unless the client can document it.

**Never fabricate ratings, reviews, review counts, vehicle counts or certifications.** Fake reviews
break FTC rules and Google's policies and can get the business listing suspended. `src/data/testimonials.ts`
ships empty, and any section that shows reviews must render nothing while it is empty. Add only real reviews, with
the customer's permission, exactly as they were written. The structured data deliberately emits no
`aggregateRating`.

Adding a service: append an object to `services` in `src/data/services.ts`. It appears on the services,
pricing and booking pages, gets its own `/services/<slug>` page, and is added to the sitemap.

Adding a page: create `src/app/<route>/page.tsx`, export `metadata` (use `buildMetadata()` from
`@/lib/seo/metadata` so canonical URLs and social images stay consistent), then add the route to
`staticRoutes` in `src/lib/seo/routes.ts` so it is included in the sitemap and the e2e smoke test.

Structured data: `@/lib/seo/json-ld` exports `<JsonLd />` and builders for the local business,
services, FAQ, breadcrumbs and website. All of them read from the config and data files above.

## Replacing images

All photography lives in `public/images/` and is currently licensed stock from Unsplash. Before launch,
replace it with the shop's own work:

1. Export photos as JPG, at least 1600px on the long edge (2400px for full-width heroes). Next.js
   serves AVIF/WebP at the right size automatically.
2. Either overwrite a file with the same name, or add a new file and update its path in
   `src/data/gallery.ts`, `src/data/services.ts` (`image`) or the page that uses it.
3. Write specific alt text (vehicle, color, service performed) in the data file.
4. Update `public/images/CREDITS.md`, which lists the source and license of every image.

The logo is `public/images/logo.png` (square, on black) and `public/images/logo-transparent.png`
(trimmed, transparent). The social sharing card and app icons are generated from the transparent logo at
build time by `src/lib/seo/og-image.tsx`, so replacing that file updates them too.

## SEO and security

- Per-page titles, descriptions, canonical URLs and Open Graph images via `buildMetadata()`.
- JSON-LD for the local business (`AutoWash` / `LocalBusiness`, hours, geo, founder, `areaServed`
  from the service area; no street address is emitted while `siteConfig.mobileOnly` is true), services,
  FAQ and breadcrumbs. Validate with Google's [Rich Results Test](https://search.google.com/test/rich-results).
- `/sitemap.xml` (including image entries) and `/robots.txt`, both generated from code.
- Security headers in `next.config.ts`: a Content Security Policy, `X-Frame-Options: DENY`,
  `nosniff`, a strict referrer policy, HSTS and a locked-down `Permissions-Policy`. The CSP comments
  explain each trade-off (notably `'unsafe-inline'` for scripts, which keeps every page static).
  If you embed a new third-party service (video, chat widget, booking tool), add its domain to the CSP.

## Testing

```bash
pnpm test                         # unit tests
pnpm build && pnpm test:e2e       # smoke-test every page against the production build
```

Unit tests sit next to the code in `__tests__/` folders: `*.test.ts` runs in Node, `*.test.tsx` in
jsdom with Testing Library matchers. The Playwright smoke test visits every route in
`src/lib/seo/routes.ts` and every service page, and checks for a 200 status, a single `h1`, title,
description and social image, and zero console errors. It also checks the sitemap, robots file,
generated images and security headers. If Chromium is not installed, run
`pnpm exec playwright install chromium` once.

CI (`.github/workflows/ci.yml`) runs install, lint, typecheck, unit tests, build and the e2e suite
on every pull request and push to `main`.

## Deployment (Vercel)

1. Import the repository in Vercel. The framework preset (Next.js) and pnpm are detected automatically.
2. Add the environment variables above for Production (and Preview if you want live email there).
   Set `NEXT_PUBLIC_SITE_URL` to the final domain.
3. Add the custom domain under **Settings → Domains**. Vercel provisions HTTPS.
4. After the first deploy, submit `https://<domain>/sitemap.xml` in Google Search Console and check
   the home page in the Rich Results Test.

Preview deployments automatically serve a `Disallow: /` robots file so they never get indexed.

## Deployment (GitHub Pages, static)

The site can also run with no server at all. `.github/workflows/deploy-pages.yml` builds a static export on
every push to `main` and publishes it to GitHub Pages.

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.** (The workflow also tries to enable
   this itself on its first run.)
2. Push to `main`. The site appears at `https://<user>.github.io/<repo>/` within a couple of minutes.
3. Optional repository variables (**Settings → Secrets and variables → Actions → Variables**):
   - `FORM_ENDPOINT`: a [Formspree](https://formspree.io)-style JSON endpoint. Booking and contact
     submissions are POSTed there. Without it, submitting a form opens the visitor's email app with the
     request pre-filled, addressed to `siteConfig.email`.
   - `GA_ID`: Google Analytics 4 measurement ID.
4. Custom domain: add it under **Settings → Pages → Custom domain** and commit a `public/CNAME` file
   containing the domain. The workflow derives the base path and site URL automatically, so nothing else
   changes.

What differs from the Node deploy:

|                  | Node host (Vercel)                      | GitHub Pages                              |
| ---------------- | --------------------------------------- | ----------------------------------------- |
| Forms            | Server Actions send email via Resend    | Form endpoint, or the visitor's email app |
| Images           | Optimized AVIF/WebP, resized per device | Original JPEGs served as-is               |
| Security headers | Set by `next.config.ts`                 | Not available on a static host            |
| URLs             | `/services`                             | `/services/` (trailing slash)             |

Build it locally with:

```bash
STATIC_EXPORT=true NEXT_PUBLIC_BASE_PATH=/<repo> NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo> pnpm build
# output in ./out
```
