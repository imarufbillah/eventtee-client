import Link from "next/link";
import { ArrowRight, Calendar, AlertCircle } from "lucide-react";
import type { Event } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";

interface UpcomingEventsSectionProps {
  events: Event[];
}

export function UpcomingEventsSection({ events }: UpcomingEventsSectionProps) {
  return (
    <section className="py-16 md:py-24 bg-muted/20 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary mb-2">
              <Calendar className="size-3.5" />
              <span>Live Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Upcoming Events & Experiences
            </h2>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground max-w-xl">
              Reserve tickets in real-time with instant availability status.
            </p>
          </div>

          <Button
            render={<Link href="/events" />}
            nativeButton={false}
            variant="outline"
            size="sm"
            className="rounded-full gap-2 self-start md:self-auto"
          >
            <span>View All Events</span>
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>

        {/* Events Grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          /* Empty / Fallback State */
          <div className="rounded-2xl border border-dashed border-border p-12 text-center bg-background/60">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No active events found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
              There are currently no upcoming events listed. Check back soon or
              create your own event as an organizer!
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                render={<Link href="/sign-up?role=ORGANIZER" />}
                nativeButton={false}
                size="sm"
              >
                Host an Event
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
