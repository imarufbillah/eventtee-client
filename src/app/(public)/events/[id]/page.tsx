import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchEventById, fetchEventReviews } from "@/lib/api-server";
import { EventDetailHeader } from "@/components/events/detail/EventDetailHeader";
import { OrganizerCard } from "@/components/events/detail/OrganizerCard";
import { TicketBookingCard } from "@/components/events/detail/TicketBookingCard";
import { EventOrganizerControls } from "@/components/events/detail/EventOrganizerControls";
import { EventReviewsSection } from "@/components/events/detail/EventReviewsSection";
import { Reveal } from "@/components/motion/Reveal";

interface EventDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await fetchEventById(id);

  if (!event) {
    return {
      title: "Event Not Found — Eventtee",
      description: "The requested event could not be found.",
    };
  }

  const categoryName = event.category?.name || "Event";
  return {
    title: `${event.title} — ${categoryName} | Eventtee`,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 160),
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;

  const [event, reviewsData] = await Promise.all([
    fetchEventById(id),
    fetchEventReviews(id, { page: 1, limit: 10 }),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex min-h-dvh flex-col pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Organizer / Admin Quick Control Panel (Renders conditionally if authorized) */}
        <EventOrganizerControls event={event} />

        {/* Main 2-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Details & Reviews */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <Reveal y={12}>
              <EventDetailHeader event={event} />
            </Reveal>

            {/* Organizer Profile Card */}
            {event.organizer && (
              <Reveal y={12} delay={0.05}>
                <OrganizerCard organizer={event.organizer} />
              </Reveal>
            )}

            {/* Event Description & Details */}
            <Reveal y={12} delay={0.1}>
              <article aria-label="About this event" className="space-y-4 pt-2">
                <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl border-b border-border/60 pb-3">
                  About This Event
                </h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-line font-sans text-base">
                  {event.description}
                </div>
              </article>
            </Reveal>

            {/* Reviews Section */}
            <Reveal y={12} delay={0.15}>
              <EventReviewsSection
                event={event}
                initialReviews={reviewsData.items}
              />
            </Reveal>
          </div>

          {/* Right Column: Sticky Ticket Booking Sidebar Widget */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <Reveal y={12} delay={0.1}>
              <TicketBookingCard event={event} />
            </Reveal>
          </div>

        </div>
      </div>
    </div>
  );
}
