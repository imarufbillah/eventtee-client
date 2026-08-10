import { cn } from "@/lib/utils";

interface SeatBadgeProps {
  remainingSeats: number;
  capacity: number;
  className?: string;
  compact?: boolean;
}

export function SeatBadge({
  remainingSeats,
  capacity,
  className,
  compact = false,
}: SeatBadgeProps) {
  if (remainingSeats <= 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-destructive/25 bg-destructive/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-destructive",
          className,
        )}
      >
        <span className="size-1.5 rounded-full bg-destructive" aria-hidden />
        Sold out
      </span>
    );
  }

  if (remainingSeats <= 10) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-signal/40 bg-signal/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-signal-foreground dark:text-signal",
          className,
        )}
      >
        <span
          className="size-1.5 animate-pulse rounded-full bg-signal"
          aria-hidden
        />
        {compact
          ? `${remainingSeats} left`
          : `Only ${remainingSeats} seats left`}
      </span>
    );
  }

  const open = Math.round((remainingSeats / (capacity || 1)) * 100);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-400",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
      {compact
        ? `${remainingSeats} open`
        : `${remainingSeats} seats · ${open}% open`}
    </span>
  );
}
