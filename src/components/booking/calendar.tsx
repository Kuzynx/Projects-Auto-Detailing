"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, formatDateLong, toIsoDate, weekdayOf, type IsoDate } from "@/lib/booking/slots";
import { cn } from "@/lib/utils";

const WEEKDAYS = [
  { short: "Su", long: "Sunday" },
  { short: "Mo", long: "Monday" },
  { short: "Tu", long: "Tuesday" },
  { short: "We", long: "Wednesday" },
  { short: "Th", long: "Thursday" },
  { short: "Fr", long: "Friday" },
  { short: "Sa", long: "Saturday" },
];

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

type Month = { year: number; month: number };

function monthOf(iso: IsoDate): Month {
  const [year, month] = iso.split("-").map(Number);
  return { year, month: month - 1 };
}

function shiftMonth({ year, month }: Month, delta: number): Month {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

function monthKey({ year, month }: Month) {
  return year * 12 + month;
}

function daysInMonth({ year, month }: Month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** Same day-of-month in another month, clamped to that month's length. */
function shiftDateByMonths(iso: IsoDate, delta: number): IsoDate {
  const target = shiftMonth(monthOf(iso), delta);
  const day = Math.min(Number(iso.slice(8, 10)), daysInMonth(target));
  return toIsoDate(target.year, target.month, day);
}

/** First date in [min, max] with no unavailable reason; `min` if none qualifies. */
function firstAvailable(
  min: IsoDate,
  max: IsoDate,
  getUnavailableReason: (date: IsoDate) => string | null,
): IsoDate {
  for (let day = min; day <= max; day = addDays(day, 1)) {
    if (!getUnavailableReason(day)) return day;
  }
  return min;
}

export interface CalendarProps {
  /** Selected date or "". */
  value: string;
  onChange: (date: IsoDate) => void;
  /** First and last dates the grid can navigate to. */
  min: IsoDate;
  max: IsoDate;
  /** Returns a short reason ("Closed") when a date in range can't be booked. */
  getUnavailableReason: (date: IsoDate) => string | null;
  /** Id placed on the focusable day so error focus and labels can target it. */
  id: string;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
}

/**
 * Keyboard-operable date grid following the WAI-ARIA APG date picker pattern:
 * arrows move by day/week, Home/End to week edges, PageUp/PageDown by month
 * (Shift for year), Enter/Space selects. Roving tabindex keeps one tab stop.
 */
export function Calendar({
  value,
  onChange,
  min,
  max,
  getUnavailableReason,
  id,
  labelledBy,
  describedBy,
  invalid,
}: CalendarProps) {
  // Roving tab stop starts on the selected date, else the first bookable one, so the grid
  // never opens with only a disabled day (e.g. a closed Sunday) focusable.
  const initialFocus =
    value && value >= min && value <= max ? value : firstAvailable(min, max, getUnavailableReason);
  const [focused, setFocused] = useState<IsoDate>(initialFocus);
  const [visible, setVisible] = useState<Month>(monthOf(initialFocus));
  const gridRef = useRef<HTMLTableElement>(null);
  const shouldMoveFocus = useRef(false);
  const captionId = `${id}-caption`;

  const minMonth = monthOf(min);
  const maxMonth = monthOf(max);
  const canPrev = monthKey(visible) > monthKey(minMonth);
  const canNext = monthKey(visible) < monthKey(maxMonth);

  const weeks = useMemo(() => {
    const first = toIsoDate(visible.year, visible.month, 1);
    const lead = weekdayOf(first);
    const count = daysInMonth(visible);
    const cells: (IsoDate | null)[] = [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: count }, (_, i) => addDays(first, i)),
    ];
    while (cells.length % 7 !== 0) cells.push(null);
    return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
  }, [visible]);

  // Move DOM focus only after keyboard navigation, never on mount.
  useEffect(() => {
    if (!shouldMoveFocus.current) return;
    shouldMoveFocus.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [focused, visible]);

  function moveFocus(next: IsoDate) {
    const clamped = next < min ? min : next > max ? max : next;
    shouldMoveFocus.current = true;
    setFocused(clamped);
    const nextMonth = monthOf(clamped);
    if (monthKey(nextMonth) !== monthKey(visible)) setVisible(nextMonth);
  }

  function goToMonth(delta: number) {
    const target = shiftMonth(visible, delta);
    setVisible(target);
    // Keep the roving tab stop inside the visible month.
    const candidate = shiftDateByMonths(focused, delta);
    setFocused(candidate < min ? min : candidate > max ? max : candidate);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, date: IsoDate) {
    const keyMap: Record<string, () => IsoDate> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => addDays(date, -weekdayOf(date)),
      End: () => addDays(date, 6 - weekdayOf(date)),
      PageUp: () => shiftDateByMonths(date, event.shiftKey ? -12 : -1),
      PageDown: () => shiftDateByMonths(date, event.shiftKey ? 12 : 1),
    };
    const action = keyMap[event.key];
    if (!action) return;
    event.preventDefault();
    moveFocus(action());
  }

  const monthLabel = monthFormatter.format(new Date(Date.UTC(visible.year, visible.month, 1)));

  return (
    <div
      className={cn(
        "rounded-lg border bg-bg-elevated p-4 sm:p-5",
        invalid ? "border-danger/60" : "border-border",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => goToMonth(-1)}
          disabled={!canPrev}
          aria-label="Previous month"
          className="grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-white/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>
        <p
          id={captionId}
          aria-live="polite"
          className="font-display text-base font-semibold text-ink"
        >
          {monthLabel}
        </p>
        <button
          type="button"
          onClick={() => goToMonth(1)}
          disabled={!canNext}
          aria-label="Next month"
          className="grid size-10 place-items-center rounded-full text-ink-muted transition-colors hover:bg-white/5 hover:text-ink disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      <table
        ref={gridRef}
        role="grid"
        aria-labelledby={`${labelledBy} ${captionId}`}
        aria-describedby={describedBy}
        className="w-full table-fixed border-collapse"
      >
        <thead>
          <tr>
            {WEEKDAYS.map((day) => (
              <th
                key={day.short}
                scope="col"
                abbr={day.long}
                className="pb-2 text-center text-xs font-medium text-ink-subtle"
              >
                {day.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, w) => (
            <tr key={w}>
              {week.map((date, d) => {
                if (!date) return <td key={`empty-${w}-${d}`} className="p-0.5" />;
                const outOfRange = date < min || date > max;
                const reason = outOfRange ? "Unavailable" : getUnavailableReason(date);
                const unavailable = Boolean(reason);
                const selected = date === value;
                const isFocusTarget = date === focused;
                return (
                  <td
                    key={date}
                    role="gridcell"
                    aria-selected={selected}
                    className="p-0.5 text-center"
                  >
                    <button
                      type="button"
                      id={isFocusTarget ? id : undefined}
                      data-date={date}
                      tabIndex={isFocusTarget ? 0 : -1}
                      aria-disabled={unavailable || undefined}
                      aria-label={`${formatDateLong(date)}${reason ? `, ${reason.toLowerCase()}` : ""}`}
                      onClick={() => {
                        setFocused(date);
                        if (!unavailable) onChange(date);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, date)}
                      className={cn(
                        "relative mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-sm tabular-nums transition-colors",
                        "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-400",
                        unavailable
                          ? "cursor-not-allowed text-ink-subtle/60 line-through decoration-ink-subtle/40"
                          : "cursor-pointer text-ink hover:bg-white/8",
                        selected &&
                          "bg-brand-500 font-semibold text-bg no-underline hover:bg-brand-400",
                      )}
                    >
                      {Number(date.slice(8, 10))}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
