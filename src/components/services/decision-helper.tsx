"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { bookingUrl, getAddOn, getService } from "@/data/services";
import { formatPrice } from "@/lib/utils";
import { SegmentedControl, type SegmentedOption } from "./segmented-control";

type Paint = "glossy" | "dull" | "scratched";
type Interior = "tidy" | "lived-in" | "heavy";
type Keep = "yes" | "no";

const paintOptions: SegmentedOption<Paint>[] = [
  { value: "glossy", label: "Glossy, just dirty", hint: "Reflections look sharp" },
  { value: "dull", label: "Dull or hazy", hint: "Swirls show in the sun" },
  { value: "scratched", label: "Scratched or faded", hint: "Marks you can see from 3 ft" },
];

const interiorOptions: SegmentedOption<Interior>[] = [
  { value: "tidy", label: "Pretty tidy", hint: "Dust and a few crumbs" },
  { value: "lived-in", label: "Lived-in", hint: "Stains, sticky cup holders" },
  { value: "heavy", label: "Kids, pets or rideshare", hint: "Hair, spills, odors" },
];

const keepOptions: SegmentedOption<Keep>[] = [
  { value: "yes", label: "Yes, keeping it", hint: "More than two years" },
  { value: "no", label: "Probably not", hint: "Selling, trading or leasing" },
];

interface Recommendation {
  slug: string;
  reason: string;
  addOn?: string;
}

function recommend(paint: Paint, interior: Interior, keep: Keep): Recommendation {
  const messy = interior !== "tidy";
  const addOn = interior === "heavy" ? "pet-hair-removal" : undefined;

  if (paint === "scratched") {
    return keep === "yes"
      ? {
          slug: "ceramic-coating",
          reason:
            "Correct the paint once, then lock it in. The coating includes full paint correction and protects the result for years.",
          addOn,
        }
      : {
          slug: "paint-correction",
          reason:
            "Up to 90% of visible scratches and swirls removed, measured panel by panel. The biggest visual upgrade before a sale or lease return.",
          addOn,
        };
  }
  if (paint === "dull") {
    return keep === "yes"
      ? {
          slug: "ceramic-coating",
          reason:
            "Hazy paint is the clear coat telling you it needs correcting. Since you are keeping the car, coat it afterwards and stop waxing for good.",
          addOn,
        }
      : {
          slug: "full-detail",
          reason:
            "A one-step machine polish brings back gloss without the cost of full correction, and the interior gets a complete reset too.",
          addOn,
        };
  }
  if (messy) {
    return keep === "yes"
      ? {
          slug: "full-detail",
          reason:
            "Your paint is in good shape; the inside needs the work. The Full Detail resets both and adds six months of paint protection.",
          addOn,
        }
      : {
          slug: "interior-refresh",
          reason:
            "The paint is fine, so put the budget where it shows: steam, shampoo and conditioning for every surface inside.",
          addOn,
        };
  }
  return keep === "yes"
    ? {
        slug: "ceramic-coating",
        reason:
          "Good paint is the best time to coat. You lock in the finish while it is healthy and skip years of waxing.",
      }
    : {
        slug: "signature-wash",
        reason:
          "Your car is in good shape. A proper hand wash and three-month sealant keeps it that way for less than a tank of gas.",
      };
}

/** Three-question helper that recommends a service. */
export function DecisionHelper() {
  const [paint, setPaint] = useState<Paint | null>(null);
  const [interior, setInterior] = useState<Interior | null>(null);
  const [keep, setKeep] = useState<Keep | null>(null);

  const result = paint && interior && keep ? recommend(paint, interior, keep) : null;
  const service = result ? getService(result.slug) : undefined;
  const addOn = result?.addOn ? getAddOn(result.addOn) : undefined;
  const answered = [paint, interior, keep].filter(Boolean).length;

  function reset() {
    setPaint(null);
    setInterior(null);
    setKeep(null);
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
          legend="1. How does the paint look in direct sunlight?"
          variant="tile"
          options={paintOptions}
          value={paint}
          onChange={setPaint}
        />
        <SegmentedControl
          legend="2. What is the interior like right now?"
          variant="tile"
          options={interiorOptions}
          value={interior}
          onChange={setInterior}
        />
        <SegmentedControl
          legend="3. Keeping the car for more than two years?"
          variant="tile"
          options={keepOptions}
          value={keep}
          onChange={setKeep}
          className="[&>div]:sm:grid-cols-2"
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
                  From {formatPrice(service.price.sedan)}
                  {service.priceSuffix ? ` ${service.priceSuffix}` : ""} · {service.duration.sedan}
                </p>
                <p className="mt-3 text-sm text-pretty text-ink-muted">{result.reason}</p>
                {addOn && (
                  <p className="mt-3 text-sm text-ink-muted">
                    Add <span className="font-semibold text-ink">{addOn.name}</span> (+
                    {formatPrice(addOn.price)}) for hair and spills.
                  </p>
                )}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <ButtonLink
                    href={bookingUrl({
                      service: service.slug,
                      addons: addOn ? [addOn.slug] : undefined,
                    })}
                    size="sm"
                  >
                    Book {service.name}
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
