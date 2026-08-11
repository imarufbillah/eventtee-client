import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Booking, Event, User } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { UserBookingsWidget } from "@/components/dashboard/UserBookingsWidget";
import { OrganizerEventsWidget } from "@/components/dashboard/OrganizerEventsWidget";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Dashboard Console — Eventtee",
  description: "Manage your live event bookings, ticket reservations, and hosted event capacity.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // 1. Fetch current user profile from GET /api/v1/users/me
  let user: User | null = null;

  try {
    const userRes = await fetch(`${SERVER_URL}/api/v1/users/me`, {
      headers: {
        cookie: cookieHeader,
      },
      next: { revalidate: 0 },
    });

    if (userRes.ok) {
      const userJson = await userRes.json();
      user = userJson?.data || null;
    }
  } catch (error) {
    console.error("Dashboard profile fetch error:", error);
  }

  if (!user) {
    return null;
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  // 2. Fetch User Bookings & Organizer Events in parallel
  let bookings: Booking[] = [];
  let events: Event[] = [];

  try {
    const fetchBookings = fetch(`${SERVER_URL}/api/v1/bookings/user/${user.id}?limit=20`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    }).then((res) => (res.ok ? res.json() : null));

    const fetchOrganizerEvents = isOrganizer
      ? fetch(`${SERVER_URL}/api/v1/events/organizer/me?limit=20`, {
          headers: { cookie: cookieHeader },
          next: { revalidate: 0 },
        }).then((res) => (res.ok ? res.json() : null))
      : Promise.resolve(null);

    const [bookingsRes, eventsRes] = await Promise.all([
      fetchBookings,
      fetchOrganizerEvents,
    ]);

    if (bookingsRes?.data?.bookings) {
      bookings = bookingsRes.data.bookings;
    } else if (bookingsRes?.data?.items) {
      bookings = bookingsRes.data.items;
    } else if (Array.isArray(bookingsRes?.data)) {
      bookings = bookingsRes.data;
    }

    if (eventsRes?.data?.events) {
      events = eventsRes.data.events;
    } else if (eventsRes?.data?.items) {
      events = eventsRes.data.items;
    } else if (Array.isArray(eventsRes?.data)) {
      events = eventsRes.data;
    }
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Welcome Header */}
        <Reveal y={12}>
          <DashboardHeader user={user} />
        </Reveal>

        {/* Metric Stat Bento Cards */}
        <Reveal y={12} delay={0.05}>
          <DashboardMetrics user={user} bookings={bookings} events={events} />
        </Reveal>

        {/* Main Bento Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* Primary Feed Column */}
          <div className="lg:col-span-8 space-y-8">
            {isOrganizer ? (
              <Reveal y={14} delay={0.1}>
                <OrganizerEventsWidget events={events} />
              </Reveal>
            ) : (
              <Reveal y={14} delay={0.1}>
                <UserBookingsWidget bookings={bookings} />
              </Reveal>
            )}

            {/* Cross-Role Secondary Widget (Organizers also get User Bookings preview) */}
            {isOrganizer && (
              <Reveal y={14} delay={0.15}>
                <UserBookingsWidget bookings={bookings} />
              </Reveal>
            )}
          </div>

          {/* Secondary Utility Sidebar Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
            <Reveal y={14} delay={0.12}>
              <QuickActionsCard user={user} />
            </Reveal>
          </div>

        </div>

      </div>
    </div>
  );
}
