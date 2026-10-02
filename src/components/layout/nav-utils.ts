/** True when `href` is the current page or one of its children (e.g. /services/ceramic-coating). */
export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The site header is sticky and transparent at the top of the page. A full-bleed
 * hero opts into sitting underneath it by pulling itself up by the header height.
 * Pair it with top padding of at least `headerHeightPadding` (plus breathing room).
 */
export const heroUnderlapClass = "-mt-16 lg:-mt-20";
export const headerHeightPadding = "pt-16 lg:pt-20";
