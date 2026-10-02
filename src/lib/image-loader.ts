/**
 * Image loader for static export (GitHub Pages). There is no image optimizer on a
 * static host, so every `next/image` resolves to the original file, prefixed with
 * the base path when the site lives under a sub-path such as /Projects-Auto-Detailing.
 * Only wired up when STATIC_EXPORT=true (see next.config.ts).
 */
export default function staticImageLoader({
  src,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${src.startsWith("/") ? src : `/${src}`}`;
}
