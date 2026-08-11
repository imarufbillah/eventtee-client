"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export type EventStatusAction = "PUBLISH" | "CANCEL";

interface EventStatusDialogProps {
  event: Event;
  action: EventStatusAction;
  isOpen: boolean;
  onClose: () => void;
}

export function EventStatusDialog({ event, action, isOpen, onClose }: EventStatusDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isPublish = action === "PUBLISH";

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const endpoint = isPublish
        ? `${SERVER_URL}/api/v1/events/publish/${event.id}`
        : `${SERVER_URL}/api/v1/events/cancel/${event.id}`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: isPublish ? "Publish Failed" : "Cancellation Failed",
          description: json.message || "Failed to update event status.",
        });
        return;
      }

      toast.add({
        title: isPublish ? "Event Published Live!" : "Event Cancelled",
        description: isPublish
          ? `"${event.title}" is now open for attendee ticket bookings.`
          : `"${event.title}" status has been set to CANCELLED.`,
      });

      onClose();
      router.refresh();
    } catch (err) {
      console.error("Status update error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[2rem] border border-border/80 bg-card p-2 shadow-2xl">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background p-6 space-y-5 text-center">
          
          {/* Action Icon */}
          <div
            className={`mx-auto flex size-12 items-center justify-center rounded-full ${
              isPublish
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-destructive/10 text-destructive border border-destructive/20"
            }`}
          >
            {isPublish ? <Sparkles className="size-6" /> : <AlertTriangle className="size-6" />}
          </div>

          {/* Title & Warning Text */}
          <div className="space-y-1.5">
            <h3 className="font-display text-lg font-bold text-foreground">
              {isPublish ? "Publish Event Live?" : "Cancel Event Listing?"}
            </h3>
            <p className="font-mono text-xs font-semibold text-primary">
              &ldquo;{event.title}&rdquo;
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              {isPublish
                ? "Publishing will immediately list this event on the public catalog board and enable seat reservations for attendees."
                : "Cancelling will mark this event as CANCELLED and prevent any further seat bookings."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-full text-xs font-semibold"
            >
              Back
            </Button>

            <Button
              variant={isPublish ? "default" : "destructive"}
              size="sm"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 rounded-full text-xs font-bold gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : isPublish ? (
                "Publish Live"
              ) : (
                "Cancel Event"
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
