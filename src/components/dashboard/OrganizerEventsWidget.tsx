"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Plus, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface OrganizerEventsWidgetProps {
  events: Event[];
}

export function OrganizerEventsWidget({ events }: OrganizerEventsWidgetProps) {
  const router = useRouter();
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handlePublish = async (eventId: string) => {
    setPublishingId(eventId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/events/publish/${eventId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Publish Failed",
          description: json.message || "Failed to publish event.",
        });
        return;
      }

      toast.add({
        title: "Event Published!",
        description: "Your event is now live on the catalog board.",
      });
      router.refresh();
    } catch (err) {
      console.error("Publish event error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setPublishingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <Badge variant="default" className="font-mono text-[10px] gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="size-3" />
            <span>PUBLISHED</span>
          </Badge>
        );
      case "DRAFT":
        return (
          <Badge variant="outline" className="font-mono text-[10px] gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
            <Sparkles className="size-3" />
            <span>DRAFT</span>
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="secondary" className="font-mono text-[10px] gap-1">
            <span>COMPLETED</span>
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive" className="font-mono text-[10px] gap-1">
            <span>CANCELLED</span>
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
      <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              Hosted Event Board
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Capacity tracking &amp; status oversight
            </p>
          </div>

          <Button
            render={<Link href="/dashboard/events/new" />}
            nativeButton={false}
            size="sm"
            className="rounded-full text-xs font-bold gap-1.5"
          >
            <Plus className="size-3.5" />
            <span>New Event</span>
          </Button>
        </div>

        {/* Events Board List */}
        {events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center space-y-3">
            <Calendar className="mx-auto size-10 text-muted-foreground/50" />
            <h3 className="font-display text-base font-bold text-foreground">
              No events hosted yet
            </h3>
            <p className="max-w-xs mx-auto text-xs text-muted-foreground">
              Set ticket price, date, and seat capacity. Put your first event on the board.
            </p>
            <Button
              render={<Link href="/dashboard/events/new" />}
              nativeButton={false}
              size="sm"
              className="rounded-full px-5 text-xs font-semibold"
            >
              Create First Event
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => {
              const booked = ev.bookedSeats || 0;
              const cap = ev.capacity || 1;
              const percent = Math.min(100, Math.round((booked / cap) * 100));
              const isPublishing = publishingId === ev.id;
              const isDraft = ev.status === "DRAFT";

              return (
                <div
                  key={ev.id}
                  className="space-y-3 rounded-2xl border border-border/70 bg-card/50 p-4 sm:p-5 transition-colors hover:bg-card/80"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(ev.status)}
                        {ev.category && (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {ev.category.name}
                          </Badge>
                        )}
                      </div>

                      <Link
                        href={`/events/${ev.id}`}
                        className="font-display text-base font-bold text-foreground hover:text-primary transition-colors block"
                      >
                        {ev.title}
                      </Link>

                      <p className="font-mono text-xs text-muted-foreground">
                        Starts: {formatDate(ev.startDate)} · Price: <strong className="text-foreground">${Number(ev.price || 0).toFixed(2)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {isDraft && (
                        <Button
                          size="sm"
                          disabled={isPublishing}
                          onClick={() => handlePublish(ev.id)}
                          className="rounded-full text-xs font-bold px-4"
                        >
                          {isPublishing ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            "Go Live"
                          )}
                        </Button>
                      )}

                      <Button
                        render={<Link href={`/events/${ev.id}`} />}
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs font-semibold"
                      >
                        Details
                      </Button>
                    </div>
                  </div>

                  {/* Seat Capacity Progress Bar */}
                  <div className="space-y-1 pt-1 border-t border-border/40">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-muted-foreground">Capacity Sold</span>
                      <span className="text-foreground font-bold">{booked} / {cap} seats ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
