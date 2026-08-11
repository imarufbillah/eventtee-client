"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, Plus, Search, CheckCircle2, Sparkles, Filter, ArrowLeft, Users, Edit, Eye, Ticket, Ban } from "lucide-react";
import type { Event } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { EventStatusDialog, type EventStatusAction } from "./EventStatusDialog";

interface OrganizerEventsConsoleProps {
  initialEvents: Event[];
}

export function OrganizerEventsConsole({ initialEvents }: OrganizerEventsConsoleProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusDialogState, setStatusDialogState] = useState<{
    event: Event;
    action: EventStatusAction;
  } | null>(null);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((ev) => {
      // Tab filter
      if (activeTab !== "ALL" && ev.status !== activeTab) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = ev.title?.toLowerCase().includes(query);
        const locationMatch = ev.location?.toLowerCase().includes(query);
        const categoryMatch = ev.category?.name?.toLowerCase().includes(query);

        return titleMatch || locationMatch || categoryMatch;
      }

      return true;
    });
  }, [initialEvents, activeTab, searchQuery]);

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
    ALL: initialEvents.length,
    DRAFT: initialEvents.filter((e) => e.status === "DRAFT").length,
    PUBLISHED: initialEvents.filter((e) => e.status === "PUBLISHED").length,
    CANCELLED: initialEvents.filter((e) => e.status === "CANCELLED").length,
    COMPLETED: initialEvents.filter((e) => e.status === "COMPLETED").length,
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard Console</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Calendar className="size-7 text-primary" />
            <span>Hosted Events Board</span>
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Manage your created event listings, seat capacities, and publishing status.
          </p>
        </div>

        <Button
          render={<Link href="/dashboard/events/new" />}
          nativeButton={false}
          size="sm"
          className="rounded-full px-5 text-xs font-bold shrink-0 self-start sm:self-auto shadow-md active:scale-[0.98]"
        >
          <Plus className="mr-1.5 size-4" />
          <span>Create New Event</span>
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-4 sm:p-5 space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-full border border-border/50">
              {(["ALL", "DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"] as const).map((tab) => {
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
                    {tab === "ALL" ? "All Events" : tab} ({counts[tab]})
                  </button>
                );
              })}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search title, venue, category…"
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
              {searchQuery
                ? `No hosted listings match your keyword "${searchQuery}".`
                : "You don't have any event listings under this filter tab."}
            </p>
            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="rounded-full text-xs font-semibold"
              >
                Clear Search Filter
              </Button>
            ) : (
              <Button
                render={<Link href="/dashboard/events/new" />}
                nativeButton={false}
                size="sm"
                className="rounded-full px-5 text-xs font-bold"
              >
                Create Your First Event
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((ev) => {
            const booked = ev.bookedSeats || 0;
            const cap = ev.capacity || 1;
            const percent = Math.min(100, Math.round((booked / cap) * 100));
            const isDraft = ev.status === "DRAFT";

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
                        {getStatusBadge(ev.status)}
                        {ev.category && (
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {ev.category.name}
                          </Badge>
                        )}
                        <span className="font-mono text-[10px] text-muted-foreground">
                          Starts: {formatDate(ev.startDate)}
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
                        <span>Price: <strong className="text-foreground">${Number(ev.price || 0).toFixed(2)}</strong></span>
                      </div>
                    </div>

                    {/* Action Shortcut Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isDraft && (
                        <Button
                          size="sm"
                          onClick={() => setStatusDialogState({ event: ev, action: "PUBLISH" })}
                          className="rounded-full text-xs font-bold px-4"
                        >
                          <Sparkles className="mr-1.5 size-3.5" />
                          Go Live
                        </Button>
                      )}

                      {(isDraft || ev.status === "PUBLISHED") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusDialogState({ event: ev, action: "CANCEL" })}
                          className="rounded-full text-xs font-semibold gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                        >
                          <Ban className="size-3.5" />
                          <span>Cancel Event</span>
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
                  <div className="space-y-1.5 pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Users className="size-3.5 text-primary" />
                        <span>Capacity Reserved</span>
                      </span>
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
