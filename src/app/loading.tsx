import { Container } from "@/components/ui";

/**
 * Route-level loading state: a thin chrome-and-purple sweep pinned to the top
 * of the viewport plus a quiet hero-shaped skeleton, so the footer never jumps
 * up while a page streams in.
 */
export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="min-h-[70vh]">
      <span className="sr-only">Loading page</span>

      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-brand-500/10"
      >
        <div className="h-full w-full animate-shimmer bg-[linear-gradient(90deg,transparent_0%,var(--color-brand-600)_35%,var(--color-ink)_50%,var(--color-brand-600)_65%,transparent_100%)] bg-[length:200%_100%]" />
      </div>

      <Container aria-hidden="true" className="pt-16 pb-24 sm:pt-24">
        <div className="h-3 w-28 animate-pulse rounded-full bg-white/[0.06]" />
        <div className="mt-6 h-10 w-full max-w-xl animate-pulse rounded-md bg-white/[0.05] sm:h-14" />
        <div className="mt-3 h-10 w-2/3 max-w-md animate-pulse rounded-md bg-white/[0.05] sm:h-14" />
        <div className="mt-8 h-4 w-full max-w-lg animate-pulse rounded-full bg-white/[0.04]" />
        <div className="mt-3 h-4 w-5/6 max-w-md animate-pulse rounded-full bg-white/[0.04]" />
      </Container>
    </div>
  );
}
