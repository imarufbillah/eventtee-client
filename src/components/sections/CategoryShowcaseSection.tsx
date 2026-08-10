import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { Category } from "@/lib/types";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Button } from "@/components/ui/button";

interface CategoryShowcaseSectionProps {
  categories: Category[];
}

export function CategoryShowcaseSection({
  categories,
}: CategoryShowcaseSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 border-b border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary mb-2">
              <Layers className="size-3.5" />
              <span>Taxonomy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Explore by Category
            </h2>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground max-w-xl">
              Browse tailored live event categories and find experiences that
              match your passion.
            </p>
          </div>

          <Button
            render={<Link href="/events" />}
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="rounded-full gap-2 self-start md:self-auto"
          >
            <span>All Categories</span>
            <ArrowRight className="size-3.5" data-icon="inline-end" />
          </Button>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
