import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-semibold tracking-tight whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-bg hover:bg-brand-400 shadow-[0_0_0_1px_rgba(199,150,240,.4),0_10px_30px_-10px_rgba(199,150,240,.6)] hover:shadow-[0_0_0_1px_rgba(214,168,248,.6),0_14px_34px_-10px_rgba(199,150,240,.7)] hover:-translate-y-px",
  secondary: "bg-ink text-bg hover:bg-white",
  outline:
    "border border-border-strong bg-transparent text-ink hover:border-brand-500 hover:text-brand-300",
  ghost: "bg-transparent text-ink-muted hover:text-ink hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant,
  size,
  className,
  ...props
}: CommonProps & Omit<React.ComponentProps<"button">, "className" | "children">) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  href,
  ...props
}: CommonProps & Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  return <Link href={href} className={buttonClasses(variant, size, className)} {...props} />;
}
