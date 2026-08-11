import type { Metadata } from "next";
import { EventBookingsPageContent } from "@/components/events/EventBookingsPageContent";

export const metadata: Metadata = {
  title: "Attendee Bookings — Eventtee",
  description: "View ticket reservations and manage attendee booking confirmations.",
};

interface EventBookingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventBookingsPage({ params }: EventBookingsPageProps) {
  const { id } = await params;
  return <EventBookingsPageContent eventId={id} />;
}
