import type { Metadata } from "next";
import { AdminEventsPageContent } from "@/components/admin/AdminEventsPageContent";

export const metadata: Metadata = {
  title: "Event Override Board — Admin Console",
  description: "System-wide administrative control over all hosted events.",
};

export default function AdminEventsPage() {
  return <AdminEventsPageContent />;
}
