import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Category, User } from "@/lib/types";
import { EventForm } from "@/components/events/EventForm";

export const metadata: Metadata = {
  title: "Create New Event — Eventtee",
  description: "Create a new event listing with ticket pricing, capacity, and schedule.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function CreateEventPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // 1. Fetch user profile and verify role
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
    console.error("Profile fetch error in /dashboard/events/new:", error);
  }

  if (!user) {
    return null;
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";
  if (!isOrganizer) {
    return null;
  }

  // 2. Fetch Active Categories
  let categories: Category[] = [];

  try {
    const catRes = await fetch(`${SERVER_URL}/api/v1/categories/active?limit=100`, {
      next: { revalidate: 60 },
    });

    if (catRes.ok) {
      const json = await catRes.json();
      if (json?.data?.categories) {
        categories = json.data.categories;
      } else if (Array.isArray(json?.data)) {
        categories = json.data;
      }
    }
  } catch (error) {
    console.error("Category fetch error in /dashboard/events/new:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <EventForm categories={categories} />
      </div>
    </div>
  );
}
