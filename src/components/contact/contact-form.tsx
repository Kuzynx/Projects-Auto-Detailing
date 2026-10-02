"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { z } from "zod";
import { ArrowRight, ChevronDown, CircleCheck, LoaderCircle, Phone } from "lucide-react";
import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  CONTACT_LIMITS,
  HONEYPOT_FIELD,
  contactFields,
  contactSchema,
  contactTopics,
  initialContactState,
  readContactFormData,
  type ContactField,
  type ContactFormState,
} from "@/lib/contact/schema";

type FieldErrors = Partial<Record<ContactField, string[]>>;

const inputClasses =
  "block w-full rounded-md border border-border-strong bg-bg px-4 text-base text-ink placeholder:text-ink-subtle transition-colors hover:border-white/25 focus:border-brand-500 aria-[invalid=true]:border-danger/70 sm:text-sm";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    async (previous, formData) => {
      try {
        return await submitContact(previous, formData);
      } catch {
        // Offline, flaky mobile data or a redeploy that rotated action IDs: keep the visitor's
        // message on screen instead of letting the route error boundary replace the page.
        return {
          status: "error",
          message: `We couldn't reach our server. Check your connection and try again, or call ${siteConfig.phone}.`,
          values: readContactFormData(formData),
        };
      }
    },
    initialContactState,
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [syncedState, setSyncedState] = useState(state);
  const [dismissedAt, setDismissedAt] = useState<number | undefined>(undefined);
  const [messageLength, setMessageLength] = useState(0);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  // Adopt server-side field errors whenever a new action result arrives.
  if (state !== syncedState) {
    setSyncedState(state);
    setErrors(state.fieldErrors ?? {});
    if (state.status === "success") setMessageLength(0);
  }

  const showSuccess = state.status === "success" && state.submittedAt !== dismissedAt;

  async function copyMessage() {
    if (!state.smsBody) return;
    try {
      await navigator.clipboard.writeText(state.smsBody);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      // Clipboard can be blocked; the "open the text here" link and phone number still work.
    }
  }

  useEffect(() => {
    if (state.status === "success") {
      successRef.current?.focus();
    } else if (state.status === "error" && state.fieldErrors) {
      focusFirstInvalid(formRef.current, state.fieldErrors);
    }
  }, [state]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const result = contactSchema.safeParse(readContactFormData(new FormData(event.currentTarget)));
    // With JS we always dispatch manually. React's automatic reset after a form action would
    // clear what the visitor typed (and snap the topic <select> back to its first option) when
    // the server returns an error. Without JS the `action` attribute still posts natively.
    event.preventDefault();
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors as FieldErrors;
      setErrors(fieldErrors);
      focusFirstInvalid(event.currentTarget, fieldErrors);
      return;
    }
    setErrors({});
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  function clearError(field: ContactField) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const ids = (field: ContactField) => ({
    input: `${uid}-${field}`,
    error: `${uid}-${field}-error`,
    hint: `${uid}-${field}-hint`,
  });

  const fieldProps = (field: ContactField, hint = false) => {
    const error = errors[field]?.[0];
    const describedBy = [hint && ids(field).hint, error && ids(field).error]
      .filter(Boolean)
      .join(" ");
    return {
      id: ids(field).input,
      name: field,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": describedBy || undefined,
      defaultValue: state.status === "error" ? state.values?.[field] : undefined,
      onChange: () => clearError(field),
    };
  };

  const awaitingSend = state.delivery === "sms";
  // A texted message reaches us from the visitor's own number, so we reply the same way.
  const replyBy = awaitingSend ? "text you back" : "reply by email";

  if (showSuccess) {
    return (
      <div
        role="status"
        className="flex flex-col items-start rounded-lg border border-success/30 bg-success/5 p-8 sm:p-10"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheck className="size-6" aria-hidden />
        </span>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-6 text-2xl font-semibold focus:outline-none"
        >
          {awaitingSend ? "Almost done: press Send" : "Message received. Thank you."}
        </h3>
        {awaitingSend && (
          <p className="mt-3 text-pretty text-ink-muted">
            Your messaging app opened with this message filled in, addressed to {siteConfig.phone}.
            It isn&apos;t sent until you press Send there.
            {state.smsHref && (
              <>
                {" "}
                If nothing opened,{" "}
                <a
                  href={state.smsHref}
                  className="font-semibold text-brand-300 underline-offset-4 hover:underline"
                >
                  open the text here
                </a>
                {state.smsBody && (
                  <>
                    {" "}
                    or{" "}
                    <button
                      type="button"
                      onClick={copyMessage}
                      className="font-semibold text-brand-300 underline-offset-4 hover:underline"
                    >
                      {copiedMessage ? "copied" : "copy it"}
                    </button>{" "}
                    and text it from your phone
                  </>
                )}
                .
              </>
            )}
          </p>
        )}
        <p className="mt-3 text-pretty text-ink-muted">
          {awaitingSend ? "Once it arrives, " : ""}
          {siteConfig.team[0]
            ? `${siteConfig.team[0].name}, who handles booking and messages, will ${replyBy}, and anything about your car goes straight to ${siteConfig.founder.name}.`
            : `${siteConfig.founder.name} will read it and ${replyBy}.`}{" "}
          We reply fast, usually the same day. Anything sent after hours is answered the next
          business day.
        </p>
        <p className="mt-3 text-pretty text-ink-muted">
          Need us sooner?{" "}
          <a
            href={siteConfig.phoneHref}
            className="font-semibold text-brand-300 underline-offset-4 hover:underline"
          >
            Call {siteConfig.phone}
          </a>
          .
        </p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => setDismissedAt(state.submittedAt)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const formError = state.status === "error" ? state.message : undefined;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
      aria-describedby={`${uid}-required-note`}
    >
      <p id={`${uid}-required-note`} className="text-sm text-ink-subtle">
        Fields marked <span className="text-brand-300">*</span> are required.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          required
          htmlFor={ids("name").input}
          error={errors.name?.[0]}
          errorId={ids("name").error}
        >
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name}
            className={cn(inputClasses, "h-12")}
          />
        </Field>
        <Field
          label="Email"
          required
          htmlFor={ids("email").input}
          error={errors.email?.[0]}
          errorId={ids("email").error}
        >
          <input
            {...fieldProps("email")}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email}
            className={cn(inputClasses, "h-12")}
          />
        </Field>
        <Field
          label="Phone"
          optional
          htmlFor={ids("phone").input}
          error={errors.phone?.[0]}
          errorId={ids("phone").error}
        >
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone}
            placeholder="(760) 555-0100"
            className={cn(inputClasses, "h-12")}
          />
        </Field>
        <Field
          label="Topic"
          required
          htmlFor={ids("topic").input}
          error={errors.topic?.[0]}
          errorId={ids("topic").error}
        >
          <div className="relative">
            <select
              {...fieldProps("topic")}
              defaultValue="quote"
              required
              className={cn(inputClasses, "h-12 cursor-pointer appearance-none pr-10")}
            >
              {contactTopics.map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
              aria-hidden
            />
          </div>
        </Field>
      </div>

      <Field
        label="Vehicle"
        optional
        htmlFor={ids("vehicle").input}
        error={errors.vehicle?.[0]}
        errorId={ids("vehicle").error}
        hint="Year, make, model and color help us quote accurately."
        hintId={ids("vehicle").hint}
      >
        <input
          {...fieldProps("vehicle", true)}
          type="text"
          maxLength={CONTACT_LIMITS.vehicle}
          placeholder="2021 Tesla Model 3, black"
          className={cn(inputClasses, "h-12")}
        />
      </Field>

      <Field
        label="Message"
        required
        htmlFor={ids("message").input}
        error={errors.message?.[0]}
        errorId={ids("message").error}
        hint={`${messageLength} / ${CONTACT_LIMITS.message}`}
        hintId={ids("message").hint}
        hintAlign="right"
      >
        <textarea
          {...fieldProps("message")}
          onChange={(event) => {
            clearError("message");
            setMessageLength(event.target.value.length);
          }}
          required
          rows={6}
          maxLength={CONTACT_LIMITS.message}
          placeholder="What would you like done, and where is the car usually parked?"
          className={cn(inputClasses, "min-h-36 resize-y py-3")}
        />
      </Field>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-${HONEYPOT_FIELD}`}>Leave this field empty</label>
        <input
          id={`${uid}-${HONEYPOT_FIELD}`}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? (
            <>
              <LoaderCircle className="size-5 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="size-5" aria-hidden />
            </>
          )}
        </Button>
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          <Phone className="size-4 text-brand-400" aria-hidden />
          We reply fast, usually the same day
        </p>
      </div>
    </form>
  );
}

function focusFirstInvalid(form: HTMLFormElement | null, fieldErrors: FieldErrors) {
  const first = contactFields.find((field) => fieldErrors[field]?.length);
  if (!form || !first) return;
  const element = form.elements.namedItem(first);
  if (element instanceof HTMLElement) element.focus();
}

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  errorId: string;
  hint?: string;
  hintId?: string;
  hintAlign?: "left" | "right";
  children: React.ReactNode;
}

function Field({
  label,
  htmlFor,
  required,
  optional,
  error,
  errorId,
  hint,
  hintId,
  hintAlign = "left",
  children,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-baseline gap-1.5 font-display text-sm font-medium text-ink"
      >
        {label}
        {required && (
          <span className="text-brand-300" aria-hidden>
            *
          </span>
        )}
        {optional && <span className="text-xs font-normal text-ink-subtle">(optional)</span>}
      </label>
      {children}
      <div
        className={cn(
          "mt-1.5 flex gap-3",
          hintAlign === "right" ? "justify-between" : "flex-col gap-1",
        )}
      >
        {error ? (
          <p id={errorId} className="text-sm text-danger">
            {error}
          </p>
        ) : (
          hintAlign === "right" && <span />
        )}
        {hint && (
          <p
            id={hintId}
            className={cn("text-xs text-ink-subtle", hintAlign === "right" && "tabular-nums")}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
