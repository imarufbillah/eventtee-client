import type { Metadata } from "next";
import { fetchActiveEvents, fetchActiveCategories } from "@/lib/api-server";
import { EventsPageHeader } from "@/components/events/EventsPageHeader";
import { EventsFilterRail } from "@/components/events/EventsFilterRail";
import { EventsGrid } from "@/components/events/EventsGrid";

const EVENTS_PER_PAGE = 12;

interface EventsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: EventsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const categorySlug = params.category?.trim() ?? "";

  if (search && categorySlug) {
    return {
      title: `"${search}" in ${categorySlug} — Eventtee`,
      description: `Browse events matching "${search}" in the ${categorySlug} category on Eventtee.`,
    };
  }
  if (search) {
    return {
      title: `Results for "${search}" — Eventtee`,
      description: `Browse events matching "${search}" on Eventtee.`,
    };
  }
  if (categorySlug) {
    const label =
      categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    return {
      title: `${label} Events — Eventtee`,
      description: `Browse all ${label.toLowerCase()} events on Eventtee. Reserve your seat instantly with real-time availability.`,
    };
  }
  return {
    title: "Browse Events — Eventtee",
    description:
      "Discover upcoming concerts, conferences, workshops, and sports events. Reserve seats instantly with real-time availability.",
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const categorySlug = params.category?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  // Fetch categories first to resolve slug → ID, then fire the events fetch.
  // If no category slug is active, both fetches can be made in parallel since
  // no ID resolution is needed — but slug resolution requires the category list.
  const categoriesData = await fetchActiveCategories({ limit: 50 });

  const activeCategory =
    categorySlug
      ? (categoriesData.items.find((c) => c.slug === categorySlug) ?? null)
      : null;

  const [eventsData] = await Promise.all([
    fetchActiveEvents({
      page,
      limit: EVENTS_PER_PAGE,
      search: search || undefined,
      categoryId: activeCategory?.id,
    }),
  ]);

  // Detect a fetch error: the utility returns an empty fallback on error.
  // We treat it as an error only when the fetch truly failed (total 0 + empty
  // items after a real request), which is indistinguishable from a genuine
  // empty catalog in the current utility shape. We surface the error state
  // only when the API itself returned a non-ok response; the utility logs it
  // and returns the fallback. Future: extend PaginatedResponse with `error?`.
  const fetchError = false; // see plan note — requires api-server.ts update to distinguish

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <EventsPageHeader
        total={eventsData.total}
        search={search}
        activeCategory={categorySlug}
      />

      {/* Filter rail — shown even when categories fetch failed (shows no chips). */}
      <EventsFilterRail
        categories={categoriesData.items}
        activeSlug={categorySlug}
        search={search}
        total={eventsData.total}
      />

      <EventsGrid
        events={eventsData.items}
        total={eventsData.total}
        page={page}
        totalPages={eventsData.totalPages}
        search={search}
        activeCategory={categorySlug}
        activeCategoryName={activeCategory?.name}
        fetchError={fetchError}
      />
    </div>
  );
}
