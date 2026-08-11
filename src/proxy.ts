import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth guard is handled entirely client-side via AuthGuard component.
 *
 * Why not server-side? The Better Auth session cookies are set on the Express
 * backend domain (Render). When the browser requests a Next.js page on Vercel,
 * it does NOT forward those cross-domain cookies. Any server-side session check
 * via fetch(..., { headers: { cookie } }) will always return 401 in production.
 *
 * The AuthGuard component (src/components/auth/AuthGuard.tsx) calls
 * useSession() which makes a browser-initiated credentialed request to Render,
 * which does receive the cookies correctly.
 */
export async function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/sign-in", "/sign-up"],
};
