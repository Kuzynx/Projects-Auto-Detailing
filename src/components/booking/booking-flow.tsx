"use client";

import { startTransition, useActionState, useEffect, useReducer, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { submitBooking } from "@/app/book/actions";
import { siteConfig } from "@/config/site";
import { calculateEstimate } from "@/lib/booking/pricing";
import {
  bookingSteps,
  firstStepWithErrors,
  isStudioOnly,
  validateAllSteps,
  validateStep,
  type BookingDraft,
  type BookingField,
  type FieldErrors,
} from "@/lib/booking/schema";
import { getTimeSlots } from "@/lib/booking/slots";
import { BOOKING_FORM_FIELDS, type BookingActionState } from "@/lib/booking/types";
import { Button } from "@/components/ui";
import { cn, formatPrice } from "@/lib/utils";
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

const stepCopy: Record<
  (typeof bookingSteps)[number]["id"],
  { title: string; description: string }
> = {
  service: {
    title: "Choose your service",
    description:
      "Pick the package that fits. Every price below is a published starting price, not a teaser.",
  },
  vehicle: {
    title: "Tell us about your vehicle",
    description:
      "Size sets the price. Make, model and condition help us bring the right products and plan your time.",
  },
  addons: {
    title: "Add finishing touches",
    description: "Flat-priced upgrades done in the same visit. Skip this step if you're set.",
  },
  schedule: {
    title: "Choose a time and place",
    description: "We come to you anywhere in our service area, or you can drop off at the studio.",
  },
  contact: {
    title: "Confirm your details",
    description: "We hold your slot now and confirm within the hour. Nothing to pay online.",
  },
};

function headingId(step: number) {
  return `bk-step-${bookingSteps[step].id}-heading`;
}

/** Element id of the first field (in form order) that has an error on a step. */
function firstErrorTarget(step: number, errors: FieldErrors): string {
  const field = bookingSteps[step].fields.find((f) => errors[f as BookingField]);
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
}

type FlowAction =
  | { type: "update"; patch: Partial<BookingDraft> }
  | { type: "go"; step: number; errors?: FieldErrors; focusTarget?: string }
  | { type: "invalid"; errors: FieldErrors };

/** Keeps dependent fields consistent after any edit. */
function reconcile(draft: BookingDraft): BookingDraft {
  let next = draft;
  if (isStudioOnly(next.service) && next.locationType !== "studio")
    next = { ...next, locationType: "studio" };
  if (next.date) {
    const slots = getTimeSlots({
      date: next.date,
      serviceSlug: next.service,
      size: next.size,
      addOnSlugs: next.addOns,
    });
    if (next.time && !slots.some((slot) => slot.value === next.time)) next = { ...next, time: "" };
    // A single drop-off or full-day slot is the only choice, so pick it.
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
      return { ...state, draft, errors };
    }
    case "go": {
      const step = Math.max(0, Math.min(LAST_STEP, action.step));
      return {
        ...state,
        step,
        reached: Math.max(state.reached, step),
        direction: step >= state.step ? 1 : -1,
        errors: action.errors ?? {},
        focus: {
          target: action.focusTarget ?? headingId(step),
          nonce: (state.focus?.nonce ?? 0) + 1,
        },
      };
    }
    case "invalid":
      return {
        ...state,
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
  }));
  const { step, draft, errors } = state;

  const startedAt = useRef(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    startedAt.current = Date.now();
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
      if (response && !response.ok && response.fieldErrors) {
        const target = firstStepWithErrors(response.fieldErrors);
        if (target !== -1) {
          dispatch({
            type: "go",
            step: target,
            errors: response.fieldErrors,
            focusTarget: firstErrorTarget(target, response.fieldErrors),
          });
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
    formData.set(BOOKING_FORM_FIELDS.startedAt, String(startedAt.current));
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
  const formMessage = result && !result.ok ? result.message : undefined;
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

          {formMessage && step === LAST_STEP && (
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
              <p className="text-right text-xs text-ink-subtle lg:hidden">
                Estimate
                <span className="block font-display text-base font-semibold text-ink tabular-nums">
                  {formatPrice(estimate.total)}
                </span>
              </p>
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
