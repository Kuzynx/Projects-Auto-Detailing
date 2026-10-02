// Required for static export (output: "export"); harmless on Node hosts.
export const dynamic = "force-static";

import { renderMonogramIcon } from "@/lib/seo/og-image";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** 32px favicon: the full badge is illegible this small, so a purple "P" monogram is used. */
export default function Icon() {
  return renderMonogramIcon(size.width);
}
