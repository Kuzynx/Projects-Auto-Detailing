"use client";

import { AlertCircle, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Element id for a booking field. Focus management relies on this. */
export function fieldId(name: string) {
  return `bk-${name}`;
}

export function errorId(name: string) {
  return `bk-${name}-error`;
}

export function hintId(name: string) {
  return `bk-${name}-hint`;
}

/** aria wiring for an input: invalid state plus hint and error descriptions. */
export function describedBy(name: string, { hint, error }: { hint?: boolean; error?: string }) {
  const ids = [hint && hintId(name), error && errorId(name)].filter(Boolean).join(" ");
  return {
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": ids || undefined,
  };
}

export function FieldError({ name, message }: { name: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={errorId(name)} className="mt-2 flex items-start gap-1.5 text-sm text-danger">
      <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </p>
  );
}

export function FieldHint({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <p id={hintId(name)} className="mt-2 text-sm text-ink-subtle">
      {children}
    </p>
  );
}

const controlBase =
  "block w-full rounded-md border border-border-strong bg-bg-elevated px-4 text-base text-ink placeholder:text-ink-subtle transition-colors outline-none hover:border-white/25 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30 aria-invalid:border-danger/70 aria-invalid:focus-visible:ring-danger/25 sm:text-sm";

export function Label({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 flex items-baseline justify-between gap-2 text-sm font-medium text-ink"
    >
      <span>{children}</span>
      {optional && <span className="text-xs font-normal text-ink-subtle">Optional</span>}
    </label>
  );
}

interface TextFieldProps extends Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "id" | "name"
> {
  name: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
}

export function TextField({
  name,
  label,
  value,
  onValueChange,
  error,
  hint,
  optional,
  className,
  ...rest
}: TextFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={fieldId(name)} optional={optional}>
        {label}
      </Label>
      <input
        id={fieldId(name)}
        name={name}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        required={!optional}
        className={cn(controlBase, "h-12")}
        {...describedBy(name, { hint: Boolean(hint), error })}
        {...rest}
      />
      {hint && <FieldHint name={name}>{hint}</FieldHint>}
      <FieldError name={name} message={error} />
    </div>
  );
}

interface TextAreaFieldProps extends Omit<
  React.ComponentProps<"textarea">,
  "onChange" | "value" | "id" | "name"
> {
  name: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
}

export function TextAreaField({
  name,
  label,
  value,
  onValueChange,
  error,
  hint,
  optional,
  className,
  ...rest
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={fieldId(name)} optional={optional}>
        {label}
      </Label>
      <textarea
        id={fieldId(name)}
        name={name}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cn(controlBase, "min-h-28 resize-y py-3")}
        {...describedBy(name, { hint: Boolean(hint), error })}
        {...rest}
      />
      {hint && <FieldHint name={name}>{hint}</FieldHint>}
      <FieldError name={name} message={error} />
    </div>
  );
}

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  hint?: React.ReactNode;
  optional?: boolean;
  autoComplete?: string;
  className?: string;
}

export function SelectField({
  name,
  label,
  value,
  onValueChange,
  options,
  placeholder,
  error,
  hint,
  optional,
  autoComplete,
  className,
}: SelectFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={fieldId(name)} optional={optional}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={fieldId(name)}
          name={name}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          required={!optional}
          autoComplete={autoComplete}
          className={cn(
            controlBase,
            "h-12 cursor-pointer appearance-none pr-10",
            !value && "text-ink-subtle",
          )}
          {...describedBy(name, { hint: Boolean(hint), error })}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-bg-elevated text-ink">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-subtle"
        />
      </div>
      {hint && <FieldHint name={name}>{hint}</FieldHint>}
      <FieldError name={name} message={error} />
    </div>
  );
}

interface CheckboxFieldProps {
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  className?: string;
}

/** Checkbox with a custom box. The native input stays in the DOM for a11y. */
export function CheckboxField({
  name,
  checked,
  onCheckedChange,
  label,
  description,
  error,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={fieldId(name)}
        className="group flex cursor-pointer items-start gap-3 rounded-md border border-border bg-bg-elevated/60 p-4 transition-colors hover:border-border-strong has-checked:border-brand-500/60 has-checked:bg-brand-500/[0.06] has-focus-visible:ring-2 has-focus-visible:ring-brand-500/40"
      >
        <input
          type="checkbox"
          id={fieldId(name)}
          name={name}
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          // Name comes from the label text only; the description is announced separately.
          aria-labelledby={`${fieldId(name)}-label`}
          className="peer sr-only"
          {...describedBy(name, { hint: Boolean(description), error })}
        />
        <span
          aria-hidden
          className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-[5px] border border-border-strong bg-bg transition-colors peer-checked:border-brand-500 peer-checked:bg-brand-500 [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
        >
          <Check className="size-3.5 text-bg" strokeWidth={3} />
        </span>
        <span className="min-w-0">
          <span id={`${fieldId(name)}-label`} className="block text-sm font-medium text-ink">
            {label}
          </span>
          {description && (
            <span id={hintId(name)} className="mt-1 block text-sm text-ink-muted">
              {description}
            </span>
          )}
        </span>
      </label>
      <FieldError name={name} message={error} />
    </div>
  );
}
