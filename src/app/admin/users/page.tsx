import type { Metadata } from "next";
import { AdminUsersPageContent } from "@/components/admin/AdminUsersPageContent";

export const metadata: Metadata = {
  title: "User Registry — Admin Console",
  description: "System-wide administrative user management.",
};

export default function AdminUsersPage() {
  return <AdminUsersPageContent />;
}
