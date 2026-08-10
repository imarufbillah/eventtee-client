import Link from "next/link";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  category: Category;
  isActive?: boolean;
  /** When set, appends &search=<value> to the chip href so active searches aren't dropped on category change. */
  preserveSearch?: string;
  className?: string;
}

export function CategoryChip({
  category,
  isActive,
  preserveSearch,
  className,
}: CategoryChipProps) {
  const count = category._count?.events;
  const searchSuffix =
    preserveSearch ? `&search=${encodeURIComponent(preserveSearch)}` : "";

  return (
    <Link
      href={`/events?category=${category.slug}${searchSuffix}`}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-2 text-sm font-medium transition-[transform,background-color,border-color,color] duration-200 ease-out-expo select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        "active:scale-[0.97]",
        isActive
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/80 bg-card/80 text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      <span>{category.name}</span>
      {typeof count === "number" && (
        <span
          className={cn(
            "flex min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[11px] font-semibold tabular-nums",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
