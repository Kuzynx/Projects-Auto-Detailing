import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { submitBooking } from "@/app/book/actions";
import { siteConfig } from "@/config/site";
import { calculateEstimate } from "@/lib/booking/pricing";
import { emptyDraft, stepIndexOf, validateBooking } from "@/lib/booking/schema";
import type { BookingActionState } from "@/lib/booking/types";
import { BookingFlow } from "../booking-flow";

// Fixture catalog with no add-ons, mirroring the live catalog's shape.
vi.mock("@/data/services", async (importOriginal) =>
  (await import("@/lib/booking/__tests__/fixtures/catalog")).withFixtureCatalog(
    await importOriginal<object>(),
    { addOns: [] },
  ),
);

// The real action imports server-only code. This stand-in validates like the server would.
vi.mock("@/app/book/actions", () => ({
  submitBooking: vi.fn(
    async (_prev: BookingActionState, formData: FormData): Promise<BookingActionState> => {
      const result = validateBooking(JSON.parse(String(formData.get("payload"))), new Date());
      if (!result.success) return { ok: false, fieldErrors: result.fieldErrors };
      const booking = result.data;
      const estimate = calculateEstimate({
        serviceSlug: booking.service,
        size: booking.size,
        addOnSlugs: booking.addOns,
      });
      return { ok: true, reference: "PAD-7F3K2Q", booking, estimate };
    },
  ),
}));

// Wednesday 7 Oct 2026, 10:00 AM local (PDT).
const NOW = new Date("2026-10-07T17:00:00Z");
const blank = () => ({ ...emptyDraft, addOns: [] });
const UTILITIES_LABEL =
  "There's an outdoor water spigot and a power outlet within reach of where the car will be parked";
const continueButton = () => screen.getByRole("button", { name: /continue/i });

