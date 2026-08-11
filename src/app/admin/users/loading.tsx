import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-9 w-64 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-32 rounded-full" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
