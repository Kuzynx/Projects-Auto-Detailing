import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { submitBooking } from "@/app/book/actions";
import { siteConfig } from "@/config/site";
import { calculateEstimate } from "@/lib/booking/pricing";
import { emptyDraft, validateBooking } from "@/lib/booking/schema";
import type { BookingActionState } from "@/lib/booking/types";
import { BookingFlow } from "../booking-flow";

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
const continueButton = () => screen.getByRole("button", { name: /continue|skip add-ons/i });

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

  it("advances to the vehicle step and updates the live estimate", async () => {
    render(<BookingFlow initialDraft={blank()} />);
    fireEvent.click(screen.getByRole("radio", { name: /The Full Detail/ }));
    const summary = screen.getByRole("complementary", { name: "Booking summary" });
    expect(within(summary).getAllByText("$349").length).toBeGreaterThan(0);

    fireEvent.click(continueButton());
    const heading = await screen.findByRole("heading", {
      level: 2,
      name: "Tell us about your vehicle",
    });
    await waitFor(() => expect(document.activeElement).toBe(heading));

    fireEvent.click(screen.getByRole("radio", { name: /SUV \/ Crossover/ }));
    expect(within(summary).getAllByText("$399").length).toBeGreaterThan(0);
  });

  it("opens on the vehicle step with a garage service pre-selected", () => {
    render(
      <BookingFlow initialDraft={{ ...blank(), service: "ceramic-coating" }} initialStep={1} />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Tell us about your vehicle" }),
    ).toBeInTheDocument();
    const summary = screen.getByRole("complementary", { name: "Booking summary" });
    expect(within(summary).getByText("In your garage or covered space")).toBeInTheDocument();
  });

  it("requires the garage checkbox for coatings and focuses it", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);
    render(
      <BookingFlow
        initialDraft={{
          ...blank(),
          service: "ceramic-coating",
          street: "123 Main St",
          city: siteConfig.serviceArea[0],
          zip: siteConfig.address.zip,
          date: "2026-10-14",
        }}
        initialStep={3}
      />,
    );
    // Day-based service: the single arrival slot is picked automatically.
    expect(screen.getByRole("radio", { name: "Arrival 7:00 AM" })).toBeChecked();
    expect(screen.queryByText(/drop-off/i)).not.toBeInTheDocument();

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

  it("completes a booking end to end and shows the confirmation", async () => {
    // Only Date is faked so animations still run.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(NOW);

    render(
      <BookingFlow
        initialDraft={{ ...blank(), service: "full-detail", size: "suv" }}
        initialStep={1}
      />,
    );

    // Vehicle
    fireEvent.change(screen.getByLabelText("Make"), { target: { value: "Porsche" } });
    fireEvent.change(screen.getByLabelText("Model"), { target: { value: "Macan" } });
    fireEvent.change(screen.getByLabelText("Paint"), { target: { value: "light-swirls" } });
    fireEvent.change(screen.getByLabelText("Interior"), { target: { value: "lived-in" } });
    fireEvent.click(screen.getByLabelText("There's pet hair in the cabin"));
    fireEvent.click(continueButton());

    // Add-ons: pet hair is recommended from the vehicle answers.
    await screen.findByRole("heading", { level: 2, name: "Add finishing touches" });
    const petHair = screen.getByRole("checkbox", { name: /Pet Hair Removal/ });
    expect(within(petHair.closest("label")!).getByText("Recommended")).toBeInTheDocument();
    fireEvent.click(petHair);
    fireEvent.click(continueButton());

    // Schedule
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
    fireEvent.click(continueButton());

    // Contact
    await screen.findByRole("heading", { level: 2, name: "Confirm your details" });
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Jordan Reyes" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jordan@example.com" } });
    fireEvent.change(screen.getByLabelText("Mobile phone"), { target: { value: "7605550123" } });
    expect(screen.getByLabelText("Mobile phone")).toHaveValue("(760) 555-0123");
    fireEvent.click(screen.getByRole("button", { name: "Request booking" }));

    expect(
      await screen.findByRole("heading", { level: 2, name: /You're on the schedule, Jordan/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("PAD-7F3K2Q")).toBeInTheDocument();
    const ics = screen.getByRole("link", { name: /Add to calendar/ });
    expect(ics).toHaveAttribute("download", "pad-7f3k2q.ics");
    expect(decodeURIComponent(ics.getAttribute("href")!)).toContain("DTSTART:20261014T160000Z");
    expect(vi.mocked(submitBooking)).toHaveBeenCalledTimes(1);
  });
});
