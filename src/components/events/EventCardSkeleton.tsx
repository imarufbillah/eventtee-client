import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors EventCard's ticket-stub layout: left date rail + right body. */
export function EventCardSkeleton() {
  return (
    <div
      className="flex h-full overflow-hidden rounded-xl border border-border/80 bg-card"
      aria-hidden
    >
      {/* Date stub rail */}
      <div className="relative flex w-18 shrink-0 flex-col items-center justify-center gap-2 border-r border-border/70 bg-muted/30 px-2 py-5">
        <Skeleton className="h-2.5 w-8" />
        <Skeleton className="h-9 w-10" />
        <Skeleton className="h-2.5 w-8" />
        <Skeleton className="mt-1 h-2 w-7" />
      </div>

      {/* Main body */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
        <div className="space-y-3">
          {/* Category badge + seat badge row */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          {/* Title */}
          <Skeleton className="h-5 w-4/5" />
          {/* Organizer + rating row */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3.5 w-10" />
          </div>
          {/* Location */}
          <Skeleton className="h-3.5 w-28" />
        </div>

        {/* Seat meter + price row */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <Skeleton className="h-2.5 w-24" />
              <Skeleton className="h-2.5 w-6" />
            </div>
            <Skeleton className="h-1 w-full rounded-full" />
          </div>
          <div className="flex items-end justify-between border-t border-border/50 pt-3">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* Perforation column (desktop) */}
      <div className="hidden w-3 shrink-0 sm:block" />
    </div>
  );
}
