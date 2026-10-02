import { siteConfig } from "@/config/site";
import { getService } from "@/data/services";
import { formatPrice } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
  category: "general" | "booking" | "services" | "mobile";
}

const { founder } = siteConfig;
const manager = siteConfig.team[0];
/**
 * Starting price for a package and vehicle class, read from the service catalog.
 * The fallback mirrors docs/SERVICES-SPEC.md so copy stays correct while the catalog evolves.
 */
function priceFor(slug: string, vehicleClass: string, fallback: number) {
  const prices = getService(slug)?.price as Partial<Record<string, number>> | undefined;
  return formatPrice(prices?.[vehicleClass] ?? fallback);
}

const paymentsBy = manager
  ? `${manager.name} handles payments and booking`
  : `${founder.name} handles payments`;

export const faqs: FaqItem[] = [
  {
    category: "general",
    question: "What is the difference between a car wash and a detail?",
    answer:
      "A wash gets the dirt off. A detail goes further: deep-cleaned wheels and wheel wells, door jambs, bug removal and a layer of spray wax or sealant, and on the Full Deluxe Package, the whole interior too. Our Basic Package is a careful hand wash; Premium and Full Deluxe are the detail.",
  },
  {
    category: "services",
    question: "What is included in each package?",
    answer:
      "Basic Package (exterior wash): hand wash, wheels and tires, tire shine, windows, dry and a basic exterior wipe-down. Premium Package (exterior detail): everything in Basic plus deep wheel cleaning, wheel wells, door jambs, bug removal, spray wax or sealant and a more detailed dry. Full Deluxe Package (inside and outside): everything in Premium plus a full interior vacuum, dash, console and doors, seats, mats, interior windows and deeper stain cleaning. Working Truck: exterior hand wash, wheels and tires, wheel wells, bug and grime removal, door jambs and tire dressing.",
  },
  {
    category: "services",
    question: "How long does each package take?",
    answer:
      "Roughly: Basic about 1 hour, Premium 1.5 to 2 hours, Full Deluxe 2.5 to 3.5 hours, and Working Truck 1 to 1.5 hours. These are estimates. Larger vehicles, exotics and heavier dirt take longer, and you will get a time estimate when you book.",
  },
  {
    category: "services",
    question: "Is there an extra charge for really dirty work trucks?",
    answer:
      "Sometimes. The Working Truck package covers normal work grime. Extremely dirty construction, farm or work vehicles (thick mud, caked dust, heavy grime) can add $15 to $30. That is quoted on site, before any work starts, so you always know the price first.",
  },
  {
    category: "general",
    question: "How is pricing decided?",
    answer: `By package and vehicle class: car, SUV, truck, sports car, exotic or motorcycle. A Basic Package starts at ${priceFor("basic-wash", "car", 50)} for a car, and every price is listed on the pricing page. Exotics start at the listed price and are confirmed once we see the car. Working vehicles start at ${priceFor("working-truck", "truck", 75)}, plus $15 to $30 if a construction, farm or work vehicle is extremely dirty. Any extra is quoted on site before work starts, never after.`,
  },
  {
    category: "services",
    question: "Do you detail motorcycles?",
    answer: `Yes. Motorcycles have their own pricing: Basic Package ${priceFor("basic-wash", "motorcycle", 40)}, Premium Package ${priceFor("premium-detail", "motorcycle", 65)} and Full Deluxe Package ${priceFor("full-deluxe", "motorcycle", 100)}. Cruisers and sport bikes are both welcome, and we come to you like any other appointment.`,
  },
  {
    category: "mobile",
    question: "Do you come to me or do I drop the car off?",
    answer: `We come to you. ${siteConfig.name} is fully mobile, so there is nothing to drop off and no shop to visit. Every package is done in your driveway, at work or wherever the car is parked, anywhere in the ${siteConfig.region}.`,
  },
  {
    category: "mobile",
    question: "What do you need from me for a mobile appointment?",
    answer:
      "Just a parking spot with about three feet of clearance around the vehicle. Driveways, apartment lots and office parking all work. You do not need to provide water or power: we bring our own.",
  },
  {
    category: "mobile",
    question: "Do I need to be home during the appointment?",
    answer:
      "Only at the start and end. We do a quick walkaround with you on arrival and a final look when we finish. In between, you can work, run errands or head inside. For the Full Deluxe Package, leave the car unlocked or the keys with us and we will text you when we are done.",
  },
  {
    category: "mobile",
    question: "What happens if the weather turns on my appointment day?",
    answer:
      "We watch the forecast for every booking. In summer we start as early as 7:00 AM to beat the desert heat, because hot panels make soap dry before it can rinse clean. If high wind, blowing dust or the occasional storm is likely, we text you the day before and reschedule to the next open day at no charge.",
  },
  {
    category: "services",
    question: "How often should I wash my car in the desert?",
    answer:
      "Every two weeks is a good rhythm for a daily driver in the High Desert. Sun, wind-blown dust and bugs bake onto paint quickly, and a regular hand wash keeps them from etching in. A Premium Package every couple of months refreshes the spray wax or sealant, and a Full Deluxe a few times a year keeps the interior from getting away from you.",
  },
  {
    category: "services",
    question: "Can you remove scratches?",
    answer:
      "Our packages are washes and details, not scratch repair. A fresh coat of spray wax or sealant can make very light marks less visible, but deeper scratches need a body shop or paint specialist. We will point out anything we notice during the walkaround.",
  },
  {
    category: "services",
    question: "Can you clean child car seats?",
    answer:
      "With the Full Deluxe Package, yes. We vacuum around and under the seat and wipe down the shell with mild, fragrance-free products. We do not machine-wash or chemically treat harness straps, since that can weaken the webbing, and we leave the seat installed exactly as we found it.",
  },
  {
    category: "general",
    question: "Do you work on fleets and commercial vehicles?",
    answer:
      "Yes. The Working Truck package is built for construction, farm and work vehicles, and we can line up several vehicles back to back at your yard or job site. Choose Fleet and commercial on our contact form and we will put a quote together.",
  },
  {
    category: "general",
    question: "Are you insured?",
    answer: siteConfig.claims.insured
      ? `Yes. ${siteConfig.name} carries business insurance. Ask for proof of coverage when you book and we will send it over.`
      : `${siteConfig.name} is a small, owner-operated business: ${founder.name} details every car himself. If your HOA, building or employer needs proof of coverage, ask us about it when you book and we will tell you exactly what we can provide.`,
  },
  {
    category: "booking",
    question: "What payment methods do you accept?",
    answer: `${paymentsBy}. You can pay by card, cash, Zelle or Apple Pay; the options are confirmed when you book. Payment is due when the job is done.`,
  },
  {
    category: "booking",
    question: "Do you take a deposit?",
    answer: "No. You pay when the job is finished and you are happy with it.",
  },
  {
    category: "booking",
    question: "How far in advance should I book?",
    answer:
      "Most weeks there is availability within a few days. Saturdays fill first, so book those a week or so ahead if you can.",
  },
  {
    category: "booking",
    question: "What is your cancellation policy?",
    answer:
      "Life happens. Let us know at least 24 hours before your appointment and rescheduling or cancelling is free. Weather cancellations on our side are always free.",
  },
  {
    category: "booking",
    question: "Do you offer gift cards?",
    answer: `Ask us. Send a message or mention it when you book and ${manager ? manager.name : founder.name} will tell you what we can set up for the package you have in mind.`,
  },
];

export type FaqCategory = FaqItem["category"];

export const faqCategories: { id: FaqCategory; label: string }[] = [
  { id: "general", label: "General" },
  { id: "booking", label: "Booking" },
  { id: "services", label: "Services" },
  { id: "mobile", label: "Mobile" },
];
