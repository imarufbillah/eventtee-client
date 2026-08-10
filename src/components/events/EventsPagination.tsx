import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventsPaginationProps {
  page: number;
  totalPages: number;
  search: string;
  activeCategory: string;
}

function buildPageUrl(
  targetPage: number,
  search: string,
  activeCategory: string,
): string {
  const params = new URLSearchParams();
  if (targetPage > 1) params.set("page", String(targetPage));
  if (search) params.set("search", search);
  if (activeCategory) params.set("category", activeCategory);
  return `/events${params.toString() ? `?${params}` : ""}`;
}

/** Generates an array of page items: numbers + "…" strings. */
function getPageItems(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: (number | "…")[] = [1];
  if (page > 3) items.push("…");

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) items.push(i);

  if (page < totalPages - 2) items.push("…");
  items.push(totalPages);
  return items;
}

export function EventsPagination({
  page,
  totalPages,
  search,
  activeCategory,
}: EventsPaginationProps) {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(page, totalPages);
  const isFirst = page === 1;
  const isLast = page === totalPages;

  const chipBase = cn(
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border/80 px-2 text-sm font-medium transition-[background-color,border-color,color] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
  );

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5"
    >
      {/* Previous */}
      {isFirst ? (
        <span
          aria-disabled="true"
          className={cn(chipBase, "pointer-events-none opacity-40")}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </span>
      ) : (
        <Link
          href={buildPageUrl(page - 1, search, activeCategory)}
          aria-label="Go to previous page"
          className={cn(
            chipBase,
            "bg-card/80 text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground",
          )}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      )}

      {/* Page numbers */}
      {pageItems.map((item, i) =>
        item === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="inline-flex h-9 w-8 items-center justify-center text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={buildPageUrl(item, search, activeCategory)}
            aria-label={`Go to page ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              chipBase,
              item === page
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card/80 text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground",
            )}
          >
            {item}
          </Link>
        ),
      )}

      {/* Next */}
      {isLast ? (
        <span
          aria-disabled="true"
          className={cn(chipBase, "pointer-events-none opacity-40")}
        >
          <ChevronRight className="size-4" aria-hidden />
        </span>
      ) : (
        <Link
          href={buildPageUrl(page + 1, search, activeCategory)}
          aria-label="Go to next page"
          className={cn(
            chipBase,
            "bg-card/80 text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground",
          )}
        >
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
