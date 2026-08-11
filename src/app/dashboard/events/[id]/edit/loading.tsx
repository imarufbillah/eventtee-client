import { Skeleton } from "@/components/ui/skeleton";

export default function EditEventLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        {/* Form Card Skeleton */}
        <div className="rounded-[2rem] border border-border/70 bg-card/60 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-border/50 bg-background/90 p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
