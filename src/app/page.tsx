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

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection categories={categories} />
      <UpcomingEventsSection events={events} />
      <CategoryShowcaseSection categories={categories} />
      <HowItWorksSection />
      <OrganizerCTASection />
    </div>
  );
}
