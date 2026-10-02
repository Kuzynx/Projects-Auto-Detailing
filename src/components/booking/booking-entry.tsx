"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { parseBookingSearchParams } from "@/lib/booking/search-params";
import { stepIndexOf } from "@/lib/booking/schema";
import { BookingFlow } from "./booking-flow";

function BookingFromUrl() {
  const searchParams = useSearchParams();
  const params: Record<string, string | string[]> = {};
  for (const key of new Set(searchParams.keys())) {
    const all = searchParams.getAll(key);
    params[key] = all.length > 1 ? all : (all[0] ?? "");
  }
  const { draft, hasService } = parseBookingSearchParams(params);
  // Remount the flow when the pre-selection changes via client navigation.
  const key = [draft.service, draft.size, draft.addOns.join(",")].join("|");
  return (
    <BookingFlow
      key={key}
      initialDraft={draft}
      initialStep={hasService ? stepIndexOf("vehicle") : 0}
    />
  );
}

/** Reads ?service=&size=&addons= on the client so /book can be prerendered. */
export function BookingEntry() {
  return (
    <Suspense
      fallback={<div className="min-h-[60vh]" aria-busy="true" aria-label="Loading booking form" />}
    >
      <BookingFromUrl />
    </Suspense>
  );
}
