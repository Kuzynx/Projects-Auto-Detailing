import { Store } from "lucide-react";
import { siteConfig } from "@/config/site";

/**
 * Brand marks are not shipped with lucide-react v1, so we draw simple outline
 * versions that match lucide's 24px / 2px-stroke style.
 */
type IconProps = React.ComponentProps<"svg">;

const base = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 3c.4 2.6 2.1 4.3 5 4.6v3.1c-1.9 0-3.6-.6-5-1.6V15a6 6 0 1 1-6-6v3.2A2.8 2.8 0 1 0 11.8 15V3z" />
    </svg>
  );
}

/** Social profiles in display order, read from site config. */
export const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
  { label: "Google", href: siteConfig.social.google, Icon: Store },
] as const;

/** "@handle" derived from a profile URL. */
export function socialHandle(url: string) {
  const last = url.replace(/\/+$/, "").split("/").pop() ?? "";
  return last.startsWith("@") ? last : `@${last}`;
}
