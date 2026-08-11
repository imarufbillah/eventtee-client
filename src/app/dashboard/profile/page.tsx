import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { User } from "@/lib/types";
import { UserProfileConsole } from "@/components/profile/UserProfileConsole";

export const metadata: Metadata = {
  title: "Account Profile — Eventtee",
  description: "Manage your personal profile details, avatar image, and account settings.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // Fetch current user profile
  let user: User | null = null;

  try {
    const userRes = await fetch(`${SERVER_URL}/api/v1/users/me`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (userRes.ok) {
      const userJson = await userRes.json();
      user = userJson?.data || null;
    }
  } catch (error) {
    console.error("Profile fetch error in /dashboard/profile:", error);
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <UserProfileConsole user={user} />
      </div>
    </div>
  );
}
