import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Category, User } from "@/lib/types";
import { AdminCategoriesConsole } from "@/components/admin/AdminCategoriesConsole";

export const metadata: Metadata = {
  title: "Category Management — Admin Console",
  description: "Manage event category taxonomies, creation, editing, and status.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function AdminCategoriesPage() {
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
    console.error("Profile fetch error in /admin/categories:", error);
  }

  if (!currentUser) {
    return null;
  }

  if (currentUser.role !== "ADMIN") {
    return null;
  }

  // 2. Fetch All Categories (including deleted ones)
  let categories: Category[] = [];

  try {
    const catRes = await fetch(`${SERVER_URL}/api/v1/categories?includeDeleted=true&limit=100`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (catRes.ok) {
      const json = await catRes.json();
      if (json?.data?.categories) {
        categories = json.data.categories;
      } else if (json?.data?.items) {
        categories = json.data.items;
      } else if (Array.isArray(json?.data)) {
        categories = json.data;
      }
    }
  } catch (error) {
    console.error("Categories fetch error in /admin/categories:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminCategoriesConsole initialCategories={categories} />
      </div>
    </div>
  );
}
