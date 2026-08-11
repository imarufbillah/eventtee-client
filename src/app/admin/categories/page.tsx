import type { Metadata } from "next";
import { AdminCategoriesPageContent } from "@/components/admin/AdminCategoriesPageContent";

export const metadata: Metadata = {
  title: "Categories Board — Admin Console",
  description: "Manage all event categories.",
};

export default function AdminCategoriesPage() {
  return <AdminCategoriesPageContent />;
}
