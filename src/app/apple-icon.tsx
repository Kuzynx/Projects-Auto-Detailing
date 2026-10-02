import { renderLogoIcon } from "@/lib/seo/og-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon from the real logo on brand black (Apple ignores transparency). */
export default function AppleIcon() {
  return renderLogoIcon(size.width);
}
