"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface SegmentedControlProps<T extends string> {
  legend: string;
  /** Visually hide the legend (it stays available to assistive tech). */
  hideLegend?: boolean;
  options: readonly SegmentedOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** "pill" for short labels in one row; "tile" for longer labels that stack on mobile. */
  variant?: "pill" | "tile";
  className?: string;
  /** Extra classes for the options grid, e.g. "grid-flow-row grid-cols-3" to wrap pills. */
  gridClassName?: string;
}

/** Accessible single-choice control built on native radio inputs. */
export function SegmentedControl<T extends string>({
  legend,
  hideLegend,
  options,
  value,
  onChange,
  variant = "pill",
  className,
  gridClassName,
}: SegmentedControlProps<T>) {
  const name = useId();
  const pill = variant === "pill";

  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend
        className={cn(hideLegend ? "sr-only" : "mb-3 font-display text-sm font-semibold text-ink")}
      >
        {legend}
      </legend>
      <div
        className={cn(
          pill
            ? "grid auto-cols-fr grid-flow-col gap-1 rounded-full border border-border bg-bg p-1"
            : "grid gap-2 sm:grid-cols-3",
          gridClassName,
        )}
      >
        {options.map((option) => (
          <label key={option.value} className="relative block cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "flex h-full flex-col justify-center transition-colors duration-200",
                "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-400",
                pill
                  ? "rounded-full px-2 py-2 text-center text-xs font-semibold text-ink-muted peer-checked:bg-brand-500 peer-checked:text-bg peer-checked:shadow-[0_6px_20px_-8px_var(--color-brand-500)] hover:text-ink sm:text-sm"
                  : "rounded-md border border-border bg-bg px-4 py-3 text-sm text-ink-muted peer-checked:border-brand-500 peer-checked:bg-brand-500/10 peer-checked:text-ink hover:border-border-strong hover:text-ink",
              )}
            >
              <span className="font-display font-semibold">{option.label}</span>
              {option.hint && (
                <span className={cn("mt-0.5 text-xs", pill ? "opacity-80" : "text-ink-subtle")}>
                  {option.hint}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
