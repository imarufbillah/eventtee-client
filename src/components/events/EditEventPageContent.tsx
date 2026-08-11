"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Category, Event } from "@/lib/types";
import { EventForm } from "@/components/events/EventForm";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface EditEventPageContentProps {
  eventId: string;
}

export function EditEventPageContent({ eventId }: EditEventPageContentProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${SERVER_URL}/api/v1/events/${eventId}`, { credentials: "include" })
        .then((r) => (r.ok ? r.json() : null)),
      fetch(`${SERVER_URL}/api/v1/categories/active?limit=100`)
        .then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([eventRes, catRes]) => {
        if (!eventRes?.data) {
          router.replace("/dashboard/events");
          return;
        }
        setEvent(eventRes.data);

        if (catRes?.data?.categories) setCategories(catRes.data.categories);
        else if (Array.isArray(catRes?.data)) setCategories(catRes.data);
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
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <EventForm categories={categories} initialEvent={event} isEdit={true} />
      </div>
    </div>
  );
}
