import { EventsSearchForm } from "./EventsSearchForm";

interface EventsPageHeaderProps {
  total: number;
  search: string;
  activeCategory?: string;
}

/**
 * Page title + search bar band.
 * Server Component — the client-interactive search is delegated to EventsSearchForm.
 */
export function EventsPageHeader({
  total,
  search,
  activeCategory,
}: EventsPageHeaderProps) {
  const hasSearch = search.length > 0;
  const eventWord = total === 1 ? "event" : "events";

  return (
    <div className="border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* h1 + subtitle */}
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {hasSearch ? (
                <>
                  Results for{" "}
                  <span className="text-primary">&ldquo;{search}&rdquo;</span>
                </>
              ) : (
                "Browse Events"
              )}
            </h1>
            <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
              {total > 0 ? (
                <>
                  <span className="font-semibold text-foreground">{total}</span>{" "}
                  {eventWord} · sorted by date
                </>
              ) : (
                "No events found"
              )}
            </p>
          </div>

          {/* Search form */}
          <EventsSearchForm
            defaultValue={search}
            activeCategory={activeCategory}
          />
        </div>
      </div>
    </div>
  );
}
