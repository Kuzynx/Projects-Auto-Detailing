import { cn } from "@/lib/utils";

interface SectionProps extends React.ComponentProps<"section"> {
  /** Vertical rhythm. "lg" for hero-adjacent sections. */
  size?: "sm" | "md" | "lg";
  tone?: "default" | "elevated";
}

export function Section({ className, size = "md", tone = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "relative",
        size === "sm" && "py-12 sm:py-16",
        size === "md" && "py-16 sm:py-24",
        size === "lg" && "py-24 sm:py-32",
        tone === "elevated" && "bg-bg-elevated",
        className,
      )}
      {...props}
    />
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <Tag className="text-3xl font-semibold text-balance sm:text-4xl lg:text-5xl">{title}</Tag>
      {description && (
        <p className="mt-4 text-base text-pretty text-ink-muted sm:text-lg">{description}</p>
      )}
    </div>
  );
}

export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase",
        "before:h-px before:w-6 before:bg-brand-500",
        className,
      )}
      {...props}
    />
  );
}
