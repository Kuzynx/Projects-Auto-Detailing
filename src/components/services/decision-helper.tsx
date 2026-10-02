"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { bookingUrl, formatServicePrice, getService, type VehicleSize } from "@/data/services";
import { SegmentedControl, type SegmentedOption } from "./segmented-control";

type Vehicle = "daily" | "work";
type Outside = "dusty" | "grimy";
type Inside = "fine" | "needs";

const vehicleOptions: SegmentedOption<Vehicle>[] = [
  { value: "daily", label: "Daily car, SUV or bike", hint: "Including sports cars and exotics" },
  { value: "work", label: "Work truck", hint: "Construction, farm or job vehicle" },
];

const outsideOptions: SegmentedOption<Outside>[] = [
  { value: "dusty", label: "Just dusty", hint: "Needs a good wash" },
  { value: "grimy", label: "Grimy", hint: "Bugs, brake dust, dirty wheel wells" },
];

const insideOptions: SegmentedOption<Inside>[] = [
  { value: "fine", label: "Inside is fine", hint: "Outside only, please" },
  { value: "needs", label: "Inside needs work", hint: "Crumbs, dust, stains" },
];

interface Recommendation {
  slug: string;
  reason: string;
}

function recommend(vehicle: Vehicle, outside: Outside, inside: Inside): Recommendation {
  if (vehicle === "work") {
    return inside === "needs"
      ? {
          slug: "full-deluxe",
          reason:
            "The Working Truck service is exterior only. If the cab needs cleaning too, Full Deluxe covers inside and out.",
        }
      : {
          slug: "working-truck",
          reason:
            "Built for trucks that get dirty for a living: wheel wells, bugs and grime, door jambs and tire dressing, from one starting price for any size.",
        };
  }
  if (inside === "needs") {
    return {
      slug: "full-deluxe",
      reason:
        "You get the full Premium exterior plus the inside: vacuum, dash, console, doors, seats, mats, interior windows and deeper stain cleaning.",
    };
  }
  if (outside === "grimy") {
    return {
      slug: "premium-detail",
      reason:
        "Grime lives in the wheels, wheel wells and door jambs. Premium cleans all of them, removes bugs and finishes with a spray wax/sealant.",
    };
  }
  return {
    slug: "basic-wash",
    reason:
      "Your car just needs a proper hand wash: wheels and tires, tire shine, windows, a dry and a wipe-down.",
  };
}

/** Three-question helper that recommends a service. */
export function DecisionHelper() {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [outside, setOutside] = useState<Outside | null>(null);
  const [inside, setInside] = useState<Inside | null>(null);

  const result = vehicle && outside && inside ? recommend(vehicle, outside, inside) : null;
  const service = result ? getService(result.slug) : undefined;
  // Work trucks are quoted and booked at the truck size; everyone else sees the car price.
  const quoteSize: VehicleSize = vehicle === "work" ? "truck" : "car";
  const answered = [vehicle, outside, inside].filter(Boolean).length;

  function reset() {
    setVehicle(null);
    setOutside(null);
    setInside(null);
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase">
          <span className="text-brand-400">{answered}</span> of 3 answered
        </p>
        {answered > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-ink-muted transition-colors hover:text-ink"
          >
            <RotateCcw aria-hidden className="size-3.5" />
            Start over
          </button>
        )}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/5" aria-hidden>
        <div
          className="h-full rounded-full bg-brand-500 transition-all duration-500"
          style={{ width: `${(answered / 3) * 100}%` }}
        />
      </div>

      <div className="mt-8 space-y-8">
        <SegmentedControl
          legend="1. What are we washing?"
          variant="tile"
          options={vehicleOptions}
          value={vehicle}
          onChange={setVehicle}
          gridClassName="sm:grid-cols-2"
        />
        <SegmentedControl
          legend="2. How does the outside look?"
          variant="tile"
          options={outsideOptions}
          value={outside}
          onChange={setOutside}
          gridClassName="sm:grid-cols-2"
        />
        <SegmentedControl
          legend="3. What about the inside?"
          variant="tile"
          options={insideOptions}
          value={inside}
          onChange={setInside}
          gridClassName="sm:grid-cols-2"
        />
      </div>

      <div aria-live="polite" className="mt-8">
        {service && result ? (
          <div className="animate-fade-up overflow-hidden rounded-lg border border-brand-500/40 bg-bg shadow-glow">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:p-6">
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md sm:aspect-square sm:w-28">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 112px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="inline-flex items-center gap-1.5 font-display text-xs font-semibold tracking-[0.2em] text-brand-400 uppercase">
                  <Sparkles aria-hidden className="size-3.5" />
                  Our recommendation
                </p>
                <h3 className="mt-2 text-2xl font-semibold">{service.name}</h3>
                <p className="mt-1 text-sm text-ink-subtle">
                  {quoteSize === "truck" ? "Trucks" : "Cars"} from{" "}
                  {formatServicePrice(service, quoteSize)} · {service.duration[quoteSize]}
                </p>
                <p className="mt-3 text-sm text-pretty text-ink-muted">{result.reason}</p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <ButtonLink
                    href={bookingUrl({ service: service.slug, size: quoteSize })}
                    size="sm"
                    aria-label={`Book ${service.name}`}
                  >
                    Book this package
                  </ButtonLink>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-brand-300"
                  >
                    See what is included
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border-strong px-5 py-4 text-sm text-ink-subtle">
            Answer all three and we will point you to the right package. No email required.
          </p>
        )}
      </div>
    </div>
  );
}
