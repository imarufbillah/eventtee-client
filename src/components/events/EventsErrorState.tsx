import Link from "next/link";

/**
 * Renders when the events API call fails (network error or non-ok status).
 */
export function EventsErrorState() {
  return (
    <div className="rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-20 text-center">
      <p className="font-display text-xl font-bold text-foreground">
        Couldn&apos;t load events
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        There was a problem reaching the event catalog. This is usually
        temporary.
      </p>
      <div className="mt-6">
        <Link
          href="/events"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Try again
        </Link>
      </div>
    </div>
  );
}
