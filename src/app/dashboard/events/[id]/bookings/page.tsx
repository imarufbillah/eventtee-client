import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { Event, Booking, User } from "@/lib/types";
import { EventBookingsConsole } from "@/components/events/EventBookingsConsole";

export const metadata: Metadata = {
  title: "Attendee Bookings — Eventtee",
  description: "View ticket reservations and manage attendee booking confirmations.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface EventBookingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventBookingsPage({ params }: EventBookingsPageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // 1. Fetch current user profile
  let user: User | null = null;

  try {
    const userRes = await fetch(`${SERVER_URL}/api/v1/users/me`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (userRes.ok) {
      const userJson = await userRes.json();
      user = userJson?.data || null;
    }
  } catch (error) {
    console.error("Profile fetch error in /dashboard/events/[id]/bookings:", error);
  }

  if (!user) {
    return null;
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";
  if (!isOrganizer) {
    return null;
  }

  // 2. Fetch Event Details and Bookings in Parallel
  let event: Event | null = null;
  let bookings: Booking[] = [];

  try {
    const fetchEvent = fetch(`${SERVER_URL}/api/v1/events/${id}`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    }).then((res) => (res.ok ? res.json() : null));

    const fetchBookings = fetch(`${SERVER_URL}/api/v1/events/${id}/bookings`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    }).then((res) => (res.ok ? res.json() : null));

    const [eventRes, bookingsRes] = await Promise.all([fetchEvent, fetchBookings]);

    if (eventRes?.data) {
      event = eventRes.data;
    }

    if (bookingsRes?.data?.bookings) {
      bookings = bookingsRes.data.bookings;
    } else if (bookingsRes?.data?.items) {
      bookings = bookingsRes.data.items;
    } else if (Array.isArray(bookingsRes?.data)) {
      bookings = bookingsRes.data;
    }
  } catch (error) {
    console.error("Data fetch error in /dashboard/events/[id]/bookings:", error);
  }

  if (!event) {
    notFound();
  }

  // 3. Ownership Guard: Must be organizer of this event or ADMIN
  const isOwner = event.organizerId === user.id || user.role === "ADMIN";
  if (!isOwner) {
    return null;
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <EventBookingsConsole event={event} bookings={bookings} />
      </div>
    </div>
  );
}
