import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Event, User } from "@/lib/types";
import { OrganizerEventsConsole } from "@/components/events/OrganizerEventsConsole";

export const metadata: Metadata = {
  title: "Hosted Events Board — Eventtee",
  description: "Manage your created event listings, seat capacity, and publishing status.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function HostedEventsPage() {
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
    console.error("Profile fetch error in /dashboard/events:", error);
  }

  if (!user) {
    return null;
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";
  if (!isOrganizer) {
    return null;
  }

  // 2. Fetch Organizer's Hosted Events
  let events: Event[] = [];

  try {
    const eventsRes = await fetch(`${SERVER_URL}/api/v1/events/organizer/me?limit=50`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (eventsRes.ok) {
      const json = await eventsRes.json();
      if (json?.data?.events) {
        events = json.data.events;
      } else if (json?.data?.items) {
        events = json.data.items;
      } else if (Array.isArray(json?.data)) {
        events = json.data;
      }
    }
  } catch (error) {
    console.error("Hosted events fetch error in /dashboard/events:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <OrganizerEventsConsole initialEvents={events} />
      </div>
    </div>
  );
}
