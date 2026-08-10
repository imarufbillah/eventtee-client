import { fetchActiveCategories, fetchActiveEvents } from "@/lib/api-server";
import { HeroSection } from "@/components/sections/HeroSection";
import { UpcomingEventsSection } from "@/components/sections/UpcomingEventsSection";
import { CategoryShowcaseSection } from "@/components/sections/CategoryShowcaseSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { OrganizerCTASection } from "@/components/sections/OrganizerCTASection";

export default async function Home() {
  const [eventsData, categoriesData] = await Promise.all([
    fetchActiveEvents({ limit: 6 }),
    fetchActiveCategories({ limit: 12 }),
  ]);

  const events = eventsData?.items || [];
  const categories = categoriesData?.items || [];
  const featuredEvent = events[0] ?? null;
  const totalEvents = eventsData?.total ?? events.length;

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection
        categories={categories}
        featuredEvent={featuredEvent}
        totalEvents={totalEvents}
      />
      <UpcomingEventsSection
        events={events}
        skipFeaturedId={featuredEvent?.id}
      />
      <CategoryShowcaseSection categories={categories} />
      <HowItWorksSection />
      <OrganizerCTASection />
    </div>
  );
}
