/**
 * Regression tests from the booking review (2026-10). Each FAILS until the bug is fixed.
 */
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { submitBooking } from "@/app/book/actions";
import { siteConfig } from "@/config/site";
import { calculateEstimate } from "@/lib/booking/pricing";
import { emptyDraft, stepIndexOf, validateBooking } from "@/lib/booking/schema";
import type { BookingActionSuccess } from "@/lib/booking/types";
import { BookingConfirmation } from "../booking-confirmation";
import { BookingFlow } from "../booking-flow";

vi.mock("@/app/book/actions", () => ({ submitBooking: vi.fn() }));

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");

const complete = {
  ...emptyDraft,
  addOns: [],
  service: "basic-wash",
  size: "car" as const,
  make: "Toyota",
  model: "Camry",
  paintCondition: "excellent" as const,
  interiorCondition: "clean" as const,
  street: "123 Main St",
  city: siteConfig.serviceArea[0],
  zip: siteConfig.address.zip,
  utilitiesConfirmed: true,
  date: "2026-10-14",
  time: "09:00",
  name: "Jordan Reyes",
  email: "jordan@example.com",
  phone: "(760) 555-0123",
};

function success(delivery: BookingActionSuccess["delivery"]): BookingActionSuccess {
  const result = validateBooking(complete, NOW);
  if (!result.success) throw new Error(JSON.stringify(result.fieldErrors));
  return {
    ok: true,
    reference: "PAD-7F3K2Q",
    booking: result.data,
    estimate: calculateEstimate({ serviceSlug: "basic-wash", size: "car" }),
    delivery,
    mailtoHref: delivery === "mailto" ? "mailto:x@example.com" : undefined,
  };
}

describe("booking review regressions", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => vi.useRealTimers());

  // Regression: booking-confirmation.tsx always says "A confirmation email is on its way to
  // <email>", but on static hosting (delivery "mailto" or "endpoint") no email is sent to the
  // customer, and with mailto the request has not even reached the shop until they press Send.
  it("does not promise a confirmation email when the request went out by mailto", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    render(<BookingConfirmation result={success("mailto")} />);
    expect(screen.queryByText(/confirmation email is on its way/)).not.toBeInTheDocument();
  });

  it("does not promise a confirmation email when the request went to a form endpoint", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    render(<BookingConfirmation result={success("endpoint")} />);
    expect(screen.queryByText(/confirmation email is on its way/)).not.toBeInTheDocument();
  });

  // Regression: booking-flow.tsx keeps the last failed useActionState result and renders its
  // message whenever step === LAST_STEP, so after the server sends the visitor back to fix a
  // field, the stale "A few details need another look. We've taken you to the first one."
  // alert is shown again on the Confirm step before they have resubmitted anything.
  it("clears the server's form message once the visitor fixes the field and returns", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    vi.mocked(submitBooking).mockResolvedValueOnce({
      ok: false,
      message: "A few details need another look. We've taken you to the first one.",
      fieldErrors: { date: "That date is too soon." },
    });
    render(<BookingFlow initialDraft={complete} initialStep={stepIndexOf("contact")} />);
    fireEvent.click(screen.getByRole("button", { name: "Request booking" }));

    await screen.findByRole("heading", { level: 2, name: "Choose a time and place" });
    fireEvent.click(screen.getByRole("button", { name: "Thursday, October 15, 2026" }));
    fireEvent.click(await screen.findByRole("radio", { name: "9:00 AM" }));
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await screen.findByRole("heading", { level: 2, name: "Confirm your details" });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  // Regression: the estimate total ignores priceNote/priceSuffix, so for an exotic the
  // summary row reads "$150+" while "Estimated total" (and the mobile footer, emails and
  // confirmation) read a flat "$150"; before a service is chosen the mobile footer shows
  // "Estimate $0".
  it("shows open-ended exotic totals with the same + as the service line", () => {
    render(
      <BookingFlow
        initialDraft={{ ...complete, service: "premium-detail", size: "exotic" }}
        initialStep={stepIndexOf("vehicle")}
      />,
    );
    const summary = screen.getByRole("complementary", { name: "Booking summary" });
    expect(within(summary).getByText("$150+")).toBeInTheDocument();
    expect(within(summary).queryByText("$150")).not.toBeInTheDocument();
  });

  it("does not show a $0 estimate before a service is chosen", () => {
    render(<BookingFlow initialDraft={{ ...emptyDraft, addOns: [] }} />);
    expect(screen.queryAllByText("$0")).toHaveLength(0);
  });
});
