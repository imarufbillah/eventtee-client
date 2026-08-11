import Link from "next/link";
import type { Category } from "@/lib/types";
import { CategoryChip } from "@/components/categories/CategoryChip";
import { cn } from "@/lib/utils";

interface EventsFilterRailProps {
  categories: Category[];
  activeSlug: string;
  search: string;
  total: number;
}

/**
 * Horizontal scrollable category filter rail.
 * "All" chip is first, followed by one CategoryChip per active category.
 */
export function EventsFilterRail({
  categories,
  activeSlug,
  search,
  total,
}: EventsFilterRailProps) {
  const isAllActive = activeSlug === "";

  return (
    <nav
      aria-label="Filter by category"
      className="border-b border-border/50 bg-background/80 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Overflow container: fade edges on desktop hint at scrollability */}
        <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {/* "All" chip */}
          <Link
            href={`/events${search ? `?search=${encodeURIComponent(search)}` : ""}`}
            aria-current={isAllActive ? "true" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-[transform,background-color,border-color,color] duration-200 ease-out-expo select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              "active:scale-[0.97]",
              isAllActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/80 bg-card/80 text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground",
            )}
          >
            <span>All</span>
            {isAllActive && total > 0 && (
              <span className="flex min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 font-mono text-[11px] font-semibold tabular-nums text-primary-foreground">
                {total}
              </span>
            )}
          </Link>

          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              isActive={activeSlug === category.slug}
              preserveSearch={search || undefined}
              className="shrink-0"
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
