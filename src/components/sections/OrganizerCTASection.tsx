import Link from "next/link";
import { ArrowRight, Sparkles, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrganizerCTASection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute bottom-0 right-0 -z-10 h-100 w-100 opacity-20 blur-3xl">
        <div className="h-full w-full bg-linear-to-tr from-primary via-indigo-600 to-purple-600 rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-background to-background p-8 md:p-12 lg:p-16 shadow-xl backdrop-blur-md dark:from-primary/15 dark:via-card/90 dark:to-card">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              <span>For Event Organizers</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight text-balance leading-tight">
              Host Your Next Live Event or Conference with Eventtee.
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Create your event in minutes, customize ticket prices and seat
              capacity, manage attendee bookings, and receive real-time
              analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Button
                render={<Link href="/sign-up?role=ORGANIZER" />}
                nativeButton={false}
                size="lg"
                className="w-full sm:w-auto rounded-full px-6 h-11 font-semibold gap-2 transition-transform active:scale-95 shadow-md"
              >
                <PlusCircle className="size-4" />
                <span>Create an Event</span>
                <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/20">
                  <ArrowRight className="size-3" data-icon="inline-end" />
                </span>
              </Button>

              <Button
                render={<Link href="/events" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full px-6 h-11 font-medium"
              >
                Browse Catalog
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
