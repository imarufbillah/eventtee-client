import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2 backdrop-blur-md">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-8 w-64 rounded-xl" />
                <Skeleton className="h-4 w-80 rounded-md" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-10 w-36 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Stat Cards Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[1.75rem] border border-border/70 bg-card/60 p-2"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] border border-border/50 bg-background/90 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                  <Skeleton className="size-7 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-3 w-40 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
              <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 space-y-6">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-20 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
              <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 space-y-4">
                <Skeleton className="h-5 w-36 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
