import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { weekdayOf, type IsoDate } from "@/lib/booking/slots";
import { Calendar } from "../calendar";

const closedSundays = (date: IsoDate) => (weekdayOf(date) === 0 ? "Closed" : null);

function renderCalendar(props: Partial<React.ComponentProps<typeof Calendar>> = {}) {
  return render(
    <>
      <p id="label">Date</p>
      <Calendar
        id="bk-date"
        labelledBy="label"
        value=""
        onChange={vi.fn()}
        // Friday after 2 PM: the earliest allowed date is Sunday 11 Oct, which is closed.
        min="2026-10-11"
        max="2026-12-06"
        getUnavailableReason={closedSundays}
        {...props}
      />
    </>,
  );
}

describe("Calendar", () => {
  it("starts the roving tab stop on the first bookable date, not a closed minimum", () => {
    renderCalendar();
    const tabbable = screen
      .getAllByRole("button")
      .filter((button) => button.getAttribute("data-date") && button.tabIndex === 0);
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toHaveAttribute("data-date", "2026-10-12");
    expect(tabbable[0]).not.toHaveAttribute("aria-disabled");
    expect(tabbable[0]).toHaveAttribute("id", "bk-date");
  });

  it("starts on the selected date when there is one", () => {
    renderCalendar({ value: "2026-10-20" });
    expect(document.getElementById("bk-date")).toHaveAttribute("data-date", "2026-10-20");
  });
});
