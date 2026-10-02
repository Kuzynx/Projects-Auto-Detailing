import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { bookingHref, siteConfig } from "@/config/site";
import { services } from "@/data/services";
import { Container, Logo } from "@/components/ui";
import { SocialLinks } from "./social-icons";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Book an appointment", href: bookingHref },
] as const;

const { address } = siteConfig;
const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.name}, ${fullAddress}`)}`;

function ColumnHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-xs font-semibold tracking-[0.2em] text-ink uppercase">
      {children}
    </h2>
  );
}

const linkClass =
  "inline-flex items-center gap-2 text-sm text-ink-muted transition-colors duration-200 hover:text-ink focus-visible:text-ink";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-bg-elevated">
      {/* Purple-to-chrome hairline across the top edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-500/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 mx-auto h-px max-w-3xl bg-linear-to-r from-transparent via-ink/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute -top-64 left-1/2 -z-10 h-[28rem] w-[56rem] -translate-x-1/2 bg-radial from-brand-500/10 to-transparent to-70%"
      />

      <Container className="pt-16 pb-10 sm:pt-20 lg:pt-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-8">
            <Link
              href="/"
              aria-label={`${siteConfig.name}, home`}
              className="inline-block rounded-md"
            >
              <Logo size="lg" />
            </Link>
            <p className="mt-6 max-w-sm font-display text-lg font-medium tracking-tight text-balance text-ink">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
              Mobile and studio detailing across greater {address.city}. Paint correction, ceramic
              coatings and interiors, done by hand and backed in writing.
            </p>
            <SocialLinks className="mt-7" />
          </div>

          {/* Services */}
          <nav aria-labelledby="footer-services" className="lg:col-span-3">
            <ColumnHeading id="footer-services">Services</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`/services/${service.slug}`} className={linkClass}>
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 transition-colors hover:text-brand-400"
                >
                  All services
                  <ArrowRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company */}
          <nav aria-labelledby="footer-company" className="lg:col-span-2">
            <ColumnHeading id="footer-company">Company</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-3">
            <ColumnHeading>Visit or call</ColumnHeading>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-3 text-ink-muted transition-colors hover:text-ink"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  <address className="leading-relaxed not-italic">
                    {address.street}
                    <br />
                    {address.city}, {address.state} {address.zip}
                    <span className="sr-only"> (opens Google Maps in a new tab)</span>
                  </address>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-3 font-display text-base font-medium text-ink transition-colors hover:text-brand-300"
                >
                  <Phone className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-3 break-all text-ink-muted transition-colors hover:text-ink"
                >
                  <Mail className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-400" aria-hidden="true" />
                <dl className="w-full max-w-64 space-y-1.5">
                  {siteConfig.hours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-4">
                      <dt className="text-ink-muted">{h.days}</dt>
                      <dd className={h.close ? "text-ink tabular-nums" : "text-ink-subtle"}>
                        {h.close ? `${h.open} – ${h.close}` : h.open}
                      </dd>
                    </div>
                  ))}
                </dl>
              </li>
            </ul>
          </div>
        </div>

        {/* Service area */}
        <div className="mt-16 flex flex-col gap-3 border-y border-border py-6 text-sm sm:flex-row sm:items-baseline sm:gap-6">
          <h2
            id="footer-area"
            className="shrink-0 font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase"
          >
            Mobile service area
          </h2>
          <ul
            aria-labelledby="footer-area"
            className="flex flex-wrap gap-y-1.5 leading-relaxed text-ink-muted"
          >
            {siteConfig.serviceArea.map((city, i) => (
              <li key={city} className="whitespace-nowrap">
                {i > 0 && (
                  <span aria-hidden="true" className="mx-2 text-brand-500/60">
                    /
                  </span>
                )}
                {city}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="mt-8 flex flex-col-reverse gap-4 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-ink">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-ink">
                Terms of service
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      {/* Oversized chrome wordmark, cropped by the bottom edge. Decorative. */}
      <div aria-hidden="true" className="pointer-events-none -mt-4 select-none sm:-mt-8">
        <p className="translate-y-[28%] bg-linear-to-b from-ink/[0.09] via-ink/[0.04] to-transparent bg-clip-text text-center font-display text-[19vw] leading-none font-bold tracking-[-0.05em] whitespace-nowrap text-transparent xl:text-[15rem]">
          {siteConfig.shortName}
        </p>
      </div>
    </footer>
  );
}
