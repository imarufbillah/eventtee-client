"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface AuthGuardProps {
  children: React.ReactNode;
  /** When set, redirects to /events if the user's role doesn't match. */
  requiredRole?: "ADMIN" | "ORGANIZER";
}

/**
 * Client-side auth gate for protected routes.
 *
 * Why client-side? The Better Auth session cookies are issued by the Express
 * server (Render) and are scoped to that domain. Next.js server components
 * (running on Vercel) never receive those cookies from the browser, so any
 * server-side session check returns 401. useSession() calls the Render API
 * directly from the browser with credentials, which does work cross-origin.
 */
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    const user = session.user as typeof session.user & { role?: string };
    if (requiredRole && user.role !== requiredRole) {
      router.replace("/events");
    }
  }, [session, isPending, router, pathname, requiredRole]);

  if (isPending) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Return null while the redirect effect fires so no flash of protected content
  if (!session?.user) return null;
  const user = session.user as typeof session.user & { role?: string };
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}
