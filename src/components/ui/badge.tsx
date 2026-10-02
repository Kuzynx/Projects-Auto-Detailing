import { cn } from "@/lib/utils";

type Tone = "brand" | "neutral" | "success";

const tones: Record<Tone, string> = {
  brand: "border-brand-500/40 bg-brand-500/10 text-brand-300",
  neutral: "border-border-strong bg-white/5 text-ink-muted",
  success: "border-success/40 bg-success/10 text-success",
};

export function Badge({
  tone = "brand",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-display text-[11px] font-semibold tracking-wider uppercase",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
