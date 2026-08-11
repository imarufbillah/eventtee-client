import { Star, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: "test-1",
    author: "Elena Rostova",
    role: "Tech Conference Attendee",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    initials: "ER",
    rating: 5,
    quote:
      "Reserving a seat on Eventtee was instantaneous. I love that remaining seats update live — no more arriving at a venue only to be told it's overbooked.",
    event: "DevSummit 2026",
  },
  {
    id: "test-2",
    author: "Marcus Vance",
    role: "Music & Festival Enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    initials: "MV",
    rating: 5,
    quote:
      "The verified attendee reviews gave me complete confidence before booking VIP front-row access. Zero seat duplication, super smooth UX.",
    event: "Neon Beats Festival",
  },
  {
    id: "test-3",
    author: "Sophia Chen",
    role: "Workshop Organizer & Attendee",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    initials: "SC",
    rating: 5,
    quote:
      "As an attendee and organizer, Eventtee sets a new standard. The real-time capacity board means zero double-bookings. Truly reliable.",
    event: "Design Systems Masterclass",
  },
];

const stats = [
  { label: "Atomic Seat Protection", value: "100%", subtext: "Zero double bookings" },
  { label: "Verified Reviews", value: "4.9 / 5", subtext: "Average attendee rating" },
  { label: "Live Availability", value: "Real-time", subtext: "Direct database sync" },
];

export function SocialProofSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 border-b border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-4 font-mono">
              <ShieldCheck className="size-3.5" />
              <span>Verified Attendee Feedback</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Trusted by fans, attendees &amp; hosts
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Every booking is protected at the database layer. Here is what real attendees say after experiencing live events booked through Eventtee.
            </p>
          </div>
        </Reveal>

        {/* Stats Strip */}
        <Reveal delay={0.08}>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center p-4">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                  {stat.value}
                </span>
                <span className="font-semibold text-sm text-foreground mt-1">
                  {stat.label}
                </span>
                <span className="font-mono text-xs text-muted-foreground mt-0.5">
                  {stat.subtext}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <Reveal key={t.id} delay={0.12 + index * 0.06} y={16}>
              <div className="flex flex-col justify-between h-full rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-transform duration-200 hover:-translate-y-1">
                <div className="space-y-4">
                  {/* Rating Stars & Event Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      {t.event}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-sm leading-relaxed text-foreground/90 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                  <Avatar className="size-9 border border-border">
                    <AvatarImage src={t.avatar} alt={t.author} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-xs text-foreground">
                      {t.author}
                    </h4>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
