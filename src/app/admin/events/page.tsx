import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Event, User } from "@/lib/types";
import { AdminEventsConsole } from "@/components/admin/AdminEventsConsole";

export const metadata: Metadata = {
  title: "Event Override Board — Admin Console",
  description: "System-wide administrative control over all hosted events.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function AdminEventsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // 1. Fetch current user profile & verify ADMIN role
  let currentUser: User | null = null;

  try {
    const userRes = await fetch(`${SERVER_URL}/api/v1/users/me`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (userRes.ok) {
      const userJson = await userRes.json();
      currentUser = userJson?.data || null;
    }
  } catch (error) {
    console.error("Profile fetch error in /admin/events:", error);
  }

  if (!currentUser) {
    return null;
  }

  if (currentUser.role !== "ADMIN") {
    return null;
  }

  // 2. Fetch All System Events (including deleted ones)
  let events: Event[] = [];

  try {
    const eventsRes = await fetch(`${SERVER_URL}/api/v1/events?includeDeleted=true&limit=100`, {
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
    console.error("Events fetch error in /admin/events:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminEventsConsole initialEvents={events} />
      </div>
    </div>
  );
}
