"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { Event } from "@/lib/types";
import { OrganizerEventsConsole } from "@/components/events/OrganizerEventsConsole";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function OrganizerEventsPageContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(`${SERVER_URL}/api/v1/events/organizer/me?limit=50`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!isMounted) return;
        if (json?.data?.events) setEvents(json.data.events);
        else if (json?.data?.items) setEvents(json.data.items);
        else if (Array.isArray(json?.data)) setEvents(json.data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
        <OrganizerEventsConsole initialEvents={events} />
      </div>
    </div>
  );
}
