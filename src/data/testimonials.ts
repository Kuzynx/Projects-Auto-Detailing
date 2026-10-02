export interface Testimonial {
  id: string;
  name: string;
  location: string;
  vehicle: string;
  service: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  date: string;
  source: "Google" | "Yelp" | "Facebook";
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Daniel R.",
    location: "Westlake Hills",
    vehicle: "2022 Porsche 911 Carrera",
    service: "Ceramic Coating",
    rating: 5,
    quote:
      "I had three shops quote me. Project's was the only one that measured paint depth before touching the car. The coating has been on for 14 months and water still beads like day one.",
    date: "2026-08-14",
    source: "Google",
  },
  {
    id: "t2",
    name: "Priya S.",
    location: "Round Rock",
    vehicle: "2021 Toyota Highlander",
    service: "The Full Detail",
    rating: 5,
    quote:
      "Two kids, a golden retriever and a lot of Goldfish crackers. They made it look like a different car. Booked the monthly plan on the spot.",
    date: "2026-07-02",
    source: "Google",
  },
  {
    id: "t3",
    name: "Marcus T.",
    location: "South Austin",
    vehicle: "2019 Tesla Model 3",
    service: "Paint Correction",
    rating: 5,
    quote:
      "Black Tesla paint is a nightmare. They pulled 90% of the swirls out and sent me before/after photos of every panel. Worth every dollar.",
    date: "2026-06-21",
    source: "Yelp",
  },
  {
    id: "t4",
    name: "Elena V.",
    location: "Cedar Park",
    vehicle: "2023 BMW X5",
    service: "Interior Refresh",
    rating: 5,
    quote:
      "On time, communicative, and they worked out of my driveway without needing anything from me. The leather looks and smells new again.",
    date: "2026-05-30",
    source: "Google",
  },
  {
    id: "t5",
    name: "James K.",
    location: "Lakeway",
    vehicle: "2020 Ford F-150",
    service: "Signature Wash & Protect",
    rating: 5,
    quote:
      "Finally a detailer who treats a truck with the same care as a sports car. Wheels have never been this clean.",
    date: "2026-05-11",
    source: "Facebook",
  },
  {
    id: "t6",
    name: "Sofia M.",
    location: "Mueller",
    vehicle: "2018 Audi A4",
    service: "The Full Detail",
    rating: 5,
    quote:
      "Sold my car for $1,800 over the dealer's offer the week after the detail. Easiest ROI I've ever had.",
    date: "2026-04-19",
    source: "Google",
  },
];
