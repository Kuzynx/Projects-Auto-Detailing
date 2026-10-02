import Link from "next/link";
import { Phone } from "lucide-react";
import { bookingHref, siteConfig } from "@/config/site";
import { ButtonLink, Container, Logo } from "@/components/ui";
import { DesktopNav } from "./desktop-nav";
import { HeaderBackdrop } from "./header-backdrop";
import { MobileMenu } from "./mobile-menu";

/**
 * Sticky site header. Transparent at the top of the page and frosted once the
 * page scrolls (see HeaderBackdrop). Heroes that should sit underneath it use
 * `heroUnderlapClass` from ./nav-utils. Interactive parts are small client leaves.
 */
export function Header() {
  return (
    <header className="sticky top-0 isolate z-50">
      <HeaderBackdrop />
      <Container className="flex h-16 items-center gap-3 lg:h-20 lg:gap-6">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, home`}
          className="-my-1 shrink-0 rounded-md transition-opacity hover:opacity-90"
        >
          <Logo size="md" priority />
        </Link>

        <DesktopNav className="hidden flex-1 justify-center lg:flex" />

        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-3">
          <a
            href={siteConfig.phoneHref}
            className="group hidden items-center gap-2.5 rounded-full py-1.5 pr-1 font-display text-sm font-medium text-ink-muted transition-colors hover:text-ink lg:inline-flex"
          >
            <span className="grid size-9 place-items-center rounded-full border border-border-strong transition-colors group-hover:border-brand-500/70 group-hover:text-brand-300">
              <Phone className="size-4" aria-hidden="true" />
            </span>
            <span className="sr-only xl:not-sr-only">
              <span className="sr-only">Call </span>
              {siteConfig.phone}
            </span>
          </a>
          <ButtonLink
            href={bookingHref}
            size="sm"
            className="hidden sm:inline-flex lg:h-11 lg:px-6"
          >
            Book now
          </ButtonLink>
          <MobileMenu className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
