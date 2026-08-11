import type { Metadata } from "next";
import { BookingsPageContent } from "@/components/dashboard/BookingsPageContent";

export const metadata: Metadata = {
  title: "My Ticket Bookings — Eventtee",
  description: "View and manage all your event seat reservations.",
};

export default function BookingsPage() {
  return <BookingsPageContent />;
}
