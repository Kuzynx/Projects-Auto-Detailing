import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface shadow-card transition-colors hover:border-border-strong",
        className,
      )}
      {...props}
    />
  );
}
