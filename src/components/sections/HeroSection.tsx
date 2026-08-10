"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import type { Category } from "@/lib/types";
import { CategoryChip } from "@/components/categories/CategoryChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  categories: Category[];
}

export function HeroSection({ categories }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/events");
      return;
    }
    router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/40">
      {/* Background Decorative Mesh Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-125 w-full -translate-x-1/2 max-w-7xl opacity-25 dark:opacity-20 blur-3xl">
        <div className="h-full w-full bg-linear-to-tr from-primary via-indigo-500 to-purple-600 rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            <Sparkles className="size-3.5" />
            <span>Real-time Live Ticketing & Reservations</span>
          </div>

          {/* Main Headline */}
          <h1 className="max-w-4xl font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-[1.1]">
            Live Experiences, <br className="hidden sm:inline" />
            <span className="bg-linear-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Reserved Instantly.
            </span>
          </h1>

          {/* Lead Subtitle */}
          <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Discover curated live concerts, tech conferences, sports
            tournaments, and workshops. Reserve seats with atomic double-booking
            protection.
          </p>

          {/* Interactive Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl mt-4 p-2 rounded-2xl border border-border/60 bg-background/80 shadow-lg backdrop-blur-md dark:bg-card/80 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20"
          >
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full flex items-center">
                <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search events by title, topic, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 border-none shadow-none focus-visible:ring-0 text-sm bg-transparent"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto h-11 rounded-xl px-6 font-semibold shadow-xs transition-all active:scale-95 gap-2"
              >
                <span>Search Events</span>
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
            </div>
          </form>

          {/* Quick Category Filtering Chips */}
          {categories.length > 0 && (
            <div className="w-full max-w-3xl mt-6">
              <div className="flex items-center justify-center gap-2 flex-wrap text-xs text-muted-foreground">
                <span className="font-semibold text-foreground mr-1">
                  Popular:
                </span>
                {categories.slice(0, 7).map((cat) => (
                  <CategoryChip key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
