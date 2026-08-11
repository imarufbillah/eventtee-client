import { Ticket, Sparkles, Calendar, CheckCircle2, TrendingUp } from "lucide-react";
import type { Booking, Event, User } from "@/lib/types";

interface DashboardMetricsProps {
  user: User;
  bookings: Booking[];
  events: Event[];
}

export function DashboardMetrics({ user, bookings, events }: DashboardMetricsProps) {
  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  if (isOrganizer) {
    const totalEvents = events.length;
    const totalBookedSeats = events.reduce((acc, curr) => acc + (curr.bookedSeats || 0), 0);
    const totalCapacity = events.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
    const utilizationRate = totalCapacity > 0 ? Math.round((totalBookedSeats / totalCapacity) * 100) : 0;

    const stats = [
      {
        title: "Managed Events",
        value: totalEvents,
        subtext: `${events.filter(e => e.status === "PUBLISHED").length} live on board`,
        icon: Calendar,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        title: "Total Tickets Sold",
        value: totalBookedSeats,
        subtext: `Across ${totalEvents} total listings`,
        icon: Ticket,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      },
      {
        title: "Capacity Utilization",
        value: `${utilizationRate}%`,
        subtext: `${totalBookedSeats} of ${totalCapacity} total seats`,
        icon: TrendingUp,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
      },
    ];

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="rounded-[1.75rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-sm"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] border border-border/50 bg-background/90 p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </span>
                  <div className={`flex size-8 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon className="size-4" />
                  </div>
                </div>
                <div className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {stat.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Attendee Mode Metrics
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const totalSeats = bookings.reduce((acc, curr) => acc + (curr.seats || 0), 0);

  const stats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      subtext: `${confirmedBookings.length} confirmed tickets`,
      icon: Ticket,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Seats Reserved",
      value: totalSeats,
      subtext: "Protected against double bookings",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Active Reservations",
      value: bookings.filter((b) => b.status !== "CANCELLED").length,
      subtext: `${bookings.filter((b) => b.status === "PENDING").length} pending host confirmation`,
      icon: Sparkles,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="rounded-[1.75rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-sm"
          >
            <div className="rounded-[calc(1.75rem-0.375rem)] border border-border/50 bg-background/90 p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`flex size-8 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>
              <div className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                {stat.value}
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
