"use client";

import { startTransition, useActionState, useEffect, useReducer, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { submitBooking } from "@/app/book/actions";
import { siteConfig } from "@/config/site";
import { bookingContactName } from "@/lib/booking/format";
import { calculateEstimate, formatEstimateTotal } from "@/lib/booking/pricing";
import {
  bookingSteps,
  firstStepWithErrors,
  isMotorcycle,
  validateAllSteps,
  validateStep,
  type BookingDraft,
  type BookingStepId,
  type BookingField,
  type FieldErrors,
} from "@/lib/booking/schema";
import { getTimeSlots } from "@/lib/booking/slots";
import { BOOKING_FORM_FIELDS, type BookingActionState } from "@/lib/booking/types";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AddOnsStep } from "./addons-step";
import { BookingConfirmation } from "./booking-confirmation";
import { BookingSummary } from "./booking-summary";
import { ContactStep } from "./contact-step";
import { fieldId } from "./fields";
import { ScheduleStep } from "./schedule-step";
import { ServiceStep } from "./service-step";
import { StepIndicator } from "./step-indicator";
import type { StepProps } from "./step-types";
import { VehicleStep } from "./vehicle-step";

const LAST_STEP = bookingSteps.length - 1;

const stepCopy: Record<BookingStepId, { title: string; description: string }> = {
  service: {
    title: "Choose your service",
    description:
      "Pick the package that fits. Every price below is a published starting price, not a teaser.",
  },
  vehicle: {
    title: "Tell us about your vehicle",
    description:
      "Vehicle type sets the price. Make, model and condition help us bring the right products and plan the time.",
  },
  addons: {
    title: "Add finishing touches",
    description: "Flat-priced upgrades done in the same visit. Skip this step if you're set.",
  },
  schedule: {
    title: "Choose a time and place",
    description: "Every appointment is mobile. Tell us where the car will be and pick a time.",
  },
  contact: {
    title: "Confirm your details",
    description: `Your slot is held now and ${bookingContactName} confirms by text within the hour. Nothing to pay online.`,
  },
};

function headingId(step: number) {
  return `bk-step-${bookingSteps[step].id}-heading`;
}

/** Element id of the first field (in form order) that has an error on a step. */
function firstErrorTarget(step: number, errors: FieldErrors): string {
  const field = bookingSteps[step].fields.find((f) => errors[f]);
  return field ? fieldId(field) : headingId(step);
}

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

interface FlowState {
  step: number;
  /** Furthest step reached, for the clickable progress indicator. */
  reached: number;
  direction: 1 | -1;
  draft: BookingDraft;
  errors: FieldErrors;
  /** Element to focus after the next render of the active step. */
  focus: { target: string; nonce: number } | null;
  /**
   * Form-level message from the last submission. Kept here, not read from the action
   * result, so it clears as soon as the visitor edits anything or changes step.
   */
  formMessage: string | null;
}

type FlowAction =
  | { type: "update"; patch: Partial<BookingDraft> }
  | {
      type: "go";
      step: number;
      errors?: FieldErrors;
      focusTarget?: string;
      formMessage?: string | null;
    }
  | { type: "invalid"; errors: FieldErrors }
  | { type: "message"; formMessage: string | null };

/** Keeps dependent fields consistent after any edit. */
function reconcile(draft: BookingDraft): BookingDraft {
  let next = draft;
  // Motorcycles have no cabin, so interior answers don't apply.
  if (isMotorcycle(next.size) && (next.interiorCondition || next.petHair || next.smoke)) {
    next = { ...next, interiorCondition: "", petHair: false, smoke: false };
  }
  if (next.date) {
    const slots = getTimeSlots({
      date: next.date,
      serviceSlug: next.service,
      size: next.size,
      addOnSlugs: next.addOns,
    });
    if (next.time && !slots.some((slot) => slot.value === next.time)) next = { ...next, time: "" };
    // A single arrival or full-day slot is the only choice, so pick it.
    if (!next.time && slots.length === 1 && slots[0].kind !== "start")
      next = { ...next, time: slots[0].value };
  }
  return next;
}

function reducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "update": {
      const draft = reconcile({ ...state.draft, ...action.patch });
      const errors = { ...state.errors };
      for (const key of Object.keys(draft) as BookingField[]) {
        if (key in action.patch || draft[key] !== state.draft[key]) delete errors[key];
      }
      return { ...state, draft, errors, formMessage: null };
    }
    case "go": {
      const step = Math.max(0, Math.min(LAST_STEP, action.step));
      return {
        ...state,
        step,
        reached: Math.max(state.reached, step),
        direction: step >= state.step ? 1 : -1,
        errors: action.errors ?? {},
        formMessage: action.formMessage ?? null,
        focus: {
          target: action.focusTarget ?? headingId(step),
          nonce: (state.focus?.nonce ?? 0) + 1,
        },
      };
    }
    case "message":
      return { ...state, formMessage: action.formMessage };
    case "invalid":
      return {
        ...state,
        formMessage: null,
        errors: action.errors,
        focus: {
          target: firstErrorTarget(state.step, action.errors),
          nonce: (state.focus?.nonce ?? 0) + 1,
        },
      };
  }
}

/* ------------------------------------------------------------------ */
/* Focus                                                               */
/* ------------------------------------------------------------------ */

function focusElement(id: string, fallbackId: string, smooth: boolean) {
  const el = document.getElementById(id) ?? document.getElementById(fallbackId);
  if (!el) return;
  el.focus({ preventScroll: true });
  const rect = el.getBoundingClientRect();
  if (rect.top < 96 || rect.bottom > window.innerHeight - 24) {
    el.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
  }
}

