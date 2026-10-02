import { cn } from "@/lib/utils";

/** Monogram avatar. We show initials rather than stock faces. */
export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-500/40 bg-gradient-to-br from-brand-700/60 via-surface to-bg font-display text-xl font-semibold tracking-wide text-ink shadow-glow",
        className,
      )}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.18),transparent_55%)]" />
      <span className="relative">{initials}</span>
    </span>
  );
}
