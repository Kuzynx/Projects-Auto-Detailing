import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { socialLinks } from "./brand-icons";
import { directionsHref, fullAddress } from "./map-card";

/** Phone, email and studio quick-contact cards. */
export function ContactQuickCards() {
  const cards = [
    {
      Icon: Phone,
      label: "Call or text",
      value: siteConfig.phone,
      href: siteConfig.phoneHref,
      note: "Fastest for same-week appointments.",
    },
    {
      Icon: Mail,
      label: "Email",
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      note: "Photos of the car help us quote.",
    },
    {
      Icon: MapPin,
      label: "Studio",
      value: fullAddress,
      href: directionsHref,
      note: "Get directions",
      external: true,
    },
  ];

  return (
    <ul className="grid gap-3">
      {cards.map(({ Icon, label, value, href, note, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-start gap-4 rounded-lg border border-border bg-surface p-5 shadow-card transition-colors hover:border-brand-500/50 hover:bg-surface-hover"
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-brand-500/30 bg-brand-500/10 text-brand-300 transition-colors group-hover:bg-brand-500 group-hover:text-bg">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xs font-semibold tracking-[0.16em] text-ink-subtle uppercase">
                {label}
              </span>
              <span className="mt-1 block font-display text-base font-semibold break-words text-ink sm:text-lg">
                {value}
              </span>
              <span className="mt-0.5 block text-sm text-ink-muted">
                {note}
                {external && <span className="sr-only"> (opens Google Maps in a new tab)</span>}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Hours table, service-area chips and social links. */
export function ContactInfo() {
  return (
    <div className="grid gap-3">
      <Card className="p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold">
          <Clock className="size-4 text-brand-400" aria-hidden />
          Hours
        </h2>
        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">Studio and phone hours</caption>
          <tbody className="divide-y divide-border">
            {siteConfig.hours.map((row) => {
              const closed = row.open.toLowerCase() === "closed";
              return (
                <tr key={row.days}>
                  <th scope="row" className="py-2.5 pr-4 text-left font-normal text-ink-muted">
                    {row.days}
                  </th>
                  <td
                    className={
                      closed
                        ? "py-2.5 text-right text-ink-subtle"
                        : "py-2.5 text-right font-medium text-ink tabular-nums"
                    }
                  >
                    {closed ? "Closed" : `${row.open} – ${row.close}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-ink-subtle">
          Messages sent after hours are answered first thing the next business morning.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-semibold">
          <MapPin className="size-4 text-brand-400" aria-hidden />
          Mobile service areas
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {siteConfig.serviceArea.map((area) => (
            <li key={area}>
              <Badge tone="neutral" className="text-xs font-medium tracking-normal normal-case">
                {area}
              </Badge>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-subtle">
          Just outside the map? Ask anyway. We often can for larger jobs.
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-base font-semibold">Follow the work</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {socialLinks.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border-strong px-4 text-sm text-ink-muted transition-colors hover:border-brand-500 hover:text-brand-300"
              >
                <Icon className="size-4" aria-hidden />
                {label}
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
