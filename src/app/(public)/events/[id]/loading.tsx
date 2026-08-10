import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="flex min-h-dvh flex-col pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-48 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4 max-w-2xl rounded-lg" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* 2-Column Split Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-36 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>

          {/* Right Column (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Skeleton className="h-96 w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    </div>
  );
}
