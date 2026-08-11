import type { Metadata } from "next";
import { ProfilePageContent } from "@/components/profile/ProfilePageContent";

export const metadata: Metadata = {
  title: "Account Profile — Eventtee",
  description: "Manage your personal profile details, avatar image, and account settings.",
};

export default function ProfilePage() {
  return <ProfilePageContent />;
}
