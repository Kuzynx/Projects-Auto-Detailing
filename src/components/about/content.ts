import { Eye, Gauge, Handshake, Timer, type LucideIcon } from "lucide-react";

/**
 * About-page copy. Team members are representative profiles for the site build;
 * replace with the client's real staff before launch.
 */
export const founder = {
  name: "Luis Herrera",
  role: "Founder and lead detailer",
  credential: "IDA Certified Detailer",
} as const;

export const values: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    Icon: Gauge,
    title: "Measure before we touch",
    description:
      "Paint is read with a depth gauge on every panel before a pad spins. Decisions come from numbers, not guesses.",
  },
  {
    Icon: Eye,
    title: "Honest scope",
    description:
      "If a scratch is through the clear coat, we say so. We quote what your car needs, not what earns the biggest ticket.",
  },
  {
    Icon: Handshake,
    title: "Own the outcome",
    description:
      "Not right? We come back and fix it at no charge. Every coating carries a 3-year written warranty.",
  },
  {
    Icon: Timer,
    title: "Respect your time",
    description:
      "Bookings are confirmed by text within the hour. We arrive when we say we will and keep the walkthrough short and clear.",
  },
];

export const standards: { title: string; description: string }[] = [
  {
    title: "Two-bucket hand wash, every time",
    description:
      "One bucket for soap, one for rinsing the mitt, grit guards in both. Dirt stays at the bottom instead of being dragged across your paint.",
  },
  {
    title: "pH-neutral soaps and dedicated chemistry",
    description:
      "Gentle on coatings, wax, rubber and trim. Iron removers and degreasers are matched to the surface, never one bottle for everything.",
  },
  {
    title: "Paint-depth gauges on every correction",
    description:
      "We record readings panel by panel so we never remove more clear coat than the defect requires.",
  },
  {
    title: "Color-matched inspection lighting",
    description:
      "High-CRI lights reveal swirls and holograms that sunlight and garage bulbs hide. If we cannot see it, we cannot fix it.",
  },
  {
    title: "Fresh microfiber, color-coded by task",
    description:
      "Paint, glass, wheels and interior each get their own towels. Towels are laundered after every job and retired early.",
  },
  {
    title: "IDA-certified technicians",
    description:
      "Every detailer on your car holds International Detailing Association certification and at least three years of hands-on experience.",
  },
];

export const team: { name: string; role: string; bio: string; credentials: string[] }[] = [
  {
    name: founder.name,
    role: founder.role,
    bio: "Started with a pressure washer and a borrowed van. Still personally inspects every correction and coating before it leaves the studio.",
    credentials: ["IDA Certified Detailer", "Coatings installer"],
  },
  {
    name: "Maya Okafor",
    role: "Correction and coatings specialist",
    bio: "Runs the studio bay. Black paint, soft clear coats and fresh resprays are her favorite problems to solve.",
    credentials: ["IDA Certified Detailer", "Paint-depth specialist"],
  },
  {
    name: "Andre Castillo",
    role: "Mobile team lead",
    bio: "Leads the mobile crew across the metro. Knows which apartment garages have clearance and which HOAs want a heads-up.",
    credentials: ["IDA Certified Detailer", "Water-reclaim trained"],
  },
];

export const credentials = [
  { label: "IDA Certified", detail: "International Detailing Association" },
  { label: "$2M liability", detail: "General liability coverage" },
  { label: "Garage keepers", detail: "Your car is covered in our care" },
  { label: "3-year warranty", detail: "Written, on every ceramic coating" },
  { label: "Background checked", detail: "Every technician on every job" },
] as const;
