"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight, Clock, MapPin, Phone, X } from "lucide-react";
import { bookingHref, navigation, siteConfig } from "@/config/site";
import { ButtonLink, Logo, buttonClasses } from "@/components/ui";
import { cn } from "@/lib/utils";
import { isActivePath } from "./nav-utils";
import { SocialLinks } from "./social-icons";
import { baseLocation, hasStorefront } from "./location";

const MENU_ID = "site-mobile-menu";
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EASE = [0.22, 1, 0.36, 1] as const;
/** Never inert these: non-rendering tags, and Next's route announcer for screen readers. */
const NEVER_INERT = new Set(["SCRIPT", "STYLE", "LINK", "TEMPLATE", "NEXT-ROUTE-ANNOUNCER"]);

/**
 * Marks everything outside `keep` inert (main, footer, the mobile CTA bar, the skip
 * link and the header's other controls) by walking up to <body> and flagging the
 * siblings at each level. Returns a function that undoes only what it changed.
 */
function inertOutside(keep: HTMLElement) {
  const changed: Element[] = [];
  let node: HTMLElement = keep;
  while (node.parentElement && node !== document.body) {
    const parent: HTMLElement = node.parentElement;
    for (const sibling of Array.from(parent.children)) {
      if (sibling === node || NEVER_INERT.has(sibling.tagName) || sibling.hasAttribute("inert"))
        continue;
      sibling.setAttribute("inert", "");
      changed.push(sibling);
    }
    node = parent;
  }
  return () => changed.forEach((el) => el.removeAttribute("inert"));
}

/** Where focus goes after the menu closes on widening: the first desktop nav link, else <main>. */
function desktopFocusTarget() {
  return (
    document.querySelector<HTMLElement>('nav[aria-label="Primary"] a[href]') ??
    document.getElementById("main")
  );
}

type FocusAfterClose = "toggle" | "desktop" | null;

/**
 * Hamburger toggle plus a full-screen menu dialog for viewports below `lg`.
 * Locks page scroll, makes the rest of the page inert, traps focus, and closes on
 * Escape, on navigation and when the viewport grows past the desktop breakpoint.
 * Focus returns to the toggle (Escape / close button) or, after widening, to the
 * first desktop nav link, so it never drops to <body>.
 */
export function MobileMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusAfterClose = useRef<FocusAfterClose>(null);

  // Close when the route changes (covers browser back/forward while open).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  const close = useCallback((restoreFocus = true) => {
    focusAfterClose.current = restoreFocus ? "toggle" : null;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    focusAfterClose.current = null;
    const toggle = toggleRef.current;
    const releaseInert = panelRef.current ? inertOutside(panelRef.current) : () => {};

    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    });

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panelRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const desktop = window.matchMedia("(min-width: 1024px)");
    function onBreakpoint() {
      if (!desktop.matches) return;
      focusAfterClose.current = "desktop";
      setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      cancelAnimationFrame(frame);
      root.style.overflow = previousOverflow;
      // Inert must be lifted before focus can move back into the page.
      releaseInert();
      const target = focusAfterClose.current;
      focusAfterClose.current = null;
      if (target === "toggle") toggle?.focus();
      else if (target === "desktop") desktopFocusTarget()?.focus();
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close]);

  const list: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.05,
        delayChildren: reduceMotion ? 0 : 0.12,
      },
    },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: EASE } },
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={MENU_ID}
        aria-haspopup="dialog"
        className={cn(
          "group relative grid size-11 place-items-center rounded-full border border-border-strong bg-white/[0.03] text-ink transition-colors hover:border-brand-500/70",
          className,
        )}
      >
        <span className="sr-only">Open menu</span>
        <span aria-hidden="true" className="flex w-5 flex-col items-end gap-[5px]">
          <span className="h-[1.5px] w-5 rounded-full bg-current" />
          <span className="h-[1.5px] w-3.5 rounded-full bg-current transition-all duration-300 group-hover:w-5 group-hover:bg-brand-300" />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            id={MENU_ID}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-bg"
          >
            {/* Atmosphere: purple bloom, faint grid, chrome hairline under the bar. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -top-48 -right-32 size-[36rem] bg-radial from-brand-500/20 to-transparent to-70%" />
              <div className="absolute -bottom-40 -left-40 size-[28rem] bg-radial from-brand-700/20 to-transparent to-70%" />
              <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent_70%)] opacity-60" />
            </div>

            <div className="relative container-x flex h-16 shrink-0 items-center justify-between border-b border-border">
              <Link href="/" onClick={() => close(false)} aria-label={`${siteConfig.name}, home`}>
                <Logo size="sm" />
              </Link>
              <button
                type="button"
                onClick={() => close()}
                data-autofocus
                className="grid size-11 place-items-center rounded-full border border-border-strong text-ink transition-colors hover:border-brand-500/70 hover:text-brand-300"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <motion.div
              variants={list}
              initial="hidden"
              animate="show"
              className="relative container-x flex flex-1 flex-col pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]"
            >
              <nav aria-label="Mobile">
                <ul className="divide-y divide-border border-b border-border">
                  {navigation.map((link, index) => {
                    const active = isActivePath(pathname, link.href);
                    return (
                      <motion.li key={link.href} variants={item}>
                        <Link
                          href={link.href}
                          onClick={() => close(false)}
                          aria-current={active ? "page" : undefined}
                          className="group flex items-center gap-4 py-4"
                        >
                          <span className="w-6 font-display text-xs font-medium text-ink-subtle tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={cn(
                              "flex-1 font-display text-3xl font-semibold tracking-tight transition-colors sm:text-4xl",
                              active ? "text-brand-300" : "text-ink group-hover:text-brand-300",
                            )}
                          >
                            {link.label}
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="size-5 text-ink-subtle transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-300"
                          />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.div variants={item} className="mt-8 grid gap-3 sm:grid-cols-2">
                <ButtonLink
                  href={bookingHref}
                  size="lg"
                  onClick={() => close(false)}
                  className="w-full"
                >
                  Book your detail
                </ButtonLink>
                <a href={siteConfig.phoneHref} className={buttonClasses("outline", "lg", "w-full")}>
                  <Phone className="size-4" aria-hidden="true" />
                  {siteConfig.phone}
                </a>
              </motion.div>

              <motion.div variants={item} className="mt-auto grid gap-8 pt-12 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-2 font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase">
                    <Clock className="size-3.5" aria-hidden="true" />
                    Hours
                  </p>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    {siteConfig.hours.map((h) => (
                      <div key={h.days} className="flex justify-between gap-4">
                        <dt className="text-ink-muted">{h.days}</dt>
                        <dd className="text-ink tabular-nums">
                          {h.close ? `${h.open} – ${h.close}` : h.open}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <p className="flex items-center gap-2 font-display text-xs font-semibold tracking-[0.2em] text-ink-subtle uppercase">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {hasStorefront ? "Visit us" : "Service area"}
                  </p>
                  {hasStorefront ? (
                    <address className="mt-3 text-sm leading-relaxed text-ink-muted not-italic">
                      {siteConfig.address.street}
                      <br />
                      {siteConfig.address.city}, {siteConfig.address.state} {siteConfig.address.zip}
                    </address>
                  ) : (
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      <span className="text-ink">Mobile only.</span> We come to your home or office
                      anywhere in the {siteConfig.region}, based in {baseLocation}.
                    </p>
                  )}
                  <SocialLinks className="mt-5" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
