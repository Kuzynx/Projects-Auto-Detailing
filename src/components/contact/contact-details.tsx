import Link from "next/link";
import { CalendarCheck, Check, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui";
import { bookingHref, siteConfig } from "@/config/site";
import { socialLinks } from "./brand-icons";

/** Phone, email and booking quick-contact cards. */
export function ContactQuickCards() {
  const cards = [
    {
      Icon: Phone,
      label: "Call or message",
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
      Icon: CalendarCheck,
      label: "Book online",
      value: "Pick a time",
      href: bookingHref,
      note: "Choose a service and slot in about 60 seconds.",
    },
  ];

  return (
    <ul className="grid gap-3">
      {cards.map(({ Icon, label, value, href, note }) => (
        <li key={label}>
          <Link
            href={href}
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
              <span className="mt-0.5 block text-sm text-ink-muted">{note}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

const visitChecklist = [
  ...siteConfig.customerProvides,
  "You only need to be there at the start and the end",
];

/** What a mobile visit needs from the customer, plus social links. */
export function ContactInfo() {
  return (
    <div className="grid gap-3">
      <Card className="p-6">
        <h2 className="font-display text-base font-semibold">What we need from you</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {visitChecklist.map((line) => (
            <li key={line} className="flex gap-3 text-ink-muted">
              <Check className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
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
