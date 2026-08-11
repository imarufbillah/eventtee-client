import type { Metadata } from "next";
import { AdminReviewsPageContent } from "@/components/admin/AdminReviewsPageContent";

export const metadata: Metadata = {
  title: "Reviews Board — Admin Console",
  description: "Moderate all event reviews.",
};

export default function AdminReviewsPage() {
  return <AdminReviewsPageContent />;
}
