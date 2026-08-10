import { EventCardSkeleton } from "@/components/events/EventCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shown instantly while the events Server Component fetches data.
 * Mirrors the layout of the actual page: header band → filter rail → grid.
 */
export default function EventsLoading() {
  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      {/* Page header band skeleton */}
      <div className="border-b border-border/60 bg-background/95">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-3.5 w-32" />
            </div>
            <Skeleton className="h-9 w-full max-w-xs rounded-lg" />
          </div>
        </div>
      </div>

      {/* Filter rail skeleton */}
      <div className="border-b border-border/50 bg-background/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-9 shrink-0 rounded-full"
                style={{ width: `${64 + (i % 3) * 16}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid of event card skeletons */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Meta line */}
        <Skeleton className="mb-6 h-4 w-28" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
