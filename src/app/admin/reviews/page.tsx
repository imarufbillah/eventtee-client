import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { Review, User } from "@/lib/types";
import { AdminReviewsConsole } from "@/components/admin/AdminReviewsConsole";

export const metadata: Metadata = {
  title: "Review Moderation — Admin Console",
  description: "Moderate attendee reviews, ratings, soft-delete, and hard purge.",
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default async function AdminReviewsPage() {
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
    console.error("Profile fetch error in /admin/reviews:", error);
  }

  if (!currentUser) {
    return null;
  }

  if (currentUser.role !== "ADMIN") {
    return null;
  }

  // 2. Fetch All System Reviews (including deleted ones)
  let reviews: Review[] = [];

  try {
    const reviewsRes = await fetch(`${SERVER_URL}/api/v1/reviews?includeDeleted=true&limit=100`, {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    });

    if (reviewsRes.ok) {
      const json = await reviewsRes.json();
      if (json?.data?.reviews) {
        reviews = json.data.reviews;
      } else if (json?.data?.items) {
        reviews = json.data.items;
      } else if (Array.isArray(json?.data)) {
        reviews = json.data;
      }
    }
  } catch (error) {
    console.error("Reviews fetch error in /admin/reviews:", error);
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminReviewsConsole initialReviews={reviews} />
      </div>
    </div>
  );
}
