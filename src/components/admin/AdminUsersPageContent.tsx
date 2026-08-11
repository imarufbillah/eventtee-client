"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import type { User } from "@/lib/types";
import { AdminUsersConsole } from "@/components/admin/AdminUsersConsole";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function AdminUsersPageContent() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(`${SERVER_URL}/api/v1/users?limit=100`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!isMounted) return;
        if (json?.data?.users) setUsers(json.data.users);
        else if (json?.data?.items) setUsers(json.data.items);
        else if (Array.isArray(json?.data)) setUsers(json.data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col pt-20 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminUsersConsole initialUsers={users} currentAdminId={session?.user?.id ?? ""} />
      </div>
    </div>
  );
}
