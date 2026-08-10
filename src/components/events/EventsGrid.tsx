import Link from "next/link";
import { X } from "lucide-react";
import type { Event } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { EventsEmptyState } from "@/components/events/EventsEmptyState";
import { EventsErrorState } from "@/components/events/EventsErrorState";
import { EventsPagination } from "@/components/events/EventsPagination";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";

interface EventsGridProps {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
  search: string;
  activeCategory: string;
  activeCategoryName?: string;
  /** True when the data fetch itself failed (vs. genuine empty results). */
  fetchError?: boolean;
}

export function EventsGrid({
  events,
  total,
  page,
  totalPages,
  search,
  activeCategory,
  activeCategoryName,
  fetchError,
}: EventsGridProps) {
  const eventWord = total === 1 ? "event" : "events";
  const hasActiveFilter = search || activeCategory;

  const clearHref = search && activeCategory
    ? `/events?search=${encodeURIComponent(search)}`
    : "/events";

  return (
    <section
      aria-label="Event results"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Result meta row */}
      {!fetchError && (
        <Reveal y={8}>
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              <span className="font-semibold text-foreground">{total}</span>{" "}
              {eventWord}
              {hasActiveFilter ? " · filtered" : ""}
            </span>

            {activeCategoryName && (
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                {activeCategoryName}
                <Link
                  href={clearHref}
                  aria-label={`Remove ${activeCategoryName} filter`}
                  className="flex size-3.5 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
                >
                  <X className="size-3" aria-hidden />
                </Link>
              </Badge>
            )}

            {search && (
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              >
                &ldquo;{search}&rdquo;
                <Link
                  href={
                    activeCategory
                      ? `/events?category=${activeCategory}`
                      : "/events"
                  }
                  aria-label="Clear search"
                  className="flex size-3.5 shrink-0 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
                >
                  <X className="size-3" aria-hidden />
                </Link>
              </Badge>
            )}
          </div>
        </Reveal>
      )}

      {/* Content area: error / empty / grid */}
      {fetchError ? (
        <EventsErrorState />
      ) : events.length === 0 ? (
        <EventsEmptyState search={search} activeCategory={activeCategory} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={Math.min(i * 0.05, 0.2)} y={12}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10">
              <EventsPagination
                page={page}
                totalPages={totalPages}
                search={search}
                activeCategory={activeCategory}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}
