import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        {/* Profile Card Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-5">
              <Skeleton className="size-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-4 w-60 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-full" />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
