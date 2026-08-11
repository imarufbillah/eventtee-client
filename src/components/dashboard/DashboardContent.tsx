"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import type { Booking, Event, User } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { UserBookingsWidget } from "@/components/dashboard/UserBookingsWidget";
import { OrganizerEventsWidget } from "@/components/dashboard/OrganizerEventsWidget";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { Reveal } from "@/components/motion/Reveal";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function DashboardContent() {
  const { data: session } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    let isMounted = true;

    async function loadData() {
      try {
        const userRes = await fetch(`${SERVER_URL}/api/v1/users/me`, {
          credentials: "include",
        });

        if (!userRes.ok) {
          if (isMounted) setLoading(false);
          return;
        }

        const userJson = await userRes.json();
        const userData: User | null = userJson?.data || null;
        if (isMounted) setUser(userData);

        if (!userData) {
          if (isMounted) setLoading(false);
          return;
        }

        const isOrg = userData.role === "ORGANIZER" || userData.role === "ADMIN";

        const [bookingsRes, eventsRes] = await Promise.all([
          fetch(`${SERVER_URL}/api/v1/bookings/user/${userData.id}?limit=20`, {
            credentials: "include",
          }).then((res) => (res.ok ? res.json() : null)),
          isOrg
            ? fetch(`${SERVER_URL}/api/v1/events/organizer/me?limit=20`, {
                credentials: "include",
              }).then((res) => (res.ok ? res.json() : null))
            : Promise.resolve(null),
        ]);

        if (isMounted) {
          if (bookingsRes?.data?.bookings) setBookings(bookingsRes.data.bookings);
          else if (bookingsRes?.data?.items) setBookings(bookingsRes.data.items);
          else if (Array.isArray(bookingsRes?.data)) setBookings(bookingsRes.data);

          if (eventsRes?.data?.events) setEvents(eventsRes.data.events);
          else if (eventsRes?.data?.items) setEvents(eventsRes.data.items);
          else if (Array.isArray(eventsRes?.data)) setEvents(eventsRes.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <Reveal y={12}>
          <DashboardHeader user={user} />
        </Reveal>

        <Reveal y={12} delay={0.05}>
          <DashboardMetrics user={user} bookings={bookings} events={events} />
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
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

            {isOrganizer && (
              <Reveal y={14} delay={0.15}>
                <UserBookingsWidget bookings={bookings} />
              </Reveal>
            )}
          </div>

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
