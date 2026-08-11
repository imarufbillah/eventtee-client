import { Skeleton } from "@/components/ui/skeleton";

export default function EventBookingsLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        {/* Summary Card Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 space-y-4">
            <Skeleton className="h-6 w-96 rounded-lg" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
