import type { Metadata } from "next";
import { CreateEventPageContent } from "@/components/events/CreateEventPageContent";

export const metadata: Metadata = {
  title: "Create New Event — Eventtee",
  description: "Create a new event listing with ticket pricing, capacity, and schedule.",
};

export default function CreateEventPage() {
  return <CreateEventPageContent />;
}
