import type { Metadata } from "next";
import { CtaBanner } from "@/components/layout/cta-banner";
import { BeforeAfter } from "@/components/home/before-after";
import { Differentiators } from "@/components/home/differentiators";
import { FaqTeaser } from "@/components/home/faq-teaser";
import { GalleryTeaser } from "@/components/home/gallery-teaser";
import { Hero } from "@/components/home/hero";
import { Process } from "@/components/home/process";
import { RevealNoScript } from "@/components/home/reveal-noscript";
import { ServiceArea } from "@/components/home/service-area";
import { ServicesShowcase } from "@/components/home/services-showcase";
import { StatsBar } from "@/components/home/stats-bar";
import { Testimonials } from "@/components/home/testimonials";
import { siteConfig } from "@/config/site";

const title = `${siteConfig.name} | Mobile Detailing, Paint Correction & Ceramic Coating in ${siteConfig.address.city}, ${siteConfig.address.state}`;
const description = `${siteConfig.tagline} Mobile and studio detailing across greater ${siteConfig.address.city}: hand washes, interior resets, paint correction and ceramic coatings with a 3-year written warranty. Rated ${siteConfig.stats.googleRating} from ${siteConfig.stats.reviewCount} reviews.`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    locale: "en_US",
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomePage() {
  return (
    <>
      <RevealNoScript />
      <Hero />
      <StatsBar />
      <ServicesShowcase />
      <BeforeAfter />
      <Process />
      <Differentiators />
      <Testimonials />
      <GalleryTeaser />
      <ServiceArea />
      <FaqTeaser />
      <CtaBanner description="Pick a service, your vehicle size and a time. It takes about a minute, and we confirm by text within the hour." />
    </>
  );
}
