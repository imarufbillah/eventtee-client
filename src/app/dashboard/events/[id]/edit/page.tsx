import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import type { Category, Event, User } from "@/lib/types";
import { EventForm } from "@/components/events/EventForm";

export const metadata: Metadata = {
  title: "Edit Event — Eventtee",
  description: "Update event details, ticket price, capacity, and schedule.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
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
    console.error("Profile fetch error in /dashboard/events/[id]/edit:", error);
  }

  if (!user) {
    return null;
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";
  if (!isOrganizer) {
    return null;
  }

  // 2. Fetch Event Details and Active Categories in Parallel
  let event: Event | null = null;
  let categories: Category[] = [];

  try {
    const fetchEvent = fetch(`${SERVER_URL}/api/v1/events/${id}`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    }).then((res) => (res.ok ? res.json() : null));

    const fetchCategories = fetch(`${SERVER_URL}/api/v1/categories/active?limit=100`, {
      next: { revalidate: 60 },
    }).then((res) => (res.ok ? res.json() : null));

    const [eventRes, catRes] = await Promise.all([fetchEvent, fetchCategories]);

    if (eventRes?.data) {
      event = eventRes.data;
    }

    if (catRes?.data?.categories) {
      categories = catRes.data.categories;
    } else if (Array.isArray(catRes?.data)) {
      categories = catRes.data;
    }
  } catch (error) {
    console.error("Data fetch error in /dashboard/events/[id]/edit:", error);
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
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <EventForm categories={categories} initialEvent={event} isEdit={true} />
      </div>
    </div>
  );
}
