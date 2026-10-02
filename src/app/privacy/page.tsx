import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { LegalDocument, type LegalSection } from "@/components/legal/legal-document";
import { siteConfig } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

const LAST_UPDATED = "2026-10-02";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, protects and deletes the information you share when you book a detail, contact us or opt in to text updates.`,
  path: "/privacy",
});

const { name, legalName, email, phone, address } = siteConfig;
const mailto = `mailto:${email}`;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <>
        <p>
          {legalName} (&ldquo;{name},&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) is a Texas limited
          liability company providing mobile and studio auto detailing from {address.street},{" "}
          {address.city}, {address.state} {address.zip}. This policy explains what personal
          information we collect through this website, our booking and contact forms, phone, email
          and text messages, and how we use it.
        </p>
        <p>
          By using this website or booking a service, you agree to this policy. If you do not agree,
          please do not submit your information.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <h3>Information you give us</h3>
        <ul>
          <li>
            <strong>Booking form:</strong> your name, email address, mobile number, service address
            (for mobile appointments), vehicle year, make, model and size, the services and add-ons
            you choose, your preferred date and time, and any notes you add about the vehicle.
          </li>
          <li>
            <strong>Contact form, email and phone:</strong> your name, contact details and whatever
            you choose to tell us in your message.
          </li>
          <li>
            <strong>At your appointment:</strong> before-and-after photos of your vehicle, a record
            of its condition at inspection, paint-depth readings for correction work and, for
            ceramic coatings, the details we need to honor your warranty.
          </li>
          <li>
            <strong>Payments:</strong> we record the amount, date and method. Card payments are
            handled by our payment processor; we never see or store your full card number.
          </li>
        </ul>
        <h3>Information collected automatically</h3>
        <ul>
          <li>
            <strong>Server logs:</strong> IP address, browser type, device type, pages requested and
            timestamps. Our hosting provider keeps these to deliver and secure the site.
          </li>
          <li>
            <strong>Analytics (when enabled):</strong> pages viewed, time on page, approximate
            location (city level) and how you arrived at the site, collected through cookies. See{" "}
            <a href="#cookies">Cookies and analytics</a>.
          </li>
        </ul>
        <p>
          We do not collect Social Security numbers, driver&rsquo;s license numbers or other
          sensitive personal data, and we ask that you do not include them in messages.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How we use your information",
    content: (
      <ul>
        <li>To schedule, confirm, perform and follow up on the services you book.</li>
        <li>
          To send appointment confirmations, reminders, on-the-way notices, invoices and receipts.
        </li>
        <li>To answer questions and prepare estimates.</li>
        <li>
          To document vehicle condition before and after service, and to administer coating
          warranties.
        </li>
        <li>To understand which pages are useful and improve the website.</li>
        <li>To protect our customers, staff and website against fraud, spam and abuse.</li>
        <li>To meet tax, accounting and other legal obligations.</li>
        <li>
          To send occasional offers or maintenance reminders, only if you opt in. Every marketing
          email has an unsubscribe link.
        </li>
      </ul>
    ),
  },
  {
    id: "text-messages",
    title: "Text messages (SMS)",
    content: (
      <>
        <p>
          When you give us your mobile number and opt in on our booking or contact form, you agree
          to receive text messages from {name} about your appointments: confirmations, reminders,
          arrival notices, completion photos and invoices. Promotional texts are sent only if you
          separately opt in to them.
        </p>
        <ul>
          <li>Message frequency varies with your bookings. Message and data rates may apply.</li>
          <li>
            Reply <strong>STOP</strong> to any message to unsubscribe, or <strong>HELP</strong> for
            help. You can also call us at <a href={siteConfig.phoneHref}>{phone}</a>.
          </li>
          <li>Consent to receive texts is not a condition of purchasing any service.</li>
          <li>
            We do not sell, rent or share your mobile number or text-messaging opt-in data with
            third parties for their marketing purposes.
          </li>
          <li>Wireless carriers are not liable for delayed or undelivered messages.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and analytics",
    content: (
      <>
        <p>
          The site works without advertising or tracking cookies. We use only the cookies needed to
          run the site and, when analytics is enabled, Google Analytics 4 cookies (named{" "}
          <code className="text-ink">_ga</code> and <code className="text-ink">_ga_*</code>) that
          measure visits in aggregate. Google Analytics data is retained for 14 months and is not
          used for advertising or to identify you personally.
        </p>
        <p>
          You can block or delete cookies in your browser settings, or opt out of Google Analytics
          on every site with Google&rsquo;s{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            rel="noopener noreferrer"
            target="_blank"
          >
            browser opt-out add-on
          </a>
          . Blocking cookies does not affect your ability to book.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "How we share information",
    content: (
      <>
        <p>
          <strong>We do not sell your personal information</strong>, and we do not use it for
          targeted advertising or profiling. We share it only with:
        </p>
        <ul>
          <li>
            <strong>Service providers</strong> who help us run the business, under contracts that
            limit their use of your data: website hosting, email delivery, text messaging, payment
            processing, scheduling and analytics.
          </li>
          <li>
            <strong>Authorities</strong>, when required by law, subpoena or court order, or to
            protect the rights and safety of our customers, staff or the public.
          </li>
          <li>
            <strong>A successor business</strong>, if {name} is sold or merged, in which case this
            policy continues to apply to your information.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    content: (
      <ul>
        <li>
          <strong>Booking and service records</strong>, including condition photos: three years
          after your last service, or for the length of any coating warranty plus one year,
          whichever is longer.
        </li>
        <li>
          <strong>Contact inquiries</strong> that do not become a booking: 12 months.
        </li>
        <li>
          <strong>Text-messaging consent and opt-out records</strong>: for as long as you are
          subscribed, plus four years, so we can prove consent and honor opt-outs.
        </li>
        <li>
          <strong>Analytics data</strong>: 14 months. <strong>Server logs</strong>: up to 30 days.
        </li>
        <li>
          <strong>Payment and tax records</strong>: as long as Texas and federal tax law requires.
        </li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "How we protect information",
    content: (
      <p>
        The site is served only over encrypted HTTPS connections. Access to customer records is
        limited to the staff who need them to do their job, our accounts use multi-factor
        authentication where available, and card payments are handled by a PCI-compliant processor.
        No system is perfectly secure, so if we ever learn of a breach that affects your
        information, we will notify you as required by Texas law.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your choices and rights",
    content: (
      <>
        <p>Whatever state you live in, you can ask us to:</p>
        <ul>
          <li>
            Confirm whether we hold personal information about you, and give you a copy in a
            portable format.
          </li>
          <li>Correct information that is inaccurate.</li>
          <li>
            Delete your information, unless we must keep it for legal, tax or warranty reasons.
          </li>
          <li>Stop sending you marketing emails or texts.</li>
        </ul>
        <p>
          Texas residents have these rights under the Texas Data Privacy and Security Act. To make a
          request, email <a href={mailto}>{email}</a> or call{" "}
          <a href={siteConfig.phoneHref}>{phone}</a>. We will verify your identity using the contact
          details on your booking and respond within 45 days. If we decline your request, you may
          appeal by replying to our decision within 60 days; if you disagree with the outcome of the
          appeal, you may contact the{" "}
          <a
            href="https://www.texasattorneygeneral.gov/consumer-protection"
            rel="noopener noreferrer"
            target="_blank"
          >
            Texas Attorney General
          </a>
          . We will never charge you or treat you differently for exercising these rights.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        This website is not directed to children under 13, and we do not knowingly collect their
        information. Services must be booked by an adult. If you believe a child has sent us
        personal information, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "links",
    title: "Other websites",
    content: (
      <p>
        Our site links to social media profiles, Google reviews and maps. Those services have their
        own privacy policies, and we are not responsible for how they handle your information.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        We may update this policy as our services or the law change. The &ldquo;Last updated&rdquo;
        date at the top of this page shows when it last changed. If we make a material change to how
        we use information you have already given us, we will tell you by email or text before it
        takes effect.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    content: (
      <p>
        Questions or requests about your privacy: email <a href={mailto}>{email}</a>, call{" "}
        <a href={siteConfig.phoneHref}>{phone}</a> or write to {legalName}, {address.street},{" "}
        {address.city}, {address.state} {address.zip}. You can also use our{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  const breadcrumbs = [{ label: "Privacy Policy" }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect when you book or get in touch, why we need it, how long we keep it and how to have it deleted. Plain English, no surprises."
        breadcrumbs={breadcrumbs}
      />
      <LegalDocument
        lastUpdated={LAST_UPDATED}
        sections={sections}
        related={{ label: "Terms of Service", href: "/terms" }}
        summary={
          <>
            <p className="font-display font-semibold">The short version</p>
            <p className="text-ink-muted">
              We use your details to book, perform and invoice your detail, and to text you about
              your appointment if you opt in. We never sell your information or share your number
              for marketing. Ask us any time and we will show you or delete what we hold.
            </p>
          </>
        }
      />
    </>
  );
}
