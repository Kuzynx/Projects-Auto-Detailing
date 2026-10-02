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
    answer:
      "Both. Washes, interior work and the Full Detail are available mobile anywhere in our service area. We bring our own water, power and lighting. Paint correction and ceramic coatings are done in our climate-controlled South Austin studio because they need dust-free conditions and controlled lighting.",
  },
  {
    category: "mobile",
    question: "What do you need from me for a mobile appointment?",
    answer:
      "Just a parking spot with about three feet of clearance around the vehicle. Driveways, apartment lots and office garages all work. We are fully self-contained and insured.",
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
      "No deposit for washes, interiors or the Full Detail. Paint correction and ceramic coatings require a $150 deposit to hold the studio bay, applied to your final invoice.",
  },
  {
    category: "services",
    question: "How long does a detail take?",
    answer:
      "A Signature Wash takes about 1.5 hours, an Interior Refresh around 2 hours, and the Full Detail is a 4–6 hour appointment. Paint correction is a full day and ceramic coatings are a two-day studio service.",
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
    answer:
      "Yes. Meridian Detail Co. carries $2M in general liability and garage keepers coverage. Every technician is certified and background checked.",
  },
  {
    category: "general",
    question: "What payment methods do you accept?",
    answer:
      "All major credit cards, Apple Pay, Google Pay, Zelle and cash. Invoices are sent by text and email when the job is complete.",
  },
];
