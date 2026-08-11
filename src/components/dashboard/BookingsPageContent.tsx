"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import type { Booking } from "@/lib/types";
import { UserBookingsConsole } from "@/components/bookings/UserBookingsConsole";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function BookingsPageContent() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    let isMounted = true;
    fetch(`${SERVER_URL}/api/v1/bookings/user/${session.user.id}?limit=50`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!isMounted) return;
        if (json?.data?.bookings) setBookings(json.data.bookings);
        else if (json?.data?.items) setBookings(json.data.items);
        else if (Array.isArray(json?.data)) setBookings(json.data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

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

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <UserBookingsConsole initialBookings={bookings} />
      </div>
    </div>
  );
}
