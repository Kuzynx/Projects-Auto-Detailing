import { siteConfig } from "@/config/site";

export interface FaqItem {
  question: string;
  answer: string;
  category: "general" | "booking" | "services" | "coatings" | "mobile";
}

export const faqs: FaqItem[] = [
  {
    category: "general",
    question: "What is the difference between a car wash and a detail?",
    answer:
      "A car wash removes surface dirt. A detail restores and protects the vehicle: decontaminating paint, correcting defects, deep cleaning every interior surface and applying long-term protection. Our Signature Wash is the entry point; everything above it is restoration work.",
  },
  {
    category: "mobile",
    question: "Do you come to me or do I drop the car off?",
    answer: `We come to you. ${siteConfig.name} is fully mobile, so there is nothing to drop off and no shop to visit. Washes, interiors and the Full Detail happen in your driveway, at the office or wherever the car is parked anywhere in the ${siteConfig.region}. Paint correction and ceramic coatings are done in your garage or another covered space, because they need shade, still air and controlled lighting, which we bring with us.`,
  },
  {
    category: "mobile",
    question: "What do you need from me for a mobile appointment?",
    answer:
      "Just a parking spot with about three feet of clearance around the vehicle. Driveways, apartment lots and office parking all work. For paint correction and ceramic coatings we also need a garage or covered space for the day. You do not need to provide water or power: our rig carries its own water, generator and lighting, and we are fully insured.",
  },
  {
    category: "booking",
    question: "How far in advance should I book?",
    answer:
      "Mobile washes and interiors usually have availability within 2–4 days. Paint correction and coatings book 1–2 weeks out. Maintenance plan members get priority scheduling.",
  },
  {
    category: "booking",
    question: "What is your cancellation policy?",
    answer:
      "Reschedule or cancel free up to 24 hours before your appointment. Inside 24 hours we charge a $50 fee, which is credited toward your next booking. Weather cancellations on our side are always free.",
  },
  {
    category: "booking",
    question: "Do you take a deposit?",
    answer:
      "No deposit for washes, interiors or the Full Detail. Paint correction and ceramic coatings require a $150 deposit to reserve the full day on our schedule, applied to your final invoice.",
  },
  {
    category: "services",
    question: "How long does a detail take?",
    answer:
      "A Signature Wash takes about 1.5 hours, an Interior Refresh around 2 hours, and the Full Detail is a 4–6 hour appointment. Paint correction is a full day and ceramic coatings take two days in your garage, so the coating can cure out of the sun and wind.",
  },
  {
    category: "services",
    question: "Can you remove scratches?",
    answer:
      "If your fingernail does not catch in the scratch, it is almost certainly in the clear coat and we can remove or dramatically reduce it with paint correction. Deeper scratches that reach primer or metal need touch-up paint or a body shop; we will tell you honestly during the inspection.",
  },
  {
    category: "coatings",
    question: "Is a ceramic coating worth it?",
    answer:
      "If you keep a car more than two years, yes. A coating replaces waxing, makes washing twice as fast, resists chemical etching from bird droppings and bugs, and keeps gloss at a level that noticeably raises resale value. Our coatings carry a three-year written warranty.",
  },
  {
    category: "coatings",
    question: "How do I care for a coated car?",
    answer:
      "Hand wash with pH-neutral soap every two to four weeks, avoid automatic brush washes, and let us apply a booster at your annual inspection. We provide a full aftercare kit and guide with every coating.",
  },
  {
    category: "general",
    question: "Are you insured?",
    answer: `Yes. ${siteConfig.name} carries $2M in general liability and garage keepers coverage. Every technician is certified and background checked.`,
  },
  {
    category: "general",
    question: "What payment methods do you accept?",
    answer:
      "All major credit cards, Apple Pay, Google Pay, Zelle and cash. Invoices are sent by text and email when the job is complete.",
  },
  {
    category: "general",
    question: "What affects the price of my detail?",
    answer:
      "Three things: vehicle size, condition and the level of protection you want. Our published prices are starting points for a sedan, SUV or truck in normal condition. Heavy pet hair, sand, mold or smoke odor take extra time, and we quote that before we start, never after. Paint correction is priced after a paint-depth inspection so you only pay for the stages your paint actually needs.",
  },
  {
    category: "booking",
    question: "Do you offer gift cards?",
    answer:
      "Yes. Gift cards are available in any amount from $50, or for a specific service like the Full Detail. They are delivered by email with a printable card, never expire and can be applied to any service or maintenance plan. Call or send us a message and we will have one in your inbox the same day.",
  },
  {
    category: "services",
    question: "Do you detail fleets and commercial vehicles?",
    answer: `We do. We maintain fleets for dealerships, realtors, property managers and executive car services across ${siteConfig.address.city} and the ${siteConfig.region}, on site and on a schedule that works around your operating hours. Fleet accounts get volume pricing, a single monthly invoice and a dedicated point of contact. Choose Fleet and commercial on our contact form and we will build you a quote within one business day.`,
  },
  {
    category: "mobile",
    question: "What happens if the weather turns on my appointment day?",
    answer:
      "We watch the forecast for every booking. In summer we start as early as 7:00 AM to beat the desert heat, because hot panels make soap and polish flash before they can work. If high wind, blowing dust or the occasional storm is likely, we text you the day before with options: move into a garage or carport, or reschedule to the next open day at no charge. Interior-only services usually go ahead as planned.",
  },
  {
    category: "services",
    question: "How often should I have my car detailed?",
    answer:
      "For most daily drivers we recommend a full detail twice a year, spring and fall, with a maintenance wash every two to four weeks in between. Coated cars need even less: a maintenance wash and an annual inspection keep them at full gloss. Our Maintenance Plan puts this on autopilot at a lower per-visit price.",
  },
  {
    category: "services",
    question: "Can you clean child car seats?",
    answer:
      "Yes. We remove each seat, vacuum and steam the vehicle seat underneath, and clean the child seat shell and fabric with mild, fragrance-free products that follow manufacturer care guidance. We never machine-wash or chemically treat harness straps, since that can weaken the webbing, and we reinstall the seat exactly as we found it so you can verify the fit before we leave.",
  },
  {
    category: "coatings",
    question: "Should I coat a brand-new car?",
    answer:
      "New is the best time. Most new cars arrive with light marring from transport and dealer washes, so we do a single-stage polish to perfect the paint, then coat it before the desert sun, wind-blown grit and road grime get a chance to do damage. You lock in a showroom finish from day one.",
  },
  {
    category: "mobile",
    question: "Do I need to be home during a mobile appointment?",
    answer:
      "Only at the start and end. We do a quick walkaround with you on arrival and a final walkthrough when we finish. In between, you can work, run errands or head inside. For interior services, leave the keys with us or in a lockbox and we will text you when we are done.",
  },
];

export type FaqCategory = FaqItem["category"];

export const faqCategories: { id: FaqCategory; label: string }[] = [
  { id: "general", label: "General" },
  { id: "booking", label: "Booking" },
  { id: "services", label: "Services" },
  { id: "coatings", label: "Coatings" },
  { id: "mobile", label: "Mobile" },
];
