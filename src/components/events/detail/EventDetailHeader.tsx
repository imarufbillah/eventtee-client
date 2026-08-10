import Link from "next/link";
import { Calendar, MapPin, Star, ChevronRight } from "lucide-react";
import type { Event } from "@/lib/types";
import { CategoryChip } from "@/components/categories/CategoryChip";
import { formatDate, formatTime } from "@/lib/utils";

interface EventDetailHeaderProps {
  event: Event;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
  const dateFormatted = formatDate(event.startDate);
  const timeFormatted = formatTime(event.startDate);
  const rating = event.averageRating;
  const reviewCount = event.totalReviews ?? 0;

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground"
      >
        <Link
          href="/"
          className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
        >
          Home
        </Link>
        <ChevronRight className="size-3 text-muted-foreground/60" aria-hidden />
        <Link
          href="/events"
          className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
        >
          Events
        </Link>
        {event.category && (
          <>
            <ChevronRight className="size-3 text-muted-foreground/60" aria-hidden />
            <Link
              href={`/events?category=${event.category.slug}`}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              {event.category.name}
            </Link>
          </>
        )}
      </nav>

      {/* Category Chip & Status Badge */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {event.category && <CategoryChip category={event.category} />}
        {event.status !== "PUBLISHED" && (
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">
            {event.status}
          </span>
        )}
      </div>

      {/* Main Event H1 Title */}
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
        {event.title}
      </h1>

      {/* Meta Information Strip */}
      <div className="flex flex-wrap items-center gap-y-2.5 gap-x-5 border-y border-border/60 py-3.5 text-sm text-muted-foreground">
        {/* Date & Time */}
        <div className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0 text-primary" aria-hidden />
          <span>
            <strong className="font-medium text-foreground">{dateFormatted}</strong>
            {" at "}
            <span>{timeFormatted}</span>
          </span>
        </div>

        {/* Location */}
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden />
            <span className="text-foreground">{event.location}</span>
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
          <span className="font-mono text-xs font-bold tabular-nums text-foreground">
            {rating && rating > 0 ? rating.toFixed(1) : "New"}
          </span>
          {reviewCount > 0 && (
            <span className="font-mono text-xs text-muted-foreground">
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
