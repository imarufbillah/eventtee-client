import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Event } from "@/lib/types";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

interface UpcomingEventsSectionProps {
  events: Event[];
  /** Skip the first event if it was already featured in the hero */
  skipFeaturedId?: string;
}

export function UpcomingEventsSection({
  events,
  skipFeaturedId,
}: UpcomingEventsSectionProps) {
  const list = skipFeaturedId
    ? events.filter((e) => e.id !== skipFeaturedId)
    : events;

  // If filtering left nothing but we had events, show all (single-event catalog)
  const display = list.length > 0 ? list : events;

  return (
    <section className="relative py-20 md:py-28" id="upcoming">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 border-b border-border/60 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
                Upcoming on the board
              </h2>
              <p className="mt-3 max-w-lg text-base text-muted-foreground">
                Real capacity, live remaining seats, and prices you can act on
                — not a brochure of sold-out hopes.
              </p>
            </div>

            <Button
              render={<Link href="/events" />}
              nativeButton={false}
              variant="outline"
              className="group h-10 shrink-0 gap-2 self-start rounded-full px-4 md:self-auto"
            >
              <span>Full catalog</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" data-icon="inline-end" />
              </span>
            </Button>
          </div>
        </Reveal>

        {display.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {display.map((event, i) => (
              <Reveal key={event.id} delay={Math.min(i * 0.06, 0.24)} y={14}>
                <EventCard
                  event={event}
                  featured={i === 0 && display.length > 1}
                  className={
                    i === 0 && display.length > 2
                      ? "md:col-span-2 xl:col-span-1"
                      : undefined
                  }
                />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
              <h3 className="font-display text-xl font-bold text-foreground">
                The board is quiet
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                No active events right now. Check back soon, or create one if
                you&apos;re an organizer.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  render={<Link href="/sign-up?role=ORGANIZER" />}
                  nativeButton={false}
                  className="rounded-full px-5"
                >
                  Host an event
                </Button>
                <Button
                  render={<Link href="/events" />}
                  nativeButton={false}
                  variant="outline"
                  className="rounded-full px-5"
                >
                  Refresh catalog
                </Button>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
