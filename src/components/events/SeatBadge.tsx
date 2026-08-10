import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface SeatBadgeProps {
  remainingSeats: number;
  capacity: number;
}

export function SeatBadge({ remainingSeats }: SeatBadgeProps) {
  if (remainingSeats <= 0) {
    return (
      <Badge
        variant="destructive"
        className="font-mono text-[11px] h-auto py-0.5"
      >
        <Users className="size-3" data-icon="inline-start" />
        Sold Out
      </Badge>
    );
  }

  if (remainingSeats <= 10) {
    return (
      <Badge
        variant="secondary"
        className="font-mono text-[11px] h-auto py-0.5 border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse"
      >
        <Users className="size-3" data-icon="inline-start" />
        Only {remainingSeats} left
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="font-mono text-[11px] h-auto py-0.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    >
      <Users className="size-3" data-icon="inline-start" />
      {remainingSeats} seats available
    </Badge>
  );
}
