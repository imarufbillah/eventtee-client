import Link from "next/link";

interface EventsEmptyStateProps {
  search: string;
  activeCategory: string;
}

/**
 * Renders when the API returns zero events.
 * Two distinct cases: filtered empty vs. fully empty catalog.
 */
export function EventsEmptyState({
  search,
  activeCategory,
}: EventsEmptyStateProps) {
  const hasFilter = search || activeCategory;

  if (hasFilter) {
    const label = search && activeCategory
      ? `"${search}" in ${activeCategory}`
      : search
        ? `"${search}"`
        : activeCategory;

    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
        <p className="font-display text-xl font-bold text-foreground">
          No events match{" "}
          <span className="text-primary">{label}</span>
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Try a different keyword or browse all categories.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/events"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Clear filters
          </Link>
          {search && activeCategory && (
            <Link
              href={`/events?search=${encodeURIComponent(search)}`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border/80 bg-card/80 px-5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              Search all categories
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-20 text-center">
      <p className="font-display text-xl font-bold text-foreground">
        The board is clear.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Events will appear here as organizers publish them. Check back soon.
      </p>
      <div className="mt-6">
        <Link
          href="/sign-up?role=ORGANIZER"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Host an event →
        </Link>
      </div>
    </div>
  );
}
