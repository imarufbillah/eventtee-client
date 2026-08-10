import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/30 p-1.5">
      <div className="flex h-full flex-col justify-between rounded-xl border border-border/40 bg-background/90 p-5">
        <div>
          <Skeleton className="h-28 w-full rounded-xl mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-5/6 mb-4" />
          <div className="border-y border-border/40 py-3 flex flex-col gap-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-2 w-full mt-3 rounded-full" />
        </div>
        <div className="mt-5 flex items-center justify-between pt-3 border-t border-border/30">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
