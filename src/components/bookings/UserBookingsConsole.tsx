"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, Search, Calendar, MapPin, CheckCircle2, Clock, XCircle, ArrowLeft, Filter, Sparkles } from "lucide-react";
import type { Booking } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

import { BookingCancelDialog } from "./BookingCancelDialog";

interface UserBookingsConsoleProps {
  initialBookings: Booking[];
}

export function UserBookingsConsole({ initialBookings }: UserBookingsConsoleProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIRMED" | "PENDING" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return initialBookings.filter((booking) => {
      // Tab filter
      if (activeTab !== "ALL" && booking.status !== activeTab) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = booking.event?.title?.toLowerCase().includes(query);
        const categoryMatch = booking.event?.category?.name?.toLowerCase().includes(query);
        const locationMatch = booking.event?.location?.toLowerCase().includes(query);

        return titleMatch || categoryMatch || locationMatch;
      }

      return true;
    });
  }, [initialBookings, activeTab, searchQuery]);

  const handleConfirmCancel = async (bookingId: string) => {
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/bookings/cancel/${bookingId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Cancellation Failed",
          description: json.message || "Failed to cancel booking.",
        });
        return;
      }

      toast.add({
        title: "Booking Cancelled",
        description: "Your seats have been released back to event capacity.",
      });
      router.refresh();
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge variant="default" className="font-mono text-[10px] gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            <CheckCircle2 className="size-3" />
            <span>CONFIRMED</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="outline" className="font-mono text-[10px] gap-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">
            <Clock className="size-3" />
            <span>PENDING CONFIRMATION</span>
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="secondary" className="font-mono text-[10px] gap-1 text-muted-foreground">
            <XCircle className="size-3" />
            <span>CANCELLED</span>
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const counts = {
    ALL: initialBookings.length,
    CONFIRMED: initialBookings.filter((b) => b.status === "CONFIRMED").length,
    PENDING: initialBookings.filter((b) => b.status === "PENDING").length,
    CANCELLED: initialBookings.filter((b) => b.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-8">
      
      {/* Top Console Navigation & Header */}
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
            <Ticket className="size-7 text-primary" />
            <span>My Ticket Bookings</span>
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Manage your seat reservations, view ticket status, and handle cancellations.
          </p>
        </div>

        <Button
          render={<Link href="/events" />}
          nativeButton={false}
          size="sm"
          className="rounded-full px-5 text-xs font-bold shrink-0 self-start sm:self-auto"
        >
          <Sparkles className="mr-1.5 size-3.5" />
          <span>Explore Catalog</span>
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-4 sm:p-5 space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-full border border-border/50">
              {(["ALL", "CONFIRMED", "PENDING", "CANCELLED"] as const).map((tab) => {
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
                    {tab === "ALL" ? "All Bookings" : tab} ({counts[tab]})
                  </button>
                );
              })}
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search event title or category…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-full text-xs bg-card border-border/70"
              />
            </div>

          </div>

        </div>
      </div>

      {/* Bookings Card List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2">
          <div className="rounded-[calc(2rem-0.5rem)] border border-dashed border-border bg-background/90 px-6 py-16 text-center space-y-3">
            <Filter className="mx-auto size-10 text-muted-foreground/40" />
            <h3 className="font-display text-lg font-bold text-foreground">
              No matching bookings found
            </h3>
            <p className="max-w-sm mx-auto text-xs text-muted-foreground">
              {searchQuery
                ? `No reservations match your keyword "${searchQuery}". Try clearing your search.`
                : "You don't have any ticket reservations under this filter tab."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="rounded-full text-xs font-semibold"
              >
                Clear Search Filter
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const event = booking.event;
            const canCancel = booking.status !== "CANCELLED";

            return (
              <div
                key={booking.id}
                className="rounded-[1.75rem] border border-border/80 bg-card/80 p-2 shadow-xs transition-all hover:border-primary/40"
              >
                <div className="rounded-[calc(1.75rem-0.375rem)] border border-border/50 bg-background/95 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Left Info Column */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(booking.status)}
                      {event?.category && (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {event.category.name}
                        </Badge>
                      )}
                      <span className="font-mono text-[10px] text-muted-foreground">
                        Reserved on {formatDate(booking.createdAt)}
                      </span>
                    </div>

                    <Link
                      href={event ? `/events/${event.id}` : "#"}
                      className="font-display text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors block"
                    >
                      {event?.title || "Event Details"}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Ticket className="size-4 text-primary" />
                        <strong className="text-foreground font-bold">{booking.seats}</strong> {booking.seats === 1 ? "seat" : "seats"}
                      </span>
                      {event?.startDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-4" />
                          {formatDate(event.startDate)}
                        </span>
                      )}
                      {event?.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-4" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Price Column */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground block">
                        Total Paid
                      </span>
                      <span className="font-display text-xl font-extrabold text-foreground tabular-nums">
                        ${Number(booking.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {event && (
                        <Button
                          render={<Link href={`/events/${event.id}`} />}
                          nativeButton={false}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-xs font-semibold"
                        >
                          View Event
                        </Button>
                      )}

                      {canCancel && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setBookingToCancel(booking)}
                          className="rounded-full text-xs font-semibold"
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      <BookingCancelDialog
        booking={bookingToCancel}
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />

    </div>
  );
}
