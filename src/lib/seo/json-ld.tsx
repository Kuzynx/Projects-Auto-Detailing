// STUB: the SEO agent owns this file and will add builders (localBusiness, service, faqPage, breadcrumb).
// Other agents: render structured data with <JsonLd data={...} />.

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
