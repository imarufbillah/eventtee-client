import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Booking, User } from "@/lib/types";
import { UserBookingsConsole } from "@/components/bookings/UserBookingsConsole";

export const metadata: Metadata = {
  title: "My Ticket Bookings — Eventtee",
  description: "View and manage all your event seat reservations.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function BookingsPage() {
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
    console.error("Profile fetch error in /dashboard/bookings:", error);
  }

  if (!user) {
    return null;
  }

  // 2. Fetch User Bookings
  let bookings: Booking[] = [];

  try {
    const bookingsRes = await fetch(`${SERVER_URL}/api/v1/bookings/user/${user.id}?limit=50`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (bookingsRes.ok) {
      const json = await bookingsRes.json();
      if (json?.data?.bookings) {
        bookings = json.data.bookings;
      } else if (json?.data?.items) {
        bookings = json.data.items;
      } else if (Array.isArray(json?.data)) {
        bookings = json.data;
      }
    }
  } catch (error) {
    console.error("Bookings fetch error in /dashboard/bookings:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <UserBookingsConsole initialBookings={bookings} />
      </div>
    </div>
  );
}
