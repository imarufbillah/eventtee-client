import { Search, Ticket, Star, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Search,
      title: "1. Discover & Filter",
      description:
        "Explore upcoming concerts, tech conferences, and workshops filtered by category, date, or seat availability.",
    },
    {
      icon: Ticket,
      title: "2. Instant Seat Reservation",
      description:
        "Select your seat count and confirm instantly. Our database transaction engine prevents double-bookings in real time.",
    },
    {
      icon: Star,
      title: "3. Attend & Leave Reviews",
      description:
        "Access digital ticket details from your dashboard. After completing the event, share verified attendee reviews.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/20 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary mb-2">
            <CheckCircle2 className="size-3.5" />
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            How Eventtee Works
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            From event discovery to instant ticket reservations in 3 simple
            steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-background/80 p-6 shadow-xs backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:shadow-md dark:bg-card/60"
              >
                <div>
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
