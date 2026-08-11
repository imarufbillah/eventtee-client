"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ticket, Minus, Plus, Lock } from "lucide-react";
import type { Event } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/utils";
import { SeatBadge } from "@/components/events/SeatBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { BookingDialog } from "./BookingDialog";

interface TicketBookingCardProps {
  event: Event;
}

export function TicketBookingCard({ event }: TicketBookingCardProps) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  
  const [seats, setSeats] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const numericPrice =
    typeof event.price === "number" ? event.price : parseFloat(event.price) || 0;
  const isFree = numericPrice === 0;
  const remaining = event.remainingSeats;
  const isSoldOut = remaining <= 0;
  const isAvailable = event.status === "PUBLISHED" && !isSoldOut;

  const maxAllowedSeats = Math.min(remaining, 10);

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

  const handleBooking = async () => {
    if (!session) {
      router.push(`/sign-in?redirect=/events/${event.id}`);
      return;
    }

    if (seats > remaining) {
      toast.add({
        title: "Capacity Exceeded",
        description: `Only ${remaining} seat(s) available for this event.`,
      });
      return;
    }

    setIsDialogOpen(true);
  };

  const totalPrice = isFree ? 0 : numericPrice * seats;

  return (
    <>
      <div className="relative rounded-[2rem] border border-border/80 bg-card/90 p-2 shadow-xl backdrop-blur-md">
        {/* Concentric inner shell */}
        <div className="flex flex-col gap-5 rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/80 p-5 sm:p-6">
          
          {/* Ticket Header & Price */}
          <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Ticket Price
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl tabular-nums">
                  {isFree ? "Free" : formatCurrency(numericPrice)}
                </span>
                {!isFree && (
                  <span className="font-mono text-xs text-muted-foreground">
                    / seat
                  </span>
                )}
              </div>
            </div>

            <SeatBadge remainingSeats={remaining} capacity={event.capacity} />
          </div>

          {/* Seat Availability Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs text-muted-foreground">
              <span>Seats Reserved</span>
              <span className="font-semibold text-foreground tabular-nums">
                {event.bookedSeats} / {event.capacity}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500 ease-out-expo"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, (event.bookedSeats / (event.capacity || 1)) * 100),
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Seat Quantity Stepper */}
          {isAvailable && (
            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between text-xs font-medium text-foreground">
                <span>Select Quantity</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Max {maxAllowedSeats} per booking
                </span>
              </label>
              <div className="flex items-center justify-between rounded-xl border border-border bg-card p-1.5">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={seats <= 1}
                  aria-label="Decrease seat count"
                  className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground transition-all hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                  {seats}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={seats >= maxAllowedSeats}
                  aria-label="Increase seat count"
                  className="flex size-9 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground transition-all hover:bg-muted active:scale-95 disabled:pointer-events-none disabled:opacity-40"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Total Price Summary */}
          {isAvailable && !isFree && (
            <div className="flex items-center justify-between border-t border-border/60 pt-3 font-mono text-xs">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-display text-lg font-bold tabular-nums text-foreground">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          )}

          {/* Main Action CTA Button */}
          <Button
            size="lg"
            onClick={handleBooking}
            disabled={!isAvailable || sessionLoading || seats > remaining}
            className="w-full h-11 rounded-full font-bold shadow-md active:scale-[0.99]"
          >
            {isSoldOut ? (
              "Sold Out"
            ) : event.status !== "PUBLISHED" ? (
              "Unavailable"
            ) : !session ? (
              <>
                <Lock className="mr-1.5 size-4" />
                Sign In to Reserve
              </>
            ) : (
              <>
                <Ticket className="mr-1.5 size-4" />
                Reserve {seats} {seats === 1 ? "Seat" : "Seats"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Booking Dialog Modal */}
      <BookingDialog
        event={event}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        initialSeats={seats}
      />
    </>
  );
}
