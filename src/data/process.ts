export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  { step: 1, title: "Book in 60 seconds", description: "Pick a service, your vehicle size and a time. We confirm by text within the hour." },
  { step: 2, title: "We come to you", description: "Our fully self-contained mobile unit arrives with water, power and lighting. Studio services get white-glove pickup." },
  { step: 3, title: "Inspection and walkthrough", description: "We walk the car with you, measure paint where relevant, and agree on the plan before touching anything." },
  { step: 4, title: "The work", description: "Certified technicians, professional-grade products, and a checklist for every panel and surface." },
  { step: 5, title: "Delivery and aftercare", description: "Final walkthrough, photo documentation, and a care guide so the finish lasts." },
];

export const differentiators = [
  { title: "Certified technicians", description: "IDA-certified detailers with a minimum of three years of experience. No trainees on your car." },
  { title: "Paint-depth measured", description: "We gauge every panel before correction so we never take more clear coat than needed." },
  { title: "Written warranty", description: "Every ceramic coating carries a three-year written warranty with annual inspections included." },
  { title: "Fully insured", description: "$2M general liability and garage keepers coverage on every job, mobile or studio." },
  { title: "Transparent pricing", description: "Published starting prices by vehicle size. No surprise upsells at the end." },
  { title: "Satisfaction guaranteed", description: "If something is not right, we come back and fix it at no charge. Full stop." },
];
