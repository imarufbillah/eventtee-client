import Link from "next/link";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CategoryChipProps {
  category: Category;
  isActive?: boolean;
}

export function CategoryChip({ category, isActive }: CategoryChipProps) {
  return (
    <Link
      href={`/events?category=${category.slug}`}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 select-none active:scale-95",
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-xs"
          : "border-border/60 bg-background/80 text-muted-foreground hover:border-primary/50 hover:bg-muted hover:text-foreground dark:bg-card/60",
      )}
    >
      <span>{category.name}</span>
      {typeof category._count?.events === "number" && (
        <span
          className={cn(
            "flex size-4 items-center justify-center rounded-full text-[10px] font-mono font-semibold",
            isActive
              ? "bg-primary-foreground/20 text-primary-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {category._count.events}
        </span>
      )}
    </Link>
  );
}
