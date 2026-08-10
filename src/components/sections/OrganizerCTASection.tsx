import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

export function OrganizerCTASection() {
  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal y={20}>
          <div className="relative overflow-hidden rounded-2xl bg-venue text-venue-foreground">
            {/* Subtle stage light — not decorative blob soup */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 size-[28rem] rounded-full opacity-40"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.72 0.18 265 / 0.55), transparent 65%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 left-1/4 size-64 rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.72 0.16 55 / 0.4), transparent 70%)",
              }}
            />

            <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-12 lg:gap-8 lg:p-14">
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-venue-foreground/60 uppercase">
                  For organizers
                </p>
                <h2 className="font-display mt-3 max-w-[16ch] text-3xl font-extrabold tracking-tight text-venue-foreground sm:text-4xl lg:text-5xl">
                  Put your event on the board tonight.
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-venue-foreground/70">
                  Set capacity, price, and category. Publish when you&apos;re
                  ready. Attendees see live remaining seats the moment you go
                  live — no spreadsheet handoffs.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    render={<Link href="/sign-up?role=ORGANIZER" />}
                    nativeButton={false}
                    size="lg"
                    className="group h-12 gap-2 rounded-full bg-venue-foreground px-6 font-semibold text-venue hover:bg-venue-foreground/90 active:scale-[0.98]"
                  >
                    <Plus className="size-4" data-icon="inline-start" />
                    <span>Create an event</span>
                    <span className="flex size-7 items-center justify-center rounded-full bg-venue/10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                      <ArrowUpRight className="size-3.5" />
                    </span>
                  </Button>
                  <Button
                    render={<Link href="/events" />}
                    nativeButton={false}
                    variant="ghost"
                    size="lg"
                    className="h-12 rounded-full px-5 text-venue-foreground/80 hover:bg-venue-foreground/10 hover:text-venue-foreground"
                  >
                    See how listings look
                  </Button>
                </div>
              </div>

              {/* Organizer checklist — product capabilities, not fluff */}
              <div className="flex flex-col justify-end lg:col-span-5">
                <ul className="space-y-0 divide-y divide-venue-foreground/10 rounded-xl border border-venue-foreground/10 bg-venue-foreground/5">
                  {[
                    "Ticket price & seat capacity",
                    "Real-time booking feed",
                    "Attendee roster export-ready",
                    "Verified post-event reviews",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 px-4 py-3.5 text-sm text-venue-foreground/85"
                    >
                      <span
                        className="size-1.5 shrink-0 rounded-full bg-signal"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
