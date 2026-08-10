"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, Users, CheckCircle, XCircle, Edit, Loader2 } from "lucide-react";
import type { Event } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface EventOrganizerControlsProps {
  event: Event;
}

export function EventOrganizerControls({ event }: EventOrganizerControlsProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  if (!session?.user) return null;

  const isOrganizer = session.user.id === event.organizerId;
  const userRole = (session.user as { role?: string }).role;
  const isAdmin = userRole === "ADMIN";

  if (!isOrganizer && !isAdmin) return null;

  const handlePublish = async () => {
    if (!confirm("Are you sure you want to publish this event to the public catalog?")) {
      return;
    }

    setIsLoading(true);
    setMsg(null);
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/api/v1/events/publish/${event.id}`, {
        method: "PATCH",
        credentials: "include",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setMsg({ text: json.message || "Failed to publish event", type: "error" });
        return;
      }

      setMsg({ text: "Event published successfully!", type: "success" });
      router.refresh();
    } catch {
      setMsg({ text: "Network error occurred", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to CANCEL this event? Attendees will be notified.")) {
      return;
    }

    setIsLoading(true);
    setMsg(null);
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${serverUrl}/api/v1/events/cancel/${event.id}`, {
        method: "PATCH",
        credentials: "include",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        setMsg({ text: json.message || "Failed to cancel event", type: "error" });
        return;
      }

      setMsg({ text: "Event cancelled successfully", type: "success" });
      router.refresh();
    } catch {
      setMsg({ text: "Network error occurred", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Settings className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-foreground">
                Organizer Control Panel
              </span>
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-[11px] font-bold text-primary uppercase">
                {event.status}
              </span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              You are managing this event as {isAdmin ? "Admin" : "Host"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {event.status === "DRAFT" && (
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={isLoading}
              className="rounded-full text-xs font-semibold"
            >
              {isLoading ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : <CheckCircle className="mr-1.5 size-3.5" />}
              Publish Event
            </Button>
          )}

          {event.status !== "CANCELLED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-full border-destructive/40 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <XCircle className="mr-1.5 size-3.5" />
              Cancel Event
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/dashboard/events/${event.id}/edit`} />}
            className="rounded-full text-xs font-medium"
          >
            <Edit className="mr-1.5 size-3.5" />
            Edit Event
          </Button>

          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={`/dashboard/events/${event.id}/bookings`} />}
            className="rounded-full text-xs font-medium"
          >
            <Users className="mr-1.5 size-3.5" />
            Bookings
          </Button>
        </div>
      </div>

      {msg && (
        <p
          className={`mt-3 font-mono text-xs font-semibold ${
            msg.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
