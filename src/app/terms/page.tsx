import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { siteConfig } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatPrice } from "@/lib/utils";

const LAST_UPDATED = "2026-10-02";

/**
 * Policy figures quoted in these terms. They mirror the FAQ (`src/data/faq.ts`) and the
 * work-vehicle note in `src/data/services.ts`; change them together. No service takes a deposit
 * and there is no cancellation fee: none was supplied by the client.
 */
const policy = {
  cancellationWindowHours: 24,
  /** Surcharge range for extremely dirty construction, farm or work vehicles. */
  workVehicleSurcharge: { min: 15, max: 30 },
  noShowGraceMinutes: 30,
  concernWindowHours: 48,
  quoteValidDays: 30,
} as const;

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms for booking ${siteConfig.name}: estimates and final pricing, the ${policy.cancellationWindowHours}-hour cancellation policy, vehicle condition and liability.`,
  path: "/terms",
});

const { name, legalName, email, phone, address } = siteConfig;
const surcharge = `${formatPrice(policy.workVehicleSurcharge.min)}–${formatPrice(policy.workVehicleSurcharge.max)}`;
const hours = `${policy.cancellationWindowHours} hours`;

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    content: (
      <>
        <p>
          These Terms of Service are an agreement between you and {legalName} (&ldquo;{name},&rdquo;
          &ldquo;we,&rdquo; &ldquo;us&rdquo;), a mobile auto detailing business based in California.
          They apply when you use this website, request an estimate or book any service with us,
          whether online, by phone, by text or in person.
        </p>
        <p>
          By booking, you confirm that you are at least 18 years old and that you own the vehicle or
          are authorized by its owner to have it serviced. Our{" "}
          <Link href="/privacy">Privacy Policy</Link> explains how we handle your information.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "Our services",
    content: (
      <>
        <p>
          We are a fully mobile business. We wash and detail vehicles, inside and out, at your home
          or workplace in {address.city} and across the {siteConfig.region}. What each package
          includes is described on our <Link href="/services">services pages</Link>.
        </p>
        <p>
          We may decline or stop work on a vehicle that is unsafe to work on, including vehicles
          with biohazards, active mold, pests, or mechanical or electrical faults that put our team
          at risk. If we stop for these reasons, you pay only for work already completed.
        </p>
      </>
    ),
  },
  {
    id: "pricing",
    title: "Estimates and final pricing",
    content: (
      <>
        <p>
          Prices on our website and in quotes are <strong>starting prices</strong> based on vehicle
          size and typical condition. Your final price is confirmed after we inspect the vehicle in
          person, before any work begins.
        </p>
        <p>
          The price may be higher than the starting price when a vehicle needs more time or
          materials, such as:
        </p>
        <ul>
          <li>Heavy pet hair, sand, mud, staining, smoke odor or spills.</li>
          <li>
            Extremely dirty vehicles (construction, farm or work vehicles, and any truck or SUV with
            caked mud or heavy grime): a {surcharge} surcharge, quoted on site before work starts.
          </li>
          <li>Oversized, lifted or modified vehicles beyond our standard size categories.</li>
        </ul>
        <p>
          <strong>We will never add a charge without your approval.</strong> If the inspection
          changes the price, we explain why and give you the new total first. If you decline, we
          perform the service you originally booked as far as is practical, at the original price.
          Written quotes are valid for {policy.quoteValidDays} days. Any applicable taxes are shown
          on your invoice.
        </p>
      </>
    ),
  },
  {
    id: "cancellations",
    title: "Cancellations, rescheduling and weather",
    content: (
      <ul>
        <li>
          <strong>With at least {hours}&rsquo; notice:</strong> reschedule or cancel free of charge,
          by text, phone or email.
        </li>
        <li>
          <strong>With less than {hours}&rsquo; notice:</strong> this is a late cancellation. Please
          still let us know as soon as you can so we can offer the slot to someone else. We do not
          take deposits for any service. If late cancellations or no-shows happen repeatedly, we may
          ask you to confirm the day before future appointments or decline to hold a slot.
        </li>
        <li>
          <strong>No-shows:</strong> if the vehicle is not available within{" "}
          {policy.noShowGraceMinutes} minutes of the appointment start, or we cannot access it, the
          appointment is treated as a late cancellation.
        </li>
        <li>
          <strong>Weather and safety:</strong> if rain, extreme heat, lightning or other conditions
          make mobile work unsafe or would compromise the result, we will reschedule at no charge
          and give you priority on the next available slot. Weather cancellations by us are always
          free.
        </li>
      </ul>
    ),
  },
  {
    id: "your-responsibilities",
    title: "Your responsibilities",
    content: (
      <ul>
        <li>
          We come to you
          {!siteConfig.claims.bringsWater && !siteConfig.claims.bringsPower
            ? ", but we do not carry our own water or power"
            : ""}
          . At the service location, please provide:
          <ul>
            {siteConfig.customerProvides.map((item) => (
              <li key={item}>{item}.</li>
            ))}
          </ul>
          If any of these are not available when we arrive, the appointment counts as a late
          cancellation.
        </li>
        <li>
          Make sure the location is safe and legal to work at, and that you have the property
          owner&rsquo;s, HOA&rsquo;s or building&rsquo;s permission for us to use it.
        </li>
        <li>
          Remove valuables, cash, documents and child seats before the appointment. We are not
          responsible for personal items left in the vehicle.
        </li>
        <li>
          Tell us about anything we should know: repainted or repaired panels, wraps, paint
          protection film, known damage, leaks, warning lights or electrical issues.
        </li>
        <li>
          Make the keys available so we can open doors, the trunk and the hood, and move the vehicle
          if needed.
        </li>
      </ul>
    ),
  },
  {
    id: "vehicle-condition",
    title: "Vehicle condition and pre-existing damage",
    content: (
      <>
        <p>
          Before we start, we walk around the vehicle with you where possible and photograph its
          condition. We note existing scratches, chips, dents, curb rash, interior wear and damage.
          We are not responsible for pre-existing damage, or for weaknesses that normal, careful
          detailing reveals, including:
        </p>
        <ul>
          <li>Failing, peeling or thin clear coat, and aftermarket or poorly bonded paint.</li>
          <li>
            Loose trim, emblems, moldings and clips; brittle or sun-damaged plastics and rubber.
          </li>
          <li>Worn, cracked or previously dyed leather, and dye transfer from clothing.</li>
          <li>Rock chips, prior body or paint repairs, and corrosion.</li>
          <li>Electrical faults caused by prior water intrusion or aftermarket wiring.</li>
        </ul>
      </>
    ),
  },
  {
    id: "satisfaction",
    title: "Inspection and our make-it-right promise",
    content: (
      <p>
        Please inspect the vehicle with us at handover. If you notice something we missed, tell us
        within {policy.concernWindowHours} hours, with photos where possible, and we will return to
        correct it at no charge. Re-servicing the affected area is our remedy for cosmetic concerns
        about the quality of the work. Because detailing services are consumed as they are
        performed, we do not offer refunds for completed work except where required by law.
      </p>
    ),
  },
  {
    id: "payment",
    title: "Payment",
    content: (
      <p>
        Payment is due when the work is complete. We send invoices by text and email and accept the
        payment methods listed in our <Link href="/faq">FAQ</Link>.
      </p>
    ),
  },
  {
    id: "photos",
    title: "Photos of your vehicle",
    content: (
      <p>
        We photograph every vehicle to document its condition and our work. We may also use photos
        in our gallery and on social media, always with license plates and personal details hidden.
        If you prefer we do not use photos of your vehicle for marketing, tell us at booking or at
        any time and we will not.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <>
        <p>
          If we damage your vehicle through our own negligence, we will, at our option, repair it at
          our cost through a qualified shop or reimburse the reasonable cost of repair. Please
          report any damage before we leave or within {policy.concernWindowHours} hours, so we can
          inspect it.
        </p>
        <p>
          To the fullest extent allowed by law, we are not liable for indirect or consequential
          losses such as loss of use, rental cars, lost time or diminished value. Apart from damage
          to your vehicle caused by our negligence, our total liability for any claim related to a
          service is limited to the amount you paid for that service.
        </p>
        <p>
          Nothing in these terms limits liability for fraud, gross negligence, willful misconduct or
          violation of law, or any right you have that cannot be waived under California law,
          including under the Consumers Legal Remedies Act and the Unfair Competition Law.
        </p>
      </>
    ),
  },
  {
    id: "website",
    title: "Use of this website",
    content: (
      <p>
        The text, photos, logo and design of this website belong to {name} or its licensors and may
        not be copied for commercial use without permission. Please provide accurate information in
        our forms and do not use the site to send spam or attempt to disrupt it. We work to keep
        prices and availability accurate; if we find an error, we will tell you before your
        appointment.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law and disputes",
    content: (
      <>
        <p>
          These terms are governed by the laws of the State of California, without regard to its
          conflict-of-law rules.
        </p>
        <p>
          If something goes wrong, please contact us first. Most concerns are resolved with a phone
          call, and we ask that you give us 30 days to try to resolve a dispute informally before
          starting legal action. Any claim that is not resolved will be heard in the state or
          federal courts located in San Bernardino County, California, and you and we consent to
          their jurisdiction. Either of us may bring a qualifying claim in small claims court.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        We may update these terms from time to time. The version in effect when you book applies to
        that booking. The &ldquo;Last updated&rdquo; date at the top of this page shows when they
        last changed.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        {legalName}, {address.street ? <>{address.street}, </> : null}
        {address.city}, {address.state} {address.zip}. Email <a href={`mailto:${email}`}>{email}</a>{" "}
        or call <a href={siteConfig.phoneHref}>{phone}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  const breadcrumbs = [{ label: "Terms of Service" }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="Clear terms for every booking: how pricing works, what happens if plans change, and how we treat your vehicle."
        breadcrumbs={breadcrumbs}
      />
      <LegalDocument
        lastUpdated={LAST_UPDATED}
        sections={sections}
        related={{ label: "Privacy Policy", href: "/privacy" }}
        summary={
          <>
            <p className="font-display font-semibold">The short version</p>
            <p className="text-ink-muted">
              Website prices are starting prices; we confirm the final price after inspection and
              never add charges without your OK. Cancel or reschedule free with {hours}&rsquo;
              notice. No deposits, and payment is due when the work is done.
            </p>
          </>
        }
      />
    </>
  );
}
