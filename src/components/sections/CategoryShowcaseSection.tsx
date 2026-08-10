import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { CategoryCard } from "@/components/categories/CategoryCard";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

interface CategoryShowcaseSectionProps {
  categories: Category[];
}

export function CategoryShowcaseSection({
  categories,
}: CategoryShowcaseSectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="border-y border-border/50 bg-muted/25 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Browse by room
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                Each category is a live filter into the catalog — counts reflect
                what&apos;s bookable now, not archived noise.
              </p>
            </div>
            <Button
              render={<Link href="/events" />}
              nativeButton={false}
              variant="ghost"
              className="group h-10 gap-2 self-start rounded-full px-3 md:self-auto"
            >
              <span>All categories</span>
              <ArrowRight
                className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                data-icon="inline-end"
              />
            </Button>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category, index) => {
            const wide = index % 5 === 0 || index % 5 === 3;
            return (
              <Reveal
                key={category.id}
                delay={Math.min(index * 0.05, 0.2)}
                y={12}
                className={wide ? "sm:col-span-2" : undefined}
              >
                <CategoryCard category={category} index={index} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
