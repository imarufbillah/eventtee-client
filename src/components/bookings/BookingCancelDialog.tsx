"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, X, Ticket, ShieldAlert } from "lucide-react";
import type { Booking } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface BookingCancelDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (bookingId: string) => Promise<void>;
}

export function BookingCancelDialog({
  booking,
  isOpen,
  onClose,
  onConfirmCancel,
}: BookingCancelDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const event = booking.event;
  const seats = booking.seats || 1;
  const totalPrice = booking.totalPrice ? Number(booking.totalPrice) : 0;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirmCancel(booking.id);
      onClose();
    } catch (err) {
      console.error("Cancellation confirmation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-[2rem] border border-border/80 bg-card p-2 shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-dialog-title"
      >
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background p-6 space-y-5">
          
          {/* Top Warning Icon Header */}
          <div className="flex items-start justify-between border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-destructive">
                  Release Seats
                </span>
                <h3 id="cancel-dialog-title" className="font-display text-lg font-bold text-foreground">
                  Cancel Reservation?
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Event Details Card */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <p className="font-display text-sm font-bold text-foreground line-clamp-1">
              {event?.title || "Event Reservation"}
            </p>
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Ticket className="size-3.5 text-primary" />
                <span>{seats} {seats === 1 ? "seat" : "seats"}</span>
              </span>
              <span className="font-bold text-foreground">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Notice Alert */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
            <ShieldAlert className="size-4 shrink-0 mt-0.5" />
            <span>
              Cancelling will immediately release your {seats} reserved seat(s) back to the public capacity pool. This action cannot be undone.
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-full text-xs font-semibold"
            >
              Keep Booking
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 rounded-full text-xs font-bold shadow-md active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                  Cancelling…
                </>
              ) : (
                "Release & Cancel"
              )}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
