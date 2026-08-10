import Link from "next/link";
import { ArrowUpRight, Layers } from "lucide-react";
import type { Category } from "@/lib/types";
import { getCategoryGradient } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const gradient = getCategoryGradient(category.slug);

  return (
    <Link
      href={`/events?category=${category.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-muted/30 p-1.5 transition-all duration-300 hover:border-primary/40 hover:bg-muted/50 dark:border-border/40 dark:bg-card/40"
    >
      <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[0.875rem] border border-border/40 bg-background/90 p-5 backdrop-blur-xs transition-colors dark:bg-background/60">
        <div
          className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-20 transition-opacity duration-300 group-hover:opacity-35`}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex size-10 items-center justify-center rounded-xl border border-border/50 bg-background/80 text-primary shadow-xs transition-transform duration-300 group-hover:scale-110">
            <Layers className="size-5" />
          </div>
          <span className="flex size-7 items-center justify-center rounded-full bg-muted/80 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="relative z-10 mt-6">
          <h4 className="font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors">
            {category.name}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            {category._count?.events ?? 0} active{" "}
            {category._count?.events === 1 ? "event" : "events"}
          </p>
        </div>
      </div>
    </Link>
  );
}
