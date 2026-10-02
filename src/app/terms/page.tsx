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
 * ceramic coating copy in `src/data/services.ts`; change them together.
 */
const policy = {
  cancellationWindowHours: 24,
  lateCancellationFee: 50,
  studioDeposit: 150,
  noShowGraceMinutes: 30,
  concernWindowHours: 48,
  coatingWarrantyYears: 3,
  coatingWarrantyUpgradeYears: 5,
  quoteValidDays: 30,
} as const;

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: `The terms for booking ${siteConfig.name}: estimates and final pricing, deposits, the ${policy.cancellationWindowHours}-hour cancellation policy, vehicle condition, ceramic coating warranty and liability.`,
  path: "/terms",
});

const { name, legalName, email, phone, address } = siteConfig;
const fee = formatPrice(policy.lateCancellationFee);
const deposit = formatPrice(policy.studioDeposit);
const hours = `${policy.cancellationWindowHours} hours`;

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    content: (
      <>
        <p>
          These Terms of Service are an agreement between you and {legalName} (&ldquo;{name},&rdquo;
          &ldquo;we,&rdquo; &ldquo;us&rdquo;), a Texas limited liability company. They apply when
          you use this website, request an estimate or book any service with us, whether online, by
          phone, by text or in person.
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
          We provide exterior and interior detailing, paint correction, ceramic coatings and
          recurring maintenance services, either at your location (mobile) or at our {address.city}{" "}
          studio. What each service includes is described on our{" "}
          <Link href="/services">services pages</Link>. Paint correction and ceramic coatings are
          performed in our studio because they need controlled lighting and a dust-free environment.
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
          <li>Heavily oxidized, contaminated or previously mis-polished paint.</li>
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
    id: "deposits",
    title: "Booking and deposits",
    content: (
      <>
        <p>
          Washes, interior services and the Full Detail require no deposit. Paint correction and
          ceramic coatings require a <strong>{deposit} deposit</strong> to reserve studio time. The
          deposit is applied in full to your final invoice.
        </p>
        <p>
          If you cancel a studio booking at least {hours} before your appointment, we refund your
          deposit in full. If you cancel later, or do not show, we keep the {fee} late-cancellation
          fee from the deposit and refund the balance or hold it as credit, whichever you prefer.
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
          <strong>More than {hours} before your appointment:</strong> reschedule or cancel free of
          charge.
        </li>
        <li>
          <strong>Within {hours}:</strong> a {fee} late-cancellation fee applies. For services
          without a deposit, the fee is credited toward your next booking with us.
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
          For mobile service, provide a safe, legal place to work with about three feet of clearance
          around the vehicle, and make sure you have the property owner&rsquo;s, HOA&rsquo;s or
          building&rsquo;s permission. We bring our own water and power.
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
        <h3>Paint correction</h3>
        <p>
          Correction works by removing a very thin layer of clear coat. We measure paint depth on
          every panel and will limit or stop correction where paint is too thin to do safely.
          Scratches through the clear coat, rock chips and deep etching cannot be fully removed by
          polishing. Figures such as &ldquo;up to 90% defect removal&rdquo; describe typical results
          on sound factory paint and are not a guarantee for every vehicle.
        </p>
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
    id: "coating-warranty",
    title: "Ceramic coating warranty",
    content: (
      <>
        <p>
          Our professional ceramic coatings come with a{" "}
          <strong>{policy.coatingWarrantyYears}-year written warranty</strong> from the date of
          application, or {policy.coatingWarrantyUpgradeYears} years where the upgrade was
          purchased. Your warranty certificate is issued with your invoice.
        </p>
        <h3>What is covered</h3>
        <p>
          If the coating fails under normal use, meaning it loses its hydrophobic (water-beading)
          behavior or gloss, or shows application defects such as high spots or hazing, we will
          polish and re-coat the affected panels at no charge.
        </p>
        <h3>Conditions</h3>
        <ul>
          <li>
            Wash the vehicle by hand with a pH-neutral soap every two to four weeks, as described in
            your aftercare guide.
          </li>
          <li>Avoid automatic car washes that use brushes or harsh chemicals.</li>
          <li>
            Bring the vehicle to our studio for its included annual inspection and top-up within 30
            days of each anniversary of application.
          </li>
        </ul>
        <h3>What is not covered</h3>
        <ul>
          <li>Scratches, swirls, rock chips, dents and collision, vandalism or theft damage.</li>
          <li>
            Etching or staining from bird droppings, tree sap, bug residue, hard water or industrial
            fallout left on the vehicle for an extended period.
          </li>
          <li>Damage from abrasive polishes, harsh chemicals or improper washing.</li>
          <li>Panels repainted, wrapped or repaired after the coating was applied.</li>
          <li>
            Normal wear of coatings on glass, wheels and trim, which wear faster than coatings on
            paint.
          </li>
        </ul>
        <p>
          The warranty stays with the vehicle. If you sell it, the new owner can keep the coverage
          by contacting us within 30 days of purchase.
        </p>
      </>
    ),
  },
  {
    id: "payment",
    title: "Payment",
    content: (
      <p>
        Payment is due when the work is complete. We send invoices by text and email and accept the
        payment methods listed in our <Link href="/faq">FAQ</Link>. Recurring maintenance visits are
        billed per visit, with no contract; you can pause or cancel at any time.
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
          {name} carries general liability and garagekeepers insurance. If we damage your vehicle
          through our own negligence, we will, at our option, repair it at our cost through a
          qualified shop or reimburse the reasonable cost of repair. Please report any damage before
          we leave or within {policy.concernWindowHours} hours, so we can inspect it.
        </p>
        <p>
          To the fullest extent allowed by law, we are not liable for indirect or consequential
          losses such as loss of use, rental cars, lost time or diminished value. Apart from damage
          to your vehicle caused by our negligence, our total liability for any claim related to a
          service is limited to the amount you paid for that service.
        </p>
        <p>
          Nothing in these terms limits liability for gross negligence or willful misconduct, or any
          right you have that cannot be waived under Texas law, including under the Texas Deceptive
          Trade Practices&ndash;Consumer Protection Act.
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
          These terms are governed by the laws of the State of Texas, without regard to its
          conflict-of-law rules.
        </p>
        <p>
          If something goes wrong, please contact us first. Most concerns are resolved with a phone
          call, and we ask that you give us 30 days to try to resolve a dispute informally before
          starting legal action. Any claim that is not resolved will be heard in the state or
          federal courts located in Travis County, Texas, and you and we consent to their
          jurisdiction. Either of us may bring a qualifying claim in justice (small claims) court.
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
        {legalName}, {address.street}, {address.city}, {address.state} {address.zip}. Email{" "}
        <a href={`mailto:${email}`}>{email}</a> or call <a href={siteConfig.phoneHref}>{phone}</a>.
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
        description="Clear terms for every booking: how pricing works, what happens if plans change, how we treat your vehicle and what our coating warranty covers."
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
              never add charges without your OK. Cancel free up to {hours} ahead; later
              cancellations cost {fee}. Studio services need a {deposit} deposit, applied to your
              invoice. Ceramic coatings carry a {policy.coatingWarrantyYears}-year written warranty.
            </p>
          </>
        }
      />
    </>
  );
}
