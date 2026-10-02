import { Droplets, Eye, Handshake, Timer, type LucideIcon } from "lucide-react";

/** About-page copy. Facts about the founder live in `siteConfig.founder`. */
export const values: { title: string; description: string; Icon: LucideIcon }[] = [
  {
    Icon: Droplets,
    title: "By hand, every time",
    description:
      "No brushes, no automatic equipment. Every car is washed and dried by hand, panel by panel.",
  },
  {
    Icon: Eye,
    title: "Honest scope",
    description:
      "If a mark will not wash out, you hear that up front. You get recommended the package your car needs, not the biggest ticket.",
  },
  {
    Icon: Handshake,
    title: "Make it right",
    description:
      "Spot something we missed? Say so before we pack up, or text us after, and we will come back and fix it.",
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
    title: "Two-bucket hand wash",
    description:
      "One bucket for soap, one for rinsing the mitt, grit guards in both. Dirt stays at the bottom instead of being dragged across your paint.",
  },
  {
    title: "pH-neutral soap",
    description:
      "Gentle on paint, wax, rubber and trim. It lifts dirt without stripping the protection already on your car.",
  },
  {
    title: "Microfiber-only drying",
    description:
      "Clean, plush microfiber towels, never a chamois or an old bath towel. Paint, glass, wheels and interior each get their own.",
  },
  {
    title: "Early starts",
    description:
      "Desert sun makes soap dry on the paint before it can rinse clean. We start early, work in shade where we can and keep panels cool.",
  },
  {
    title: "Wheels and tires get their own tools",
    description: "Brake dust and road grime never touch the mitt that washes your paint.",
  },
  {
    title: "Light footprint",
    description:
      "We bring our own hose, buckets, products, towels and vacuum, and leave nothing behind but a clean car.",
  },
];
