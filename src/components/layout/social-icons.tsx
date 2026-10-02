import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/*
 * Brand glyphs. lucide-react v1 ships no brand icons, so these are minimal
 * single-path marks sized to sit beside lucide icons (24px grid, currentColor).
 */

type IconProps = React.ComponentProps<"svg">;

function Svg({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={cn("size-5", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <Svg
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3Z" />
    </Svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M16.6 3c.3 2.2 1.6 3.7 3.9 3.9v2.6c-1.4.1-2.6-.3-3.9-1.1v6.1c0 3.6-2.9 5.9-6 5.5-2.6-.3-4.6-2.6-4.4-5.4.2-3.1 3-5.2 6-4.7v2.8c-.3-.1-.7-.2-1-.2-1.4 0-2.4 1.1-2.3 2.5.1 1.2 1.1 2.1 2.3 2.1 1.4 0 2.4-1 2.4-2.6V3h3Z" />
    </Svg>
  );
}

export function GoogleIcon(props: IconProps) {
  return (
    <Svg fill="currentColor" {...props}>
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
      <path
        d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
        opacity=".85"
      />
      <path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" opacity=".7" />
      <path
        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z"
        opacity=".85"
      />
    </Svg>
  );
}

export const socialLinks = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
  { label: "Google", href: siteConfig.social.google, Icon: GoogleIcon },
].filter((link): link is typeof link & { href: string } => Boolean(link.href));

/** Row of circular social links. Works in server and client trees. */
export function SocialLinks({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {socialLinks.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${siteConfig.shortName} on ${label} (opens in a new tab)`}
            className={cn(
              "grid size-10 place-items-center rounded-full border border-border-strong text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-300",
              linkClassName,
            )}
          >
            <Icon className="size-[18px]" />
          </a>
        </li>
      ))}
    </ul>
  );
}
