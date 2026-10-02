import type { Metadata } from "next";
import { defaultOgImage } from "@/lib/seo/metadata";
import { CtaBanner } from "@/components/layout/cta-banner";
import { BeforeAfter } from "@/components/home/before-after";
import { Differentiators } from "@/components/home/differentiators";
import { FaqTeaser } from "@/components/home/faq-teaser";
import { GalleryTeaser } from "@/components/home/gallery-teaser";
import { Hero } from "@/components/home/hero";
import { MeetKevin } from "@/components/home/meet-kevin";
import { Process } from "@/components/home/process";
import { RevealNoScript } from "@/components/home/reveal-noscript";
import { ServiceArea } from "@/components/home/service-area";
import { ServicesShowcase } from "@/components/home/services-showcase";
import { StatsBar } from "@/components/home/stats-bar";
import { Testimonials } from "@/components/home/testimonials";
import { siteConfig } from "@/config/site";

const title = `${siteConfig.name} | Mobile Car Washes & Detailing in ${siteConfig.address.city}, ${siteConfig.address.state}`;
const description = `${siteConfig.tagline} Owner-operated mobile detailing across ${siteConfig.address.city} and the ${siteConfig.region} since ${siteConfig.founder.since}: hand washes, exterior details and full inside-and-out details at your home or office, plus a package for working trucks. Published prices, before and after photos on every job.`;

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
    images: [{ ...defaultOgImage, alt: `${siteConfig.name}: ${siteConfig.tagline}` }],
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
      <MeetKevin />
      <Process />
      <Differentiators />
      <Testimonials />
      <GalleryTeaser />
      <ServiceArea />
      <FaqTeaser />
      <CtaBanner description="Pick a service, your vehicle size and a time. It takes about a minute, and you get a confirmation by text." />
    </>
  );
}
