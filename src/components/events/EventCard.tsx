import Link from "next/link";
import { ArrowUpRight, MapPin, Star, Info } from "lucide-react";
import type { Event } from "@/lib/types";
import {
  cn,
  formatCurrency,
  formatTicketDate,
  formatTime,
  getBookedPercent,
  getCategoryAccent,
} from "@/lib/utils";
import { SeatBadge } from "./SeatBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface EventCardProps {
  event: Event;
  /** Featured layout for hero / lead placement */
  featured?: boolean;
  className?: string;
}

export function EventCard({ event, featured = false, className }: EventCardProps) {
  const ticket = formatTicketDate(event.startDate);
  const percentBooked = getBookedPercent(event.bookedSeats, event.capacity);
  const accent = getCategoryAccent(event.category?.slug || "");
  const price = formatCurrency(event.price);

  return (
    <article
      className={cn(
        "group/ticket relative flex h-full overflow-hidden rounded-xl border border-border/80 bg-card text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "hover:border-primary/35 hover:shadow-[0_12px_40px_-20px_oklch(0.48_0.22_265_/_0.35)]",
        "active:scale-[0.99]",
        featured && "md:min-h-[280px]",
        className,
      )}
    >
      {/* Date stub — left rail */}
      <div
        className={cn(
          "relative flex w-[4.5rem] shrink-0 flex-col items-center justify-center border-r border-border/70 px-2 py-5 text-center sm:w-20",
          accent.tint,
        )}
      >
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground">
          {ticket.weekday}
        </span>
        <span className="font-display mt-1 text-3xl font-extrabold leading-none tracking-tight text-foreground sm:text-4xl">
          {ticket.day}
        </span>
        <span className="mt-1 font-mono text-[11px] font-bold tracking-wider text-muted-foreground">
          {ticket.month}
        </span>
        <span className="mt-3 font-mono text-[10px] text-muted-foreground">
          {formatTime(event.startDate)}
        </span>
      </div>

      {/* Main body */}
      <div className="relative flex min-w-0 flex-1 flex-col justify-between gap-4 p-4 sm:p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide",
                accent.tint,
                accent.ink,
              )}
            >
              {event.category?.name || "Event"}
            </span>
            <SeatBadge
              remainingSeats={event.remainingSeats}
              capacity={event.capacity}
              compact
            />
          </div>

          <div>
            <h3
              className={cn(
                "font-display font-bold tracking-tight text-foreground transition-colors duration-200 group-hover/ticket:text-primary",
                featured
                  ? "text-xl sm:text-2xl line-clamp-2"
                  : "text-base sm:text-lg line-clamp-1",
              )}
            >
              <Link
                href={`/events/${event.id}`}
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {event.title}
              </Link>
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="truncate">
                Hosted by {event.organizer?.name || "Organizer"}
              </span>
              {event.averageRating ? (
                <span className="inline-flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400">
                  <Star className="size-3 fill-current" aria-hidden />
                  {Number(event.averageRating).toFixed(1)}
                  <span className="text-muted-foreground">
                    ({event.totalReviews})
                  </span>
                </span>
              ) : (
                <span className="font-mono text-[11px]">New listing</span>
              )}
            </div>
          </div>

          {featured && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          )}

          {event.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0 text-primary/70" aria-hidden />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        {/* Seat meter + price row */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>
                {event.bookedSeats}/{event.capacity} booked
              </span>
              <span>{percentBooked}%</span>
            </div>
            <div
              className="h-1 w-full overflow-hidden rounded-full bg-muted"
              role="meter"
              aria-valuenow={percentBooked}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${percentBooked}% of seats booked`}
            >
              <div
                className={cn("seat-meter h-full rounded-full", accent.bar)}
                style={{ transform: `scaleX(${percentBooked / 100})` }}
              />
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 border-t border-border/50 pt-3">
            <Tooltip>
              <TooltipTrigger
                render={
                  <div className="group/price relative z-10 cursor-help flex flex-col items-start" />
                }
              >
                <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground group-hover/price:text-primary transition-colors">
                  <span>From</span>
                  <Info className="size-3 text-muted-foreground/70 group-hover/price:text-primary transition-colors" />
                </p>
                <p className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {price}
                </p>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="text-[11px] font-medium shadow-md">
                <span>Taxes &amp; all checkout fees included</span>
              </TooltipContent>
            </Tooltip>
            <span className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/ticket:gap-2.5">
              Reserve
              <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-200 group-hover/ticket:translate-x-0.5 group-hover/ticket:-translate-y-px">
                <ArrowUpRight className="size-3" aria-hidden />
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Perforation column (desktop) */}
      <div
        className="relative hidden w-3 shrink-0 self-stretch sm:block"
        aria-hidden
      >
        <div className="ticket-notch-t" />
        <div className="ticket-perforation absolute inset-y-3 left-1/2 w-2 -translate-x-1/2" />
        <div className="ticket-notch-b" />
      </div>
    </article>
  );
}
