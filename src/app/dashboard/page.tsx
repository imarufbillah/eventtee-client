import type { Metadata } from "next";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard Console — Eventtee",
  description: "Manage your live event bookings, ticket reservations, and hosted event capacity.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
