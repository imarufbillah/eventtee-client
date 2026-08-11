import type { Metadata } from "next";
import { OrganizerEventsPageContent } from "@/components/events/OrganizerEventsPageContent";

export const metadata: Metadata = {
  title: "Hosted Events Board — Eventtee",
  description: "Manage your created event listings, seat capacity, and publishing status.",
};

export default function HostedEventsPage() {
  return <OrganizerEventsPageContent />;
}
