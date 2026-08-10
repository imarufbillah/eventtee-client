import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Category } from "@/lib/types";
import { cn, getCategoryAccent } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  index?: number;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  const accent = getCategoryAccent(category.slug);
  const count = category._count?.events ?? 0;

  return (
    <Link
      href={`/events?category=${category.slug}`}
      className={cn(
        "group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-xl border border-border/70 p-5 transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
        "bg-card hover:border-primary/40 active:scale-[0.99]",
        accent.tint,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105"
          )}
        >
          <Sparkles className="size-3.5" aria-hidden />
        </span>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-full border border-border/60 bg-background/80 text-muted-foreground transition-[transform,background-color,color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
            "group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary"
          )}
        >
          <ArrowUpRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-px group-hover:-translate-y-px"
            aria-hidden
          />
        </span>
      </div>

      <div className="mt-6 space-y-1">
        <h3
          className={cn(
            "font-display text-xl font-bold tracking-tight text-foreground transition-colors duration-200 sm:text-2xl",
            "group-hover:text-primary"
          )}
        >
          {category.name}
        </h3>
        <p className="font-mono text-xs text-muted-foreground">
          <span className={cn("font-semibold tabular-nums", accent.ink)}>
            {count}
          </span>{" "}
          {count === 1 ? "live event" : "live events"}
        </p>
      </div>
    </Link>
  );
}
