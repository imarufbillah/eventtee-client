"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Minus, Plus, Loader2, X, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import type { Event } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface BookingDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  initialSeats?: number;
}

export function BookingDialog({ event, isOpen, onClose, initialSeats = 1 }: BookingDialogProps) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const remaining = event.remainingSeats;
  const maxAllowedSeats = Math.min(remaining, 10);
  const [seats, setSeats] = useState<number>(Math.min(initialSeats, maxAllowedSeats || 1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const numericPrice = typeof event.price === "number" ? event.price : parseFloat(event.price) || 0;
  const isFree = numericPrice === 0;
  const totalPrice = isFree ? 0 : numericPrice * seats;

  const handleIncrement = () => {
    if (seats < maxAllowedSeats) {
      setSeats((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (seats > 1) {
      setSeats((prev) => prev - 1);
    }
  };

  const handleConfirmBooking = async () => {
    if (!session) {
      toast.add({
        title: "Authentication Required",
        description: "Please sign in to reserve your seats.",
      });
      router.push(`/sign-in?redirect=/events/${event.id}`);
      return;
    }

    if (seats > remaining) {
      setErrorMsg(`Cannot request ${seats} seats. Only ${remaining} seat(s) remaining.`);
      toast.add({
        title: "Capacity Exceeded",
        description: `Only ${remaining} seat(s) available for this event.`,
      });
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const res = await fetch(`${SERVER_URL}/api/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          eventId: event.id,
          seats,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const errorText = json.message || "Failed to complete ticket reservation.";
        setErrorMsg(errorText);
        toast.add({
          title: "Reservation Error",
          description: errorText,
        });
        return;
      }

      toast.add({
        title: "Seats Reserved Successfully!",
        description: `You have reserved ${seats} seat(s) for "${event.title}".`,
      });

      router.refresh();
      onClose();
    } catch (err) {
      console.error("Booking reservation error:", err);
      setErrorMsg("A network error occurred. Please try again.");
      toast.add({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-[2rem] border border-border/80 bg-card p-2 shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-dialog-title"
      >
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background p-6 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between border-b border-border/50 pb-4">
            <div className="space-y-1">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Ticket className="size-3.5" />
                <span>Ticket Checkout</span>
              </span>
              <h2 id="booking-dialog-title" className="font-display text-xl font-bold tracking-tight text-foreground line-clamp-1">
                {event.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Seat Stepper Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Select Quantity of Seats</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {remaining} seat(s) remaining
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-2">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={seats <= 1 || isSubmitting}
                aria-label="Decrease seats"
                className="flex size-10 items-center justify-center rounded-xl border border-border/80 bg-background text-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Minus className="size-4" />
              </button>

              <div className="text-center">
                <span className="font-mono text-2xl font-extrabold text-foreground tabular-nums">
                  {seats}
                </span>
                <span className="block font-mono text-[10px] text-muted-foreground uppercase">
                  {seats === 1 ? "seat" : "seats"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleIncrement}
                disabled={seats >= maxAllowedSeats || isSubmitting}
                aria-label="Increase seats"
                className="flex size-10 items-center justify-center rounded-xl border border-border/80 bg-background text-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Price per seat</span>
              <span className="font-semibold text-foreground">{isFree ? "Free" : formatCurrency(numericPrice)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Selected seats</span>
              <span className="font-semibold text-foreground">{seats}</span>
            </div>
            <div className="flex justify-between border-t border-border/40 pt-2 text-sm">
              <span className="font-bold text-foreground">Total Amount</span>
              <span className="font-display font-extrabold text-primary text-base tabular-nums">
                {isFree ? "Free" : formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          {/* Security Guarantee Note */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>Instant atomic lock · Zero risk of double booking</span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-full text-xs font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleConfirmBooking}
              disabled={isSubmitting || seats > remaining}
              className="flex-1 rounded-full text-xs font-bold shadow-md active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Reserving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-1.5 size-4" />
                  Confirm Reservation
                </>
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
