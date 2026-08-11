import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/lib/types";
import { AdminUsersConsole } from "@/components/admin/AdminUsersConsole";

export const metadata: Metadata = {
  title: "User Management — Admin Console",
  description: "View and manage system user accounts, roles, and status.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function AdminUsersPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // 1. Fetch current user profile & verify ADMIN role
  let currentUser: User | null = null;

  try {
    const userRes = await fetch(`${SERVER_URL}/api/v1/users/me`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (userRes.ok) {
      const userJson = await userRes.json();
      currentUser = userJson?.data || null;
    }
  } catch (error) {
    console.error("Profile fetch error in /admin/users:", error);
  }

  if (!currentUser) {
    redirect("/sign-in?redirect=%2Fadmin%2Fusers");
  }

  if (currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // 2. Fetch All System Users
  let users: User[] = [];

  try {
    const usersRes = await fetch(`${SERVER_URL}/api/v1/users?limit=100`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (usersRes.ok) {
      const json = await usersRes.json();
      if (json?.data?.users) {
        users = json.data.users;
      } else if (json?.data?.items) {
        users = json.data.items;
      } else if (Array.isArray(json?.data)) {
        users = json.data;
      }
    }
  } catch (error) {
    console.error("Users fetch error in /admin/users:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminUsersConsole initialUsers={users} currentAdminId={currentUser.id} />
      </div>
    </div>
  );
}
