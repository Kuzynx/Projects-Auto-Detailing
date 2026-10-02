# Meridian Detail Co. — Build Brief

Premium auto detailing website. Target: the quality a $10k agency build delivers. Dark, cinematic,
automotive. Every page must feel finished, fast and conversion-focused (the goal of every page is a booking).

## Stack (do not change)
- Next.js 16 App Router, React 19, TypeScript strict. **Read `AGENTS.md` and `node_modules/next/dist/docs/` before using any Next API you're unsure of. Next 16 differs from training data** (e.g. `PageProps<'/route'>` / `LayoutProps` global helpers, `proxy.ts` instead of middleware, `params` is a Promise).
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`; **no `tailwind.config.js`**). Use the tokens: `bg-bg`, `bg-bg-elevated`, `bg-surface`, `border-border`, `text-ink`, `text-ink-muted`, `text-ink-subtle`, `text-brand-400`, `bg-brand-500`, `font-display`, `shadow-card`, `shadow-glow`, `rounded-lg`, utilities `container-x`, `text-gradient-brand`, `bg-grid`, animations `animate-fade-up`, `animate-marquee`.
- `motion` (Framer Motion v13 successor: `import { motion, useInView } from "motion/react"`) for animation in client components only. Respect `prefers-reduced-motion`.
- `lucide-react` icons. `zod` v4 + `react-hook-form` for forms. `next/image` for all images (`/public/images/*.jpg`, see `src/data/gallery.ts`).
- Shared UI: `@/components/ui` exports `Button`, `ButtonLink`, `buttonClasses`, `Container`, `Section`, `SectionHeading`, `Eyebrow`, `Card`, `Badge`. Use them. Add new shared primitives **only** in your own area folder unless told otherwise.
- Data: `@/config/site` (business identity, `navigation`, `bookingHref`), `@/data/services` (services, addOns, vehicleSizes, getService), `@/data/testimonials`, `@/data/faq`, `@/data/gallery`, `@/data/process`. **Never hardcode business facts; read from these.** You may add fields to data files only if your brief says you own that file.

## Conventions
- Server Components by default. `"use client"` only for interactivity, kept to leaf components.
- Every page exports `metadata` (title, description, OpenGraph) via `Metadata`.
- Accessibility: semantic landmarks, labelled controls, keyboard operable, visible focus, alt text, `aria-*` where needed, colour contrast ≥ 4.5:1 for body text.
- Mobile first. Test mentally at 375px, 768px, 1280px, 1536px. No horizontal overflow.
- Performance: `priority` on the LCP image only, `sizes` attribute on every `next/image`, no layout shift.
- No lorem ipsum. Real, specific copy that sells. No emoji in UI.
- Run `pnpm lint` and `pnpm typecheck` before you report done. `pnpm build` must pass.
- File ownership is strict (see your task). Do not edit files outside your ownership. If you need a change elsewhere, say so in your final report with the exact diff you want.
- Commit nothing. The orchestrator commits.

## Brand voice
Confident, precise, warm. Short sentences. Specific numbers ("90% of swirls removed", "3-year written warranty") over adjectives. Speak to owners who care about their car and their time.
