"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, ArrowLeft, CheckCircle2, Clock, Ban, Loader2, Users, DollarSign, Calendar, MapPin, Mail } from "lucide-react";
import type { Event, Booking } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface EventBookingsConsoleProps {
  event: Event;
  bookings: Booking[];
}

export function EventBookingsConsole({ event, bookings }: EventBookingsConsoleProps) {
  const router = useRouter();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const totalSeatsBooked = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "PENDING")
    .reduce((sum, b) => sum + (b.seatsBooked || b.seats || 1), 0);

  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + Number(b.totalPrice || 0), 0);

  const handleConfirmBooking = async (bookingId: string) => {
    setConfirmingId(bookingId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/bookings/confirm/${bookingId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Confirmation Failed",
          description: json.message || "Failed to confirm pending booking.",
        });
        return;
      }

      toast.add({
        title: "Booking Confirmed!",
        description: "Attendee reservation is now marked as CONFIRMED.",
      });

      router.refresh();
    } catch (err) {
      console.error("Booking confirmation error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setConfirmingId(null);
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
          <Badge variant="destructive" className="font-mono text-[10px] gap-1">
            <Ban className="size-3" />
            <span>CANCELLED</span>
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Breadcrumb */}
      <div className="space-y-1">
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Hosted Events Board</span>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Ticket className="size-7 text-primary" />
          <span>Attendee Bookings Console</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          View all ticket reservations and confirm pending attendee bookings.
        </p>
      </div>

      {/* Event Details Summary Bento Box */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                {event.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5 text-primary" />
                  <span>{formatDate(event.startDate)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary" />
                  <span>{event.location}</span>
                </span>
              </div>
            </div>

            <Button
              render={<Link href={`/events/${event.id}`} />}
              nativeButton={false}
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-semibold self-start sm:self-auto"
            >
              View Event Page
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="rounded-xl border border-border/60 bg-card/50 p-4 space-y-1">
              <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                <Users className="size-3.5 text-primary" />
                <span>Reserved Seats</span>
              </span>
              <p className="font-display text-2xl font-extrabold text-foreground tabular-nums">
                {totalSeatsBooked} / {event.capacity || 0}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-4 space-y-1">
              <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                <DollarSign className="size-3.5 text-emerald-500" />
                <span>Confirmed Revenue</span>
              </span>
              <p className="font-display text-2xl font-extrabold text-foreground tabular-nums">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-4 space-y-1">
              <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                <Ticket className="size-3.5 text-primary" />
                <span>Total Reservations</span>
              </span>
              <p className="font-display text-2xl font-extrabold text-foreground tabular-nums">
                {bookings.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 overflow-hidden">
          
          {bookings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Ticket className="mx-auto size-10 text-muted-foreground/40" />
              <h3 className="font-display text-base font-bold text-foreground">
                No attendee bookings yet
              </h3>
              <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
                Once attendees reserve tickets for this event, their booking details will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">Attendee</th>
                    <th className="py-3.5 px-4 font-semibold">Seats</th>
                    <th className="py-3.5 px-4 font-semibold">Total Price</th>
                    <th className="py-3.5 px-4 font-semibold">Booked Date</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {bookings.map((booking) => {
                    const name = booking.user?.name || "Anonymous Attendee";
                    const email = booking.user?.email || "N/A";
                    const initials = name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    const isConfirming = confirmingId === booking.id;

                    return (
                      <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                        
                        {/* Attendee Info */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 border border-border">
                              {booking.user?.image && (
                                <AvatarImage src={booking.user.image} alt={name} />
                              )}
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground text-xs">{name}</p>
                              <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                                <Mail className="size-3" />
                                <span>{email}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Seats */}
                        <td className="py-4 px-4 font-mono text-xs font-bold text-foreground">
                          {booking.seatsBooked || booking.seats || 1}{" "}
                          {(booking.seatsBooked || booking.seats || 1) === 1 ? "seat" : "seats"}
                        </td>

                        {/* Total Price */}
                        <td className="py-4 px-4 font-mono text-xs font-semibold text-foreground">
                          ${Number(booking.totalPrice || 0).toFixed(2)}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">
                          {formatDate(booking.createdAt)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {getStatusBadge(booking.status)}
                        </td>

                        {/* Action Row */}
                        <td className="py-4 px-4 text-right">
                          {booking.status === "PENDING" ? (
                            <Button
                              size="sm"
                              disabled={isConfirming}
                              onClick={() => handleConfirmBooking(booking.id)}
                              className="rounded-full text-xs font-bold px-3 py-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {isConfirming ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                "Confirm Booking"
                              )}
                            </Button>
                          ) : (
                            <span className="font-mono text-[11px] text-muted-foreground">—</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
