"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Check,
  ChevronDown,
  Clock,
  Phone,
  RefreshCw,
  ShieldCheck,
  Truck,
  Warehouse,
  Zap,
} from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { siteConfig } from "@/config/site";
import {
  addOnMinutes,
  bookingUrl,
  serviceLocations,
  vehicleSizes,
  type AddOn,
  type Service,
  type VehicleSize,
} from "@/data/services";
import { cn, formatPrice } from "@/lib/utils";
import { SegmentedControl } from "./segmented-control";
import { useQueryParam } from "./use-query-param";

const sizeIds = vehicleSizes.map((v) => v.id);
const sizeOptions = vehicleSizes.map((v) => ({ value: v.id, label: v.label.split(" / ")[0] }));

function formatMinutes(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
}

interface BookingSidebarProps {
  service: Pick<Service, "slug" | "name" | "price" | "duration" | "location" | "priceSuffix">;
  recommended: AddOn[];
  more: AddOn[];
}

/** Live price configurator with a deep link into the booking flow. */
export function BookingSidebar({ service, recommended, more }: BookingSidebarProps) {
  const [size, setSize] = useQueryParam<VehicleSize>("size", sizeIds, "sedan");
  const [selected, setSelected] = useState<string[]>([]);

  const all = [...recommended, ...more];
  const chosen = all.filter((a) => selected.includes(a.slug));
  const addOnTotal = chosen.reduce((sum, a) => sum + a.price, 0);
  const extraMinutes = chosen.reduce((sum, a) => sum + addOnMinutes(a), 0);
  const base = service.price[size];
  const total = base + addOnTotal;
  const sizeInfo = vehicleSizes.find((v) => v.id === size);
  const moreCount = more.filter((a) => selected.includes(a.slug)).length;

  function toggle(slug: string) {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }

  const href = bookingUrl({ service: service.slug, size, addons: selected });

  return (
    <div className="rounded-lg border border-border-strong bg-surface/95 p-6 shadow-card backdrop-blur-xl">
      <h2 className="font-display text-lg font-semibold">Configure and book</h2>
      <p className="mt-1 text-sm text-ink-muted">Pick your vehicle size. Add extras if you like.</p>

      <SegmentedControl
        legend="Vehicle size"
        hideLegend
        options={sizeOptions}
        value={size}
        onChange={setSize}
        className="mt-5"
      />
      {sizeInfo && (
        <p className="mt-2 text-xs text-ink-subtle">
          {sizeInfo.description}, e.g. {sizeInfo.examples}
        </p>
      )}

      <div
        className="mt-6 rounded-lg border border-border bg-bg p-4"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-ink-muted">
            {addOnTotal > 0 ? "Estimated total" : "Starting price"}
          </p>
          <p className="font-display text-3xl font-semibold tracking-tight text-ink tabular-nums">
            {formatPrice(total)}
            {service.priceSuffix && (
              <span className="ml-1 font-sans text-xs font-normal tracking-normal text-ink-subtle">
                {service.priceSuffix}
              </span>
            )}
          </p>
        </div>
        {addOnTotal > 0 && (
          <p className="mt-1 text-right text-xs text-ink-subtle tabular-nums">
            {formatPrice(base)} service + {formatPrice(addOnTotal)} add-ons
          </p>
        )}
        <p className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm text-ink-muted">
          <Clock aria-hidden className="size-4 text-brand-400" />
          <span>
            {service.duration[size]}
            {extraMinutes > 0 && (
              <span className="text-ink-subtle"> + {formatMinutes(extraMinutes)} for add-ons</span>
            )}
          </span>
        </p>
      </div>

      {all.length > 0 && (
        <fieldset className="mt-6">
          <legend className="font-display text-sm font-semibold">
            Add-ons <span className="font-normal text-ink-subtle">(optional)</span>
          </legend>
          <ul className="mt-3 space-y-2">
            {recommended.map((a) => (
              <AddOnOption
                key={a.slug}
                addOn={a}
                checked={selected.includes(a.slug)}
                onToggle={toggle}
              />
            ))}
          </ul>
          {more.length > 0 && (
            <details className="group/more mt-2">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md py-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
                <ChevronDown
                  aria-hidden
                  className="size-4 transition-transform group-open/more:rotate-180"
                />
                {more.length} more add-ons
                {moreCount > 0 && <span className="text-brand-300">({moreCount} selected)</span>}
              </summary>
              <ul className="mt-1 space-y-2">
                {more.map((a) => (
                  <AddOnOption
                    key={a.slug}
                    addOn={a}
                    checked={selected.includes(a.slug)}
                    onToggle={toggle}
                  />
                ))}
              </ul>
            </details>
          )}
        </fieldset>
      )}

      {service.location === "garage" && (
        <p className="mt-6 flex gap-2.5 rounded-md border border-brand-500/30 bg-brand-500/[0.06] p-3 text-xs text-ink-muted">
          <Warehouse aria-hidden className="mt-0.5 size-4 shrink-0 text-brand-300" />
          <span>
            <span className="font-semibold text-ink">Garage required.</span>{" "}
            {serviceLocations.garage.description}
          </span>
        </p>
      )}

      <ButtonLink href={href} size="lg" className="mt-6 w-full">
        <CalendarCheck aria-hidden className="size-5" />
        Book this service
      </ButtonLink>
      <a
        href={siteConfig.phoneHref}
        className="mt-3 flex items-center justify-center gap-2 rounded-full py-2 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <Phone aria-hidden className="size-4" />
        Prefer to talk? Call {siteConfig.phone}
      </a>

      <ul className="mt-5 space-y-2.5 border-t border-border pt-5 text-xs text-ink-muted">
        <li className="flex items-center gap-2.5">
          <Truck aria-hidden className="size-4 shrink-0 text-brand-400" />
          We come to you anywhere in the {siteConfig.region}
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheck aria-hidden className="size-4 shrink-0 text-brand-400" />
          No deposit for washes and interiors
        </li>
        <li className="flex items-center gap-2.5">
          <RefreshCw aria-hidden className="size-4 shrink-0 text-brand-400" />
          Free reschedule up to 24h before
        </li>
        <li className="flex items-center gap-2.5">
          <Zap aria-hidden className="size-4 shrink-0 text-brand-400" />
          We bring water, power and lighting
        </li>
      </ul>
    </div>
  );
}

function AddOnOption({
  addOn,
  checked,
  onToggle,
}: {
  addOn: AddOn;
  checked: boolean;
  onToggle: (slug: string) => void;
}) {
  return (
    <li>
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
          checked
            ? "border-brand-500/60 bg-brand-500/10"
            : "border-border hover:border-border-strong",
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(addOn.slug)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "mt-0.5 grid size-4 shrink-0 place-items-center rounded border transition-colors",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-400",
            checked ? "border-brand-500 bg-brand-500 text-bg" : "border-border-strong",
          )}
        >
          {checked && <Check className="size-3" strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-ink">{addOn.name}</span>
            <span className="text-sm text-ink-muted tabular-nums">+{formatPrice(addOn.price)}</span>
          </span>
          <span className="mt-0.5 block text-xs text-ink-subtle">
            {addOn.description} {addOn.duration}
          </span>
        </span>
      </label>
    </li>
  );
}