describe("BookingFlow", () => {
  beforeAll(() => {
    // jsdom does not implement scrolling.
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("blocks Continue until a service is chosen and moves focus to the error", async () => {
    render(<BookingFlow initialDraft={blank()} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Choose your service" }),
    ).toBeInTheDocument();

    fireEvent.click(continueButton());
    expect(await screen.findByText("Choose a service to continue.")).toBeInTheDocument();
    const group = screen.getByRole("radiogroup", { name: "Service" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    await waitFor(() =>
      expect(document.activeElement).toBe(within(group).getAllByRole("radio")[0]),
    );
  });

  it("shows four steps when no add-ons are offered", () => {
    render(<BookingFlow initialDraft={blank()} />);
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument();
    const progress = screen.getByRole("navigation", { name: "Booking progress" });
    expect(within(progress).queryByText("Add-ons")).not.toBeInTheDocument();
  });

  it("advances to the vehicle step and prices by vehicle type", async () => {
    render(<BookingFlow initialDraft={blank()} />);
    fireEvent.click(screen.getByRole("radio", { name: /Fixture Full/ }));
    const summary = screen.getByRole("complementary", { name: "Booking summary" });
    expect(within(summary).getAllByText("$120").length).toBeGreaterThan(0);

    fireEvent.click(continueButton());
    const heading = await screen.findByRole("heading", {
      level: 2,
      name: "Tell us about your vehicle",
    });
    await waitFor(() => expect(document.activeElement).toBe(heading));

    expect(screen.getAllByRole("radio")).toHaveLength(6);
    fireEvent.click(screen.getByRole("radio", { name: /^SUV/ }));
    expect(within(summary).getAllByText("$150").length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("radio", { name: /^Exotic/ }));
    expect(within(summary).getByText("$250+")).toBeInTheDocument();
    expect(
      within(summary).getByText(/Exotic pricing starts at the amount shown/),
    ).toBeInTheDocument();
  });

  // Mirrors e2e/qa-regressions.spec.ts "vehicle step focuses the first invalid field on screen".
  it("focuses the first invalid field in on-screen order (make before year)", async () => {
    render(<BookingFlow initialDraft={{ ...blank(), service: "fx-wash" }} initialStep={1} />);
    fireEvent.change(screen.getByLabelText(/^Year/), { target: { value: "19" } });
    fireEvent.click(continueButton());
    expect(await screen.findByText("Enter the make, like Porsche or Toyota.")).toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText("Make")));
  });

  // Mirrors e2e/qa-regressions.spec.ts "time on site does not read 'About ~'".
  it("shows approximate durations without a second qualifier", () => {
    render(<BookingFlow initialDraft={{ ...blank(), service: "fx-work", size: "suv" }} />);
    const summary = screen.getByRole("complementary", { name: "Booking summary" });
    expect(summary).toHaveTextContent("~1–1.5 hrs on site");
    expect(summary).not.toHaveTextContent("About ~");
  });

  it("drops the interior questions for motorcycles", async () => {
    render(<BookingFlow initialDraft={{ ...blank(), service: "fx-wash" }} initialStep={1} />);
    expect(screen.getByLabelText("Interior")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: /^Motorcycle/ }));
    expect(screen.queryByLabelText("Interior")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("There's pet hair in the cabin")).not.toBeInTheDocument();
    expect(screen.getByText("About the bike")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Make"), { target: { value: "Harley-Davidson" } });
    fireEvent.change(screen.getByLabelText("Model"), { target: { value: "Street Glide" } });
    fireEvent.change(screen.getByLabelText("Paint"), { target: { value: "excellent" } });
    fireEvent.click(continueButton());
    expect(
      await screen.findByRole("heading", { level: 2, name: "Choose a time and place" }),
    ).toBeInTheDocument();
  });

  it("shows the work-vehicle price factor in the summary", () => {
    render(<BookingFlow initialDraft={{ ...blank(), service: "fx-work", size: "truck" }} />);
    const summary = screen.getByRole("complementary", { name: "Booking summary" });
    expect(within(summary).getByText(/may add \$15–\$30, quoted on site/)).toBeInTheDocument();
  });

  it("requires the garage checkbox for garage services and focuses it", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    render(
      <BookingFlow
        initialDraft={{
          ...blank(),
          service: "fx-garage",
          street: "123 Main St",
          city: siteConfig.serviceArea[0],
          zip: siteConfig.address.zip,
          utilitiesConfirmed: true,
          date: "2026-10-14",
        }}
        initialStep={stepIndexOf("schedule")}
      />,
    );
    // Day-based service: the single arrival slot is picked automatically.
    expect(screen.getByRole("radio", { name: "Arrival 7:00 AM" })).toBeChecked();

    fireEvent.click(continueButton());
    expect(await screen.findByText(/shade and still air/)).toBeInTheDocument();
    const checkbox = screen.getByRole("checkbox", {
      name: "I have a garage or covered space where the work can be done",
    });
    await waitFor(() => expect(document.activeElement).toBe(checkbox));

    fireEvent.click(checkbox);
    fireEvent.click(continueButton());
    expect(
      await screen.findByRole("heading", { level: 2, name: "Confirm your details" }),
    ).toBeInTheDocument();
  });

  it("completes a booking end to end, skipping add-ons, and shows the confirmation", async () => {
    // Only Date is faked so animations still run.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);

    render(
      <BookingFlow
        initialDraft={{ ...blank(), service: "fx-full", size: "suv" }}
        initialStep={1}
      />,
    );

    // Vehicle
    fireEvent.change(screen.getByLabelText("Make"), { target: { value: "Toyota" } });
    fireEvent.change(screen.getByLabelText("Model"), { target: { value: "4Runner" } });
    fireEvent.change(screen.getByLabelText("Paint"), { target: { value: "light-swirls" } });
    fireEvent.change(screen.getByLabelText("Interior"), { target: { value: "lived-in" } });
    fireEvent.click(screen.getByLabelText("There's pet hair in the cabin"));
    fireEvent.click(continueButton());

    // Schedule (no add-ons step in between)
    await screen.findByRole("heading", { level: 2, name: "Choose a time and place" });
    expect(screen.queryByRole("checkbox", { name: /garage/i })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Street address"), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByLabelText("City"), {
      target: { value: siteConfig.serviceArea[1] },
    });
    fireEvent.change(screen.getByLabelText("ZIP code"), {
      target: { value: siteConfig.address.zip },
    });
    expect(
      screen.getByRole("button", { name: /Sunday, October 11, 2026, closed/ }),
    ).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(screen.getByRole("button", { name: "Wednesday, October 14, 2026" }));
    fireEvent.click(await screen.findByRole("radio", { name: "9:00 AM" }));

    // Utilities are required: Continue stops and focuses the checkbox until it is ticked.
    fireEvent.click(continueButton());
    const utilities = screen.getByRole("checkbox", { name: UTILITIES_LABEL });
    expect(await screen.findByText(/doesn't carry a water tank or generator/)).toBeInTheDocument();
    await waitFor(() => expect(document.activeElement).toBe(utilities));
    fireEvent.click(utilities);
    expect(
      within(screen.getByRole("complementary", { name: "Booking summary" })).getByText(
        "Utilities confirmed",
      ),
    ).toBeInTheDocument();
    fireEvent.click(continueButton());

    // Contact: the summary has no add-ons row.
    await screen.findByRole("heading", { level: 2, name: "Confirm your details" });
    const check = screen.getByRole("region", { name: "Check your booking" });
    expect(within(check).queryByText("Add-ons")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Jordan Reyes" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jordan@example.com" } });
    fireEvent.change(screen.getByLabelText("Mobile phone"), { target: { value: "7605550123" } });
    expect(screen.getByLabelText("Mobile phone")).toHaveValue("(760) 555-0123");
    fireEvent.click(screen.getByRole("button", { name: "Request booking" }));

    expect(
      await screen.findByRole("heading", { level: 2, name: /You're on the schedule, Jordan/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("PAD-7F3K2Q")).toBeInTheDocument();
    expect(screen.queryByText("Add-ons")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "What to have ready" })).toBeInTheDocument();
    for (const item of siteConfig.customerProvides)
      expect(screen.getByText(item)).toBeInTheDocument();
    const ics = screen.getByRole("link", { name: /Add to calendar/ });
    expect(ics).toHaveAttribute("download", "pad-7f3k2q.ics");
    expect(decodeURIComponent(ics.getAttribute("href")!)).toContain("DTSTART:20261014T160000Z");
    expect(vi.mocked(submitBooking)).toHaveBeenCalledTimes(1);
  });
});
