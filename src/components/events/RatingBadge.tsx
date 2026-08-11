import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number | null;
  totalReviews?: number;
  className?: string;
  showCount?: boolean;
}

export function RatingBadge({
  rating,
  totalReviews = 0,
  className,
  showCount = true,
}: RatingBadgeProps) {
  const numericRating = rating ?? 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400",
        className
      )}
    >
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span>{numericRating > 0 ? numericRating.toFixed(1) : "New"}</span>
      {showCount && totalReviews > 0 && (
        <span className="text-[10px] text-amber-600/70 dark:text-amber-400/70">
          ({totalReviews})
        </span>
      )}
    </div>
  );
}
