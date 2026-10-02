"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * A selectable card backed by a native radio or checkbox, so arrow keys,
 * Space and screen readers behave exactly as they do for plain inputs.
 */
export function OptionCard({
  type,
  name,
  value,
  checked,
  onChange,
  disabled,
  id,
  invalid,
  describedBy,
  className,
  children,
}: OptionCardProps) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer rounded-lg border bg-bg-elevated p-4 transition-all duration-200 sm:p-5",
        "hover:border-border-strong hover:bg-surface",
        "has-focus-visible:ring-2 has-focus-visible:ring-brand-400 has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-bg",
        checked
          ? "border-brand-500/70 bg-brand-500/[0.07] shadow-glow hover:border-brand-500/70 hover:bg-brand-500/[0.07]"
          : "border-border",
        invalid && !checked && "border-danger/50",
        disabled && "cursor-not-allowed opacity-50 hover:border-border hover:bg-bg-elevated",
        className,
      )}
    >
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        // aria-invalid is not valid on radios; the group's description carries the error.
        aria-invalid={type === "checkbox" && invalid ? true : undefined}
        aria-describedby={describedBy}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "absolute top-4 right-4 grid size-5 place-items-center border transition-colors sm:top-5 sm:right-5",
          type === "radio" ? "rounded-full" : "rounded-[5px]",
          checked
            ? "border-brand-500 bg-brand-500 text-bg"
            : "border-border-strong bg-bg text-transparent",
        )}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className="block min-w-0 flex-1 pr-8">{children}</span>
    </label>
  );
}
