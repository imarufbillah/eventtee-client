import { Skeleton } from "@/components/ui/skeleton";

export default function BookingsLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Title & Breadcrumb Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>

        {/* Tab & Search Filter Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-4">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
          <Skeleton className="h-10 w-full sm:w-64 rounded-full" />
        </div>

        {/* Bookings Card Feed Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[1.75rem] border border-border/70 bg-card/60 p-2"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] border border-border/50 bg-background/90 p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-72 rounded-lg" />
                    <Skeleton className="h-4 w-60 rounded-md" />
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
