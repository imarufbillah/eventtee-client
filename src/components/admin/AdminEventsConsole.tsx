"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Filter, ArrowLeft, CheckCircle2, Sparkles, Ban, Trash2, RefreshCw, Loader2, Edit, Eye, Ticket, ShieldCheck, User as UserIcon } from "lucide-react";
import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import { EventStatusDialog, type EventStatusAction } from "@/components/events/EventStatusDialog";

interface AdminEventsConsoleProps {
  initialEvents: Event[];
}

export function AdminEventsConsole({ initialEvents }: AdminEventsConsoleProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ALL" | "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED" | "DELETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusDialogState, setStatusDialogState] = useState<{
    event: Event;
    action: EventStatusAction;
  } | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((ev) => {
      // Tab filter
      if (activeTab === "DELETED") {
        if (!ev.isDeleted) return false;
      } else if (activeTab !== "ALL") {
        if (ev.isDeleted || ev.status !== activeTab) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = ev.title?.toLowerCase().includes(query);
        const locationMatch = ev.location?.toLowerCase().includes(query);
        const categoryMatch = ev.category?.name?.toLowerCase().includes(query);
        const organizerMatch = ev.organizer?.name?.toLowerCase().includes(query);

        return titleMatch || locationMatch || categoryMatch || organizerMatch;
      }

      return true;
    });
  }, [initialEvents, activeTab, searchQuery]);

  const handleSoftDelete = async (eventId: string) => {
    setActionLoadingId(eventId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/events/soft-delete/${eventId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Delete Failed",
          description: json.message || "Failed to soft-delete event.",
        });
        return;
      }

      toast.add({
        title: "Event Soft-Deleted",
        description: "Event has been hidden from public catalog views.",
      });

      router.refresh();
    } catch (err) {
      console.error("Soft delete error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (eventId: string) => {
    setActionLoadingId(eventId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/events/restore/${eventId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Restore Failed",
          description: json.message || "Failed to restore event.",
        });
        return;
      }

      toast.add({
        title: "Event Restored!",
        description: "Event is now restored to active status.",
      });

      router.refresh();
    } catch (err) {
      console.error("Restore error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
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

  const counts = {
    ALL: initialEvents.filter((e) => !e.isDeleted).length,
    DRAFT: initialEvents.filter((e) => !e.isDeleted && e.status === "DRAFT").length,
    PUBLISHED: initialEvents.filter((e) => !e.isDeleted && e.status === "PUBLISHED").length,
    CANCELLED: initialEvents.filter((e) => !e.isDeleted && e.status === "CANCELLED").length,
    COMPLETED: initialEvents.filter((e) => !e.isDeleted && e.status === "COMPLETED").length,
    DELETED: initialEvents.filter((e) => e.isDeleted).length,
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="space-y-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Dashboard Console</span>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <ShieldCheck className="size-7 text-primary" />
          <span>System-Wide Event Override Console</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          View, edit, publish, cancel, soft-delete, or restore any event in the system.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-4 sm:p-5 space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-full border border-border/50">
              {(["ALL", "DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED", "DELETED"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-background text-foreground shadow-xs border border-border/60"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "ALL" ? "Active Events" : tab} ({counts[tab]})
                  </button>
                );
              })}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search title, venue, host…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-full text-xs bg-card border-border/70"
              />
            </div>

          </div>

        </div>
      </div>

      {/* Events Board List */}
      {filteredEvents.length === 0 ? (
        <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-dashed border-border bg-background/90 px-6 py-16 text-center space-y-3">
            <Filter className="mx-auto size-10 text-muted-foreground/40" />
            <h3 className="font-display text-lg font-bold text-foreground">
              No matching events found
            </h3>
            <p className="max-w-sm mx-auto text-xs text-muted-foreground">
              No system events match your search query or selected status filter tab.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const booked = ev.bookedSeats || 0;
            const cap = ev.capacity || 1;
            const percent = Math.min(100, Math.round((booked / cap) * 100));
            const isDraft = ev.status === "DRAFT";
            const isLoading = actionLoadingId === ev.id;

            return (
              <div
                key={ev.id}
                className="rounded-[1.75rem] border border-border/80 bg-card/80 p-2 shadow-xs transition-all hover:border-primary/40"
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] border border-border/50 bg-background/95 p-5 sm:p-6 space-y-4">
                  
                  {/* Top Row: Details & Actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {ev.isDeleted && (
                          <Badge variant="destructive" className="font-mono text-[10px] gap-1">
                            <Trash2 className="size-3" />
                            <span>DELETED</span>
                          </Badge>
                        )}
                        {getStatusBadge(ev.status)}
                        {ev.category && (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {ev.category.name}
                          </Badge>
                        )}
                        <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                          <UserIcon className="size-3 text-primary" />
                          <span>Host: {ev.organizer?.name || "Unknown Host"}</span>
                        </span>
                      </div>

                      <Link
                        href={`/events/${ev.id}`}
                        className="font-display text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors block"
                      >
                        {ev.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
                        <span>Venue: <strong className="text-foreground">{ev.location}</strong></span>
                        <span>Date: <strong className="text-foreground">{formatDate(ev.startDate)}</strong></span>
                        <span>Price: <strong className="text-foreground">${Number(ev.price || 0).toFixed(2)}</strong></span>
                      </div>
                    </div>

                    {/* Action Shortcut Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {!ev.isDeleted && isDraft && (
                        <Button
                          size="sm"
                          onClick={() => setStatusDialogState({ event: ev, action: "PUBLISH" })}
                          className="rounded-full text-xs font-bold px-4"
                        >
                          <Sparkles className="mr-1.5 size-3.5" />
                          Go Live
                        </Button>
                      )}

                      {!ev.isDeleted && (isDraft || ev.status === "PUBLISHED") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusDialogState({ event: ev, action: "CANCEL" })}
                          className="rounded-full text-xs font-semibold gap-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/30"
                        >
                          <Ban className="size-3.5" />
                          <span>Cancel</span>
                        </Button>
                      )}

                      {!ev.isDeleted ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isLoading}
                          onClick={() => handleSoftDelete(ev.id)}
                          className="rounded-full text-xs font-semibold gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        >
                          {isLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="size-3.5" />
                              <span>Delete</span>
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          disabled={isLoading}
                          onClick={() => handleRestore(ev.id)}
                          className="rounded-full text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          {isLoading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="size-3.5" />
                              <span>Restore</span>
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        render={<Link href={`/dashboard/events/${ev.id}/edit`} />}
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs font-semibold gap-1.5"
                      >
                        <Edit className="size-3.5" />
                        <span>Edit</span>
                      </Button>

                      <Button
                        render={<Link href={`/dashboard/events/${ev.id}/bookings`} />}
                        nativeButton={false}
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs font-semibold gap-1.5"
                      >
                        <Ticket className="size-3.5 text-primary" />
                        <span>Bookings</span>
                      </Button>

                      <Button
                        render={<Link href={`/events/${ev.id}`} />}
                        nativeButton={false}
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-xs font-semibold gap-1"
                      >
                        <Eye className="size-3.5" />
                        <span>View</span>
                      </Button>
                    </div>
                  </div>

                  {/* Seat Capacity Progress Bar */}
                  <div className="space-y-1.5 pt-3 border-t border-border/40 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Capacity Reserved</span>
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
              </div>
            );
          })}
        </div>
      )}

      {/* Status Action Confirmation Modal */}
      {statusDialogState && (
        <EventStatusDialog
          event={statusDialogState.event}
          action={statusDialogState.action}
          isOpen={true}
          onClose={() => setStatusDialogState(null)}
        />
      )}

    </div>
  );
}
