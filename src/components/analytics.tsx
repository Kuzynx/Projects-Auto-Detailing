import Script from "next/script";

/**
 * Google Analytics 4. Renders nothing unless NEXT_PUBLIC_GA_ID is set (e.g. "G-ABC123XYZ"),
 * so development, CI and preview builds send no data by default.
 *
 * Google signals and ad personalization are disabled so the privacy policy's "no advertising,
 * no cross-site tracking" statements hold.
 *
 * Render once in the root layout, after <Footer />:  <Analytics />
 * If you enable it, the CSP in next.config.ts adds the Google domains automatically
 * (the env var must be present at build time).
 */
const GA_ID_PATTERN = /^G-[A-Z0-9]{4,20}$/;

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
  // Validate before interpolating into an inline script.
  if (!gaId || !GA_ID_PATTERN.test(gaId)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{allow_google_signals:false,allow_ad_personalization_signals:false});`}
      </Script>
    </>
  );
}

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: GtagParams) => void;
  }
}

/**
 * Send a GA4 event from a client component. A no-op when GA is not loaded.
 * Suggested conversions: trackEvent("generate_lead", { form: "booking", service: slug, value: price }).
 */
export function trackEvent(eventName: string, params?: GtagParams) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", eventName, params);
}
