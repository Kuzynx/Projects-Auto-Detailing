export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Book in 60 seconds",
    description: "Pick a service, your vehicle size and a time. You get a confirmation by text.",
  },
  {
    step: 2,
    title: "We come to you",
    description:
      "Driveway, garage or office lot anywhere in the High Desert. You provide a hose spigot and an outlet; we bring the rest.",
  },
  {
    step: 3,
    title: "Walkaround and plan",
    description:
      "We walk the car together, point out anything worth knowing, and agree on the plan and the price before touching anything.",
  },
  {
    step: 4,
    title: "The work",
    description:
      "Kevin does the work himself: pH-neutral products, the two-bucket method, and a checklist for every panel and surface.",
  },
  {
    step: 5,
    title: "Handover and aftercare",
    description:
      "Final walkthrough, before and after photos, and simple care tips so the finish lasts.",
  },
];

/** Honest, verifiable reasons to book. No certifications, insurance or warranty claims here. */
export const differentiators = [
  {
    title: "Owner-operated",
    description:
      "Kevin details every car himself. The person you book is the person who does the work, start to finish.",
  },
  {
    title: "Fully mobile",
    description:
      "Driveway, garage or office lot anywhere in the High Desert. Book online and Kevin comes to you.",
  },
  {
    title: "Two-bucket method",
    description:
      "Separate wash and rinse buckets with a clean mitt, so the grit that causes swirl marks never goes back on your paint.",
  },
  {
    title: "pH-neutral products",
    description:
      "Gentle on paint, wax, sealants, trim and rubber. Nothing harsh that strips protection or dries out plastics.",
  },
  {
    title: "Transparent pricing",
    description:
      "Published starting prices by vehicle size. If your car needs extra time, you hear about it before we start, never after.",
  },
  {
    title: "Made right, or I come back",
    description:
      "Every job is photographed before and after. If something isn't right, I come back and fix it.",
  },
];
