/**
 * Shared renderers for the generated social card (`app/opengraph-image.tsx`,
 * `app/twitter-image.tsx`) and app icons (`app/icon.tsx`, `app/apple-icon.tsx`).
 *
 * Runs at build time only (the routes are statically optimized). No network: the logo
 * is read from /public and text uses the font bundled with `next/og`.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { socialImageSize, socialLocationLine } from "./social";

/**
 * Brand colors for Satori, which cannot read CSS variables.
 * Mirrors the tokens in `src/app/globals.css`; update both together.
 */
export const ogColors = {
  bg: "#09090b",
  surface: "#141417",
  ink: "#f2f2f3",
  inkMuted: "#b8b7ba",
  inkSubtle: "#77767a",
  brand300: "#e4c0fc",
  brand400: "#d6a8f8",
  brand500: "#c796f0",
  brand700: "#7f4db3",
  /** Polished-chrome gradient for display text and rules. */
  chrome: "linear-gradient(180deg, #ffffff 0%, #e4e4e7 38%, #a1a1aa 62%, #f4f4f5 100%)",
} as const;

/** Intrinsic size of `siteConfig.logoTransparent` (trimmed shield badge on alpha). */
const LOGO_RATIO = 947 / 929;

/** Read a PNG from /public and return it as a data URI Satori can draw. */
export async function readPublicPng(publicPath: string) {
  const data = await readFile(join(process.cwd(), "public", publicPath));
  return `data:image/png;base64,${data.toString("base64")}`;
}

/** 1200x630 social card: real logo left; city, chrome tagline and proof points right; purple accents. */
export async function renderSocialImage() {
  const logo = await readPublicPng(siteConfig.logoTransparent);
  const { googleRating, reviewCount, vehiclesDetailed } = siteConfig.stats;
  const logoHeight = 420;
  // "Showroom finish. Delivered to your driveway." -> one sentence per line.
  const taglineLines = siteConfig.tagline.match(/[^.]+\.?/g)?.map((line) => line.trim()) ?? [
    siteConfig.tagline,
  ];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: ogColors.bg,
        backgroundImage: `radial-gradient(circle at 24% 50%, rgba(199, 150, 240, 0.22) 0%, rgba(9, 9, 11, 0) 46%), radial-gradient(circle at 100% 0%, rgba(127, 77, 179, 0.28) 0%, rgba(9, 9, 11, 0) 40%)`,
        padding: "0 72px 0 56px",
        position: "relative",
      }}
    >
      {/* Purple accent bar along the left edge. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          backgroundImage: `linear-gradient(180deg, ${ogColors.brand300}, ${ogColors.brand500} 50%, ${ogColors.brand700})`,
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only */}
      <img
        src={logo}
        alt=""
        width={Math.round(logoHeight * LOGO_RATIO)}
        height={logoHeight}
        style={{ flexShrink: 0 }}
      />
      <div style={{ display: "flex", flexDirection: "column", marginLeft: 48, flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            letterSpacing: 3,
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            color: ogColors.brand400,
          }}
        >
          {socialLocationLine}
        </div>
        {/* The logo carries the name, so the headline is the promise, in chrome. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
            fontSize: 62,
            lineHeight: 1.08,
            letterSpacing: -1.5,
          }}
        >
          {/* Gradient per sentence so each line gets the full chrome sweep. */}
          {taglineLines.map((line) => (
            <span
              key={line}
              style={{
                backgroundImage: ogColors.chrome,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {line}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            width: 96,
            height: 5,
            marginTop: 32,
            borderRadius: 999,
            backgroundColor: ogColors.brand500,
          }}
        />
        <div style={{ display: "flex", marginTop: 30, fontSize: 26, color: ogColors.ink }}>
          Paint correction · Ceramic coatings · Interiors
        </div>
        <div style={{ display: "flex", marginTop: 14, fontSize: 22, color: ogColors.inkMuted }}>
          {`${googleRating} Google rating · ${reviewCount} reviews · ${vehiclesDetailed.toLocaleString("en-US")}+ vehicles`}
        </div>
      </div>
    </div>,
    { ...socialImageSize },
  );
}

/** Square app icon from the real logo, centered on the brand black with breathing room. */
export async function renderLogoIcon(size: number) {
  const logo = await readPublicPng(siteConfig.logoTransparent);
  const height = Math.round(size * 0.84);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ogColors.bg,
        backgroundImage:
          "radial-gradient(circle at 50% 40%, rgba(199, 150, 240, 0.18) 0%, rgba(9, 9, 11, 0) 70%)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only */}
      <img src={logo} alt="" width={Math.round(height * LOGO_RATIO)} height={height} />
    </div>,
    { width: size, height: size },
  );
}

/**
 * Favicon-size mark. The full badge is illegible at 32px, so this is a simplified
 * monogram: a purple "P" inside a chrome ring on brand black.
 */
export function renderMonogramIcon(size: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ogColors.bg,
        borderRadius: size * 0.22,
        border: `${Math.max(1, Math.round(size / 16))}px solid #d4d4d8`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: size * 0.7,
          lineHeight: 1,
          marginTop: -size * 0.04,
          color: ogColors.brand500,
          // Only a regular weight ships with next/og; a matching stroke reads as bold.
          WebkitTextStroke: `${(size * 0.045).toFixed(2)}px ${ogColors.brand500}`,
        }}
      >
        P
      </div>
    </div>,
    { width: size, height: size },
  );
}
