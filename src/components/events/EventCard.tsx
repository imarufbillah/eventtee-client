import Link from "next/link";
import { ArrowRight, Calendar, MapPin, Star } from "lucide-react";
import type { Event } from "@/lib/types";
import {
  formatCurrency,
  formatDate,
  formatTime,
  getCategoryGradient,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SeatBadge } from "./SeatBadge";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const categoryGradient = getCategoryGradient(event.category.slug);
  const percentBooked = Math.min(
    100,
    Math.round((event.bookedSeats / (event.capacity || 1)) * 100),
  );

  return (
    <article className="group/card relative flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/40 p-1.5 transition-all duration-300 hover:border-primary/40 hover:bg-muted/60 dark:border-border/40 dark:bg-card/40 dark:hover:border-primary/40">
      {/* Inner Core Enclosure */}
      <div className="flex h-full flex-col justify-between rounded-[0.875rem] border border-border/40 bg-background/90 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-xs transition-colors dark:bg-background/60">
        <div>
          {/* Header Banner & Visual Accent */}
          <div className="relative mb-4 overflow-hidden rounded-xl border border-border/50 bg-linear-to-br p-4 transition-all duration-300 group-hover/card:shadow-md">
            <div
              className={`absolute inset-0 bg-linear-to-br ${categoryGradient} opacity-30`}
            />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <Badge
                variant="outline"
                className="bg-background/80 backdrop-blur-md"
              >
                {event.category.name}
              </Badge>
              <SeatBadge
                remainingSeats={event.remainingSeats}
                capacity={event.capacity}
              />
            </div>

            {/* Event Title */}
            <h3 className="relative z-10 mt-3 line-clamp-1 font-bold text-foreground text-lg sm:text-xl tracking-tight transition-colors group-hover/card:text-primary">
              {event.title}
            </h3>

            {/* Organizer & Rating */}
            <div className="relative z-10 mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">By {event.organizer.name}</span>
              {event.averageRating ? (
                <div className="flex items-center gap-1 font-mono font-medium text-amber-500">
                  <Star className="size-3.5 fill-amber-500 text-amber-500" />
                  <span>{Number(event.averageRating).toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({event.totalReviews})
                  </span>
                </div>
              ) : (
                <span className="font-mono text-[11px] text-muted-foreground">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Metadata Grid */}
          <div className="flex flex-col gap-2 border-y border-border/40 py-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5 shrink-0 text-primary" />
              <span className="font-medium text-foreground">
                {formatDate(event.startDate)} • {formatTime(event.startDate)}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="size-3.5 shrink-0 text-primary" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>

          {/* Capacity Progress */}
          <div className="mt-3 flex flex-col gap-1">
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>Booked ({percentBooked}%)</span>
              <span>
                {event.bookedSeats} / {event.capacity} seats
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${percentBooked}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer & Action CTA */}
        <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-border/30">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              Price
            </span>
            <span className="font-mono font-bold text-foreground text-lg sm:text-xl">
              {formatCurrency(event.price)}
            </span>
          </div>

          {/* Button-in-Button Trailing Icon CTA */}
          <Button
            render={<Link href={`/events/${event.id}`} />}
            nativeButton={false}
            size="sm"
            className="group/btn h-9 gap-2 rounded-full px-3.5 transition-all duration-200 active:scale-95"
          >
            <span>View Details</span>
            <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/20 transition-transform duration-200 group-hover/btn:translate-x-0.5">
              <ArrowRight className="size-3" data-icon="inline-end" />
            </span>
          </Button>
        </div>
      </div>
    </article>
  );
}
