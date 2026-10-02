"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import { bookingHref, siteConfig } from "@/config/site";
import { ButtonLink, buttonClasses } from "@/components/ui";
import { isActivePath } from "./nav-utils";

/**
 * Thumb-reach Call / Book bar pinned to the bottom of small screens. Hidden on
 * the booking flow itself. Renders an in-flow spacer so it never covers the
 * footer's last row.
 */
export function MobileCtaBar() {
  const pathname = usePathname();
  if (isActivePath(pathname, bookingHref)) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="h-[calc(4.75rem+env(safe-area-inset-bottom))] bg-bg-elevated md:hidden"
      />
      <nav
        aria-label="Quick actions"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/85 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-xl backdrop-saturate-150 md:hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 mx-auto h-px max-w-xs bg-linear-to-r from-transparent via-brand-500/60 to-transparent"
        />
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
          <a href={siteConfig.phoneHref} className={buttonClasses("outline", "md", "w-full")}>
            <Phone className="size-4" aria-hidden="true" />
            Call
            <span className="sr-only">{siteConfig.phone}</span>
          </a>
          <ButtonLink href={bookingHref} size="md" className="w-full">
            Book now
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </nav>
    </>
  );
}
