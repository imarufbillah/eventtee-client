import Link from "next/link";
import { ArrowRight, Compass, Ticket, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

const steps = [
  {
    id: "step-discover",
    icon: Compass,
    title: "Discover what still has seats",
    body: "Filter by category, date, and open capacity. Scarcity badges surface events that are almost full before you waste a click.",
  },
  {
    id: "step-reserve",
    icon: Ticket,
    title: "Reserve with atomic locking",
    body: "Pick your seat count and confirm. A database transaction holds capacity so two people never leave with the same seat.",
  },
  {
    id: "step-attend",
    icon: Star,
    title: "Show up — then rate it",
    body: "Your booking lives in the dashboard with ticket details. After the event, leave a verified review only attendees can write.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              From browse to booked in three moves
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Built around the only moment that matters in ticketing: the seat
              either is yours, or it isn&apos;t.
            </p>
          </div>
        </Reveal>

        <ol className="mt-14 grid list-none grid-cols-1 gap-0 md:grid-cols-3 md:gap-0">
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            return (
              <Reveal key={step.id} delay={i * 0.08} y={18}>
                <li className="group relative border-t border-border py-8 md:border-t-0 md:border-l md:px-6 md:py-0 md:first:border-l-0 md:first:pl-0 lg:px-8">
                  <div className="mb-5 flex items-center gap-3">
                    <span
                      className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105"
                      aria-hidden
                    >
                      <StepIcon className="size-4" />
                    </span>
                    {i < steps.length - 1 && (
                      <span
                        className="hidden h-px flex-1 bg-border md:block"
                        aria-hidden
                      />
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              render={<Link href="/events" />}
              nativeButton={false}
              size="lg"
              className="group h-11 gap-2 rounded-full px-6 font-semibold active:scale-[0.98]"
            >
              <span>Start with the catalog</span>
              <span className="flex size-6 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform duration-200 group-hover:translate-x-0.5">
                <ArrowRight className="size-3.5" data-icon="inline-end" />
              </span>
            </Button>
            <p className="text-sm text-muted-foreground">
              No account needed to browse. Sign in only when you reserve.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
