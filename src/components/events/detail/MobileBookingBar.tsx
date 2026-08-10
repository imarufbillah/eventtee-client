"use client";

import { Ticket } from "lucide-react";
import type { Event } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MobileBookingBarProps {
  event: Event;
  onReserveClick: () => void;
}

export function MobileBookingBar({ event, onReserveClick }: MobileBookingBarProps) {
  const numericPrice =
    typeof event.price === "number" ? event.price : parseFloat(event.price) || 0;
  const isFree = numericPrice === 0;
  const isSoldOut = event.remainingSeats <= 0;
  const isAvailable = event.status === "PUBLISHED" && !isSoldOut;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 p-3 px-4 backdrop-blur-md md:hidden shadow-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {event.remainingSeats > 0 ? `${event.remainingSeats} seats left` : "Sold Out"}
          </p>
          <p className="font-display text-lg font-bold text-foreground tabular-nums">
            {isFree ? "Free" : formatCurrency(numericPrice)}
          </p>
        </div>

        <Button
          size="sm"
          onClick={onReserveClick}
          disabled={!isAvailable}
          className="h-10 rounded-full px-5 font-bold shadow-md active:scale-[0.98]"
        >
          <Ticket className="mr-1.5 size-4" />
          {isSoldOut ? "Sold Out" : "Reserve Seats"}
        </Button>
      </div>
    </div>
  );
}
