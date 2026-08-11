"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, Calendar, MapPin, Loader2, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import type { Booking } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface UserBookingsWidgetProps {
  bookings: Booking[];
}

export function UserBookingsWidget({ bookings }: UserBookingsWidgetProps) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
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
        description: "Your seats have been released back to the event capacity.",
      });
      router.refresh();
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setCancellingId(null);
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
            <span>PENDING</span>
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

  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
      <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
              My Reserved Tickets
            </h2>
            <p className="font-mono text-xs text-muted-foreground mt-0.5">
              Live capacity holds &amp; ticket status
            </p>
          </div>

          <Button
            render={<Link href="/events" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
          >
            <span>Browse more</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center space-y-3">
            <Ticket className="mx-auto size-10 text-muted-foreground/50" />
            <h3 className="font-display text-base font-bold text-foreground">
              No tickets reserved yet
            </h3>
            <p className="max-w-xs mx-auto text-xs text-muted-foreground">
              Explore upcoming concerts, workshops, and sports events to reserve your seats.
            </p>
            <Button
              render={<Link href="/events" />}
              nativeButton={false}
              size="sm"
              className="rounded-full px-5 text-xs font-semibold"
            >
              Explore Catalog
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const event = booking.event;
              const isCancelling = cancellingId === booking.id;
              const canCancel = booking.status !== "CANCELLED";

              return (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card/50 p-4 sm:p-5 transition-colors hover:bg-card/80"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(booking.status)}
                      {event?.category && (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {event.category.name}
                        </Badge>
                      )}
                    </div>

                    <Link
                      href={event ? `/events/${event.id}` : "#"}
                      className="font-display text-base font-bold text-foreground hover:text-primary transition-colors block"
                    >
                      {event?.title || "Event Details"}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Ticket className="size-3.5 text-primary" />
                        <strong className="text-foreground">{booking.seats}</strong> {booking.seats === 1 ? "seat" : "seats"}
                      </span>
                      {event?.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3.5" />
                          {formatDate(event.startDate)}
                        </span>
                      )}
                      {event?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-border/40 pt-3 sm:pt-0">
                    <div className="text-right">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground block">
                        Total Price
                      </span>
                      <span className="font-display text-base font-extrabold text-foreground">
                        ${Number(booking.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>

                    {canCancel && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isCancelling}
                        onClick={() => handleCancelBooking(booking.id)}
                        className="rounded-full text-xs font-semibold text-destructive hover:bg-destructive/10"
                      >
                        {isCancelling ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    )}
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
