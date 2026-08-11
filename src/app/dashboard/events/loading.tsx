import { Skeleton } from "@/components/ui/skeleton";

export default function HostedEventsLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-36 rounded-full" />
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
            <Skeleton className="h-9 w-full md:w-64 rounded-full" />
          </div>
        </div>

        {/* Event Cards Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[1.75rem] border border-border/70 bg-card/60 p-2"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] border border-border/50 bg-background/90 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-80 rounded-lg" />
                    <Skeleton className="h-4 w-60 rounded-md" />
                  </div>
                  <Skeleton className="h-9 w-28 rounded-full" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