/** Wraps the active step; applies pending focus once its DOM exists. */
function StepFrame({
  step,
  focus,
  children,
}: {
  step: number;
  focus: FlowState["focus"];
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const target = focus?.target;
  const nonce = focus?.nonce;
  useEffect(() => {
    if (target) focusElement(target, headingId(step), !reduceMotion);
  }, [target, nonce, step, reduceMotion]);

  const copy = stepCopy[bookingSteps[step].id];
  return (
    <div>
      <h2
        id={headingId(step)}
        tabIndex={-1}
        className="scroll-mt-32 text-2xl font-semibold text-ink outline-none sm:text-3xl"
      >
        {copy.title}
      </h2>
      <p className="mt-2 mb-8 max-w-xl text-pretty text-ink-muted">{copy.description}</p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Flow                                                                */
/* ------------------------------------------------------------------ */

export interface BookingFlowProps {
  initialDraft: BookingDraft;
  /** Opens on the vehicle step when a service was pre-selected by URL. */
  initialStep?: number;
}

export function BookingFlow({ initialDraft, initialStep = 0 }: BookingFlowProps) {
  const reduceMotion = useReducedMotion();
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    step: initialStep,
    reached: initialStep,
    direction: 1 as const,
    draft: reconcile(initialDraft),
    errors: {},
    focus: null,
    formMessage: null,
  }));
  const { step, draft, errors } = state;

  // Fill time is measured with the monotonic performance clock, not Date.now(), so a
  // device clock that disagrees with the server can't make a real booking look automated.
  const startedAt = useRef<number | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    startedAt.current = performance.now();
  }, []);

  const [result, submitAction, pending] = useActionState<BookingActionState, FormData>(
    async (previous, formData) => {
      let response: BookingActionState;
      try {
        response = await submitBooking(previous, formData);
      } catch {
        response = {
          ok: false,
          message: `We couldn't reach our booking system. Check your connection and try again, or call ${siteConfig.phone}.`,
        };
      }
      if (response && !response.ok) {
        const target = response.fieldErrors ? firstStepWithErrors(response.fieldErrors) : -1;
        if (response.fieldErrors && target !== -1) {
          dispatch({
            type: "go",
            step: target,
            errors: response.fieldErrors,
            focusTarget: firstErrorTarget(target, response.fieldErrors),
            formMessage: response.message ?? null,
          });
        } else {
          dispatch({ type: "message", formMessage: response.message ?? null });
        }
      }
      return response;
    },
    null,
  );

  if (result?.ok) return <BookingConfirmation result={result} />;

  const update = (patch: Partial<BookingDraft>) => dispatch({ type: "update", patch });
  const goTo = (target: number) => dispatch({ type: "go", step: target });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const now = new Date();

    if (step < LAST_STEP) {
      const stepErrors = validateStep(bookingSteps[step].id, draft, now);
      if (Object.keys(stepErrors).length > 0) dispatch({ type: "invalid", errors: stepErrors });
      else goTo(step + 1);
      return;
    }

    const allErrors = validateAllSteps(draft, now);
    const errorStep = firstStepWithErrors(allErrors);
    if (errorStep !== -1) {
      if (errorStep === step) dispatch({ type: "invalid", errors: allErrors });
      else
        dispatch({
          type: "go",
          step: errorStep,
          errors: allErrors,
          focusTarget: firstErrorTarget(errorStep, allErrors),
        });
      return;
    }

    const formData = new FormData();
    formData.set(BOOKING_FORM_FIELDS.payload, JSON.stringify(draft));
    const elapsed = startedAt.current === null ? 0 : performance.now() - startedAt.current;
    formData.set(BOOKING_FORM_FIELDS.elapsedMs, String(Math.round(elapsed)));
    formData.set(BOOKING_FORM_FIELDS.honeypot, honeypotRef.current?.value ?? "");
    startTransition(() => submitAction(formData));
  }

  const stepProps: StepProps = { draft, errors, update };
  const stepId = bookingSteps[step].id;
  const estimate = calculateEstimate({
    serviceSlug: draft.service,
    size: draft.size,
    addOnSlugs: draft.addOns,
  });
  const { formMessage } = state;
  const totalLabel = formatEstimateTotal(estimate);
  const offset = reduceMotion ? 0 : 28;
  const variants: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * offset }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -offset }),
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-14">
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-labelledby={headingId(step)}
        aria-busy={pending}
        className="min-w-0"
      >
        <StepIndicator current={step} reached={state.reached} onSelect={goTo} />

        <div className="mt-6 rounded-xl border border-border bg-surface/50 p-5 shadow-card max-lg:pb-0 sm:p-8">
          <AnimatePresence mode="wait" initial={false} custom={state.direction}>
            <motion.div
              key={stepId}
              custom={state.direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <StepFrame step={step} focus={state.focus}>
                {stepId === "service" && <ServiceStep {...stepProps} />}
                {stepId === "vehicle" && <VehicleStep {...stepProps} />}
                {stepId === "addons" && <AddOnsStep {...stepProps} />}
                {stepId === "schedule" && <ScheduleStep {...stepProps} />}
                {stepId === "contact" && <ContactStep {...stepProps} onEdit={goTo} />}
              </StepFrame>
            </motion.div>
          </AnimatePresence>

          {/* Honeypot: invisible to people, tempting to bots. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden"
          >
            <label htmlFor="bk-company-website">Company website</label>
            <input
              ref={honeypotRef}
              id="bk-company-website"
              name={BOOKING_FORM_FIELDS.honeypot}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          {formMessage && (
            <p
              role="alert"
              className="mt-8 flex items-start gap-2 rounded-md border border-danger/40 bg-danger/10 p-4 text-sm text-ink"
            >
              <AlertCircle aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
              {formMessage}
            </p>
          )}

          {/* Sticks to the bottom of the viewport on small screens so Continue is always in reach. */}
          <div className="sticky bottom-0 z-10 -mx-5 mt-10 flex items-center gap-3 border-t border-border bg-surface/90 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-md max-lg:rounded-b-xl sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-6 lg:pb-0 lg:backdrop-blur-none">
            {step > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => goTo(step - 1)}
                disabled={pending}
                className="-ml-3 px-3 sm:px-4"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Back
              </Button>
            )}
            <div className="ml-auto flex items-center gap-4">
              {totalLabel && (
                <p className="text-right text-xs text-ink-subtle lg:hidden">
                  Estimate
                  <span className="block font-display text-base font-semibold text-ink tabular-nums">
                    {totalLabel}
                  </span>
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                disabled={pending}
                className={cn("min-w-36", pending && "cursor-progress")}
              >
                {step < LAST_STEP ? (
                  <>
                    {stepId === "addons" && draft.addOns.length === 0 ? "Skip add-ons" : "Continue"}
                    <ArrowRight aria-hidden className="size-4" />
                  </>
                ) : pending ? (
                  <>
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                    Sending request
                  </>
                ) : (
                  "Request booking"
                )}
              </Button>
            </div>
          </div>
          <p aria-live="polite" className="sr-only">
            {pending ? "Sending your booking request." : ""}
          </p>
        </div>
      </form>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <BookingSummary draft={draft} />
      </div>
    </div>
  );
}
