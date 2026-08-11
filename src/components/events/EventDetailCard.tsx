import type { Event } from "@/lib/types";
import { EventDetailHeader } from "./detail/EventDetailHeader";
import { OrganizerCard } from "./detail/OrganizerCard";
import { RatingBadge } from "./RatingBadge";
import { SeatBadge } from "./SeatBadge";

interface EventDetailCardProps {
  event: Event;
  showOrganizer?: boolean;
}

export function EventDetailCard({
  event,
  showOrganizer = true,
}: EventDetailCardProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-border/70 bg-card p-6 shadow-xs backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <RatingBadge
            rating={event.averageRating}
            totalReviews={event.totalReviews}
          />
          <SeatBadge remainingSeats={event.remainingSeats} capacity={event.capacity} />
        </div>
      </div>

      <EventDetailHeader event={event} />

      {showOrganizer && event.organizer && (
        <div className="pt-2">
          <OrganizerCard organizer={event.organizer} />
        </div>
      )}
    </div>
  );
}
