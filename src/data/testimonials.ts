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

/**
 * Real customer reviews only. Add them here as they come in (copied from Google, Yelp or
 * Facebook with the customer's permission); the home page reviews section appears
 * automatically once this array has entries. Never add invented reviews.
 */
export const testimonials: Testimonial[] = [];
