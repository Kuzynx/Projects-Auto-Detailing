"use client";

import { motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { bookingSteps } from "@/lib/booking/schema";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  current: number;
  /** Furthest step reached; steps up to here can be revisited. */
  reached: number;
  onSelect: (step: number) => void;
}

export function StepIndicator({ current, reached, onSelect }: StepIndicatorProps) {
  const reduceMotion = useReducedMotion();
  const progress = (current + 1) / bookingSteps.length;

  return (
    <nav aria-label="Booking progress">
      <p className="mb-3 flex items-baseline justify-between text-sm text-ink-muted sm:hidden">
        <span>
          Step {current + 1} of {bookingSteps.length}
        </span>
        <span className="font-medium text-ink">{bookingSteps[current].label}</span>
      </p>
      <div className="mb-5 h-1 overflow-hidden rounded-full bg-white/5 sm:hidden" aria-hidden>
        <motion.div
          className="h-full rounded-full bg-brand-500"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ol className="hidden items-center gap-2 sm:flex">
        {bookingSteps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= reached && !active;
          const content = (
            <>
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border font-display text-xs font-semibold transition-colors",
                  active && "border-brand-500 bg-brand-500 text-bg",
                  done && "border-brand-500/60 bg-brand-500/10 text-brand-300",
                  !active && !done && "border-border-strong text-ink-subtle",
                )}
              >
                {done ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  active ? "text-ink" : done ? "text-ink-muted" : "text-ink-subtle",
                )}
              >
                {step.label}
              </span>
              <span className="sr-only">
                {active ? " (current step)" : done ? " (completed)" : ""}
              </span>
            </>
          );
          return (
            <li
              key={step.id}
              className="flex min-w-0 flex-1 items-center gap-2 last:flex-none"
              aria-current={active ? "step" : undefined}
            >
              {reachable ? (
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  className="flex items-center gap-2 rounded-full pr-1 transition-opacity hover:opacity-80"
                >
                  {content}
                </button>
              ) : (
                <span className="flex items-center gap-2 pr-1">{content}</span>
              )}
              {i < bookingSteps.length - 1 && (
                <span
                  aria-hidden
                  className="relative hidden h-px min-w-4 flex-1 overflow-hidden bg-border-strong md:block"
                >
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-brand-500"
                    initial={false}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={
                      reduceMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
                    }
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
