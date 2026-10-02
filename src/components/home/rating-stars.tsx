import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  className?: string;
  /** Tailwind size classes for each star. */
  starClassName?: string;
}

/** Five stars, filled to the nearest whole star. Decorative: pair it with a text rating. */
export function RatingStars({ rating, className, starClassName = "size-4" }: RatingStarsProps) {
  const filled = Math.round(rating);
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            starClassName,
            i < filled ? "fill-amber-400 text-amber-400" : "fill-transparent text-ink-subtle",
          )}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}
