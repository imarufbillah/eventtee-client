import type { Metadata } from "next";
import { EditEventPageContent } from "@/components/events/EditEventPageContent";

export const metadata: Metadata = {
  title: "Edit Event — Eventtee",
  description: "Update event details, ticket price, capacity, and schedule.",
};

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  return <EditEventPageContent eventId={id} />;
}
