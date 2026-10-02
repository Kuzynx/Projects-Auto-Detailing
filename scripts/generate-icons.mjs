/**
 * Generates the static app icons in /public from the logo. Run after changing the logo or
 * brand colors, then commit the output:
 *
 *   pnpm icons
 *
 * Output (static files work on every host, including GitHub Pages under a sub-path, where
 * Next's generated /icon and /apple-icon routes lose the base path):
 *   public/favicon.ico      16, 32 and 48 px "P" monogram (PNG-in-ICO)
 *   public/icon.png         32 px monogram, the browser-tab icon
 *   public/apple-icon.png   180 px logo badge on brand black (iOS home screen)
 *   public/icon-192.png     192 px logo badge (web app manifest)
 *   public/icon-512.png     512 px logo badge (web app manifest)
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createElement as h } from "react";
// next has no "exports" map, so ESM needs the file extension.
import { ImageResponse } from "next/og.js";

const root = process.cwd();
/** Mirrors siteConfig.logoTransparent (947x929, trimmed shield on alpha). */
const LOGO = "public/images/logo-transparent.png";
const LOGO_RATIO = 947 / 929;
/** Mirrors --color-bg and --color-brand-500 in src/app/globals.css. */
const BG = "#09090b";
const BRAND = "#c796f0";
const CHROME = "#d4d4d8";

const logo = `data:image/png;base64,${(await readFile(join(root, LOGO))).toString("base64")}`;

async function png(element, size) {
  const response = new ImageResponse(element, { width: size, height: size });
  return Buffer.from(await response.arrayBuffer());
}

/** Purple "P" in a chrome ring: the full badge is illegible at favicon sizes. */
function monogram(size) {
  return png(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BG,
          borderRadius: size * 0.22,
          border: `${Math.max(1, Math.round(size / 16))}px solid ${CHROME}`,
        },
      },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: size * 0.7,
            lineHeight: 1,
            marginTop: -size * 0.04,
            color: BRAND,
            // Only a regular weight ships with next/og; a matching stroke reads as bold.
            WebkitTextStroke: `${(size * 0.045).toFixed(2)}px ${BRAND}`,
          },
        },
        "P",
      ),
    ),
    size,
  );
}

/** The real logo badge centered on brand black (Apple ignores transparency). */
function badge(size) {
  const height = Math.round(size * 0.84);
  return png(
    h(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BG,
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(199, 150, 240, 0.18) 0%, rgba(9, 9, 11, 0) 70%)",
        },
      },
      h("img", { src: logo, alt: "", width: Math.round(height * LOGO_RATIO), height }),
    ),
    size,
  );
}

/** ICO container with embedded PNG images (supported by every current browser). */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const out = (name) => join(root, "public", name);
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await monogram(size) })),
);

await writeFile(out("favicon.ico"), ico(icoImages));
await writeFile(out("icon.png"), icoImages.find((i) => i.size === 32).data);
await writeFile(out("apple-icon.png"), await badge(180));
await writeFile(out("icon-192.png"), await badge(192));
await writeFile(out("icon-512.png"), await badge(512));

console.log("Wrote public/favicon.ico, icon.png, apple-icon.png, icon-192.png, icon-512.png");
