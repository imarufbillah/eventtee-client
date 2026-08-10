import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
  return (
    <div className="flex min-h-dvh flex-col justify-center px-4 py-16 pt-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Search className="size-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Event Not Found
          </h1>
          <p className="text-sm text-muted-foreground">
            The event you are looking for doesn&apos;t exist, has been removed, or is currently unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/events" />}
            className="w-full sm:w-auto rounded-full font-semibold px-6"
          >
            <ArrowLeft className="mr-2 size-4" />
            Browse Catalog
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
            className="w-full sm:w-auto rounded-full font-medium px-6"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
