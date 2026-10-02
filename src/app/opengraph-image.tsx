// Required for static export (output: "export"); harmless on Node hosts.
export const dynamic = "force-static";

import { renderSocialImage } from "@/lib/seo/og-image";
import { socialImageAlt, socialImageSize } from "@/lib/seo/social";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = "image/png";

/** Social card, prerendered at build. Design lives in `src/lib/seo/og-image.tsx`. */
export default function OpengraphImage() {
  return renderSocialImage();
}
