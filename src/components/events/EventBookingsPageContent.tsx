"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Event, Booking } from "@/lib/types";
import { EventBookingsConsole } from "@/components/events/EventBookingsConsole";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface EventBookingsPageContentProps {
  eventId: string;
}

export function EventBookingsPageContent({ eventId }: EventBookingsPageContentProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${SERVER_URL}/api/v1/events/${eventId}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null)),
      fetch(`${SERVER_URL}/api/v1/events/${eventId}/bookings`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([eventRes, bookingsRes]) => {
        if (!eventRes?.data) {
          router.replace("/dashboard/events");
          return;
        }
        setEvent(eventRes.data);

        if (bookingsRes?.data?.bookings) setBookings(bookingsRes.data.bookings);
        else if (bookingsRes?.data?.items) setBookings(bookingsRes.data.items);
        else if (Array.isArray(bookingsRes?.data)) setBookings(bookingsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [eventId, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <EventBookingsConsole event={event} bookings={bookings} />
      </div>
    </div>
  );
}
