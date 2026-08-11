import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  // Check if route requires auth check
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

  if (!isDashboardRoute && !isAdminRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Fetch session from server auth API
  let sessionData: {
    user?: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    session?: Record<string, unknown>;
  } | null = null;

  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const res = await fetch(`${SERVER_URL}/api/auth/get-session`, {
      headers: {
        cookie: cookieHeader,
      },
    });

    if (res.ok) {
      sessionData = await res.json();
    }
  } catch (error) {
    console.error("Proxy session check error:", error);
  }

  const isAuthenticated = Boolean(sessionData?.user && sessionData?.session);
  const userRole = sessionData?.user?.role?.toUpperCase();

  // 1. Unauthenticated user trying to access protected dashboard or admin routes
  if (!isAuthenticated && (isDashboardRoute || isAdminRoute)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Authenticated user visiting /sign-in or /sign-up -> redirect to catalog/dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  // 3. Admin routes require ADMIN role
  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  // 4. Organizer events routes require ORGANIZER or ADMIN role
  const isOrganizerEventRoute =
    pathname.startsWith("/dashboard/events/new") ||
    pathname.startsWith("/dashboard/events");

  if (
    isOrganizerEventRoute &&
    userRole !== "ORGANIZER" &&
    userRole !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/dashboard/bookings", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/sign-in", "/sign-up"],
};
