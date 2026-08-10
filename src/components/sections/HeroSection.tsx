"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, X } from "lucide-react";
import type { Category, Event } from "@/lib/types";
import { CategoryChip } from "@/components/categories/CategoryChip";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatTicketDate } from "@/lib/utils";

interface HeroSectionProps {
  categories: Category[];
  featuredEvent?: Event | null;
  totalEvents?: number;
}

export function HeroSection({
  categories,
  featuredEvent,
  totalEvents = 0,
}: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/events");
      return;
    }
    setIsFocused(false);
    router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const cleanQuery = searchQuery.trim().toLowerCase();
  const matchingCategories = cleanQuery
    ? categories.filter((c) => c.name.toLowerCase().includes(cleanQuery))
    : [];

  const showSuggestions = isFocused && cleanQuery.length > 0;

  const ticket = featuredEvent
    ? formatTicketDate(featuredEvent.startDate)
    : null;

  return (
    <section className="relative overflow-hidden border-b border-border/50 pt-24 pb-16 md:pt-28 md:pb-24">
      {/* Soft venue wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 100% 0%, oklch(0.48 0.22 265 / 0.08), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, oklch(0.72 0.16 55 / 0.06), transparent 50%)",
        }}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:items-center">
        {/* Left — thesis + box office search */}
        <div className="flex flex-col lg:col-span-6 xl:col-span-6">
          <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
            Live seat inventory
            {totalEvents > 0 && (
              <span className="text-muted-foreground">
                {" "}
                · {totalEvents} on the board
              </span>
            )}
          </p>

          <h1 className="font-display mt-4 max-w-[14ch] text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-foreground">
            Your seat is waiting.{" "}
            <span className="text-primary">Lock it before someone else does.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Concerts, conferences, workshops, and sports — browse real
            availability and reserve instantly. Every booking is protected
            against double-seats at the database level.
          </p>

          {/* Box-office search with live autosuggest popover */}
          <div className="relative mt-8 w-full max-w-xl">
            <form onSubmit={handleSearchSubmit} role="search">
              <label htmlFor="hero-search" className="sr-only">
                Search events
              </label>
              <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-1.5 shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 focus-within:border-primary/50 focus-within:shadow-[0_0_0_3px_oklch(0.48_0.22_265_/_0.12)] sm:flex-row sm:items-center">
                <div className="relative flex flex-1 items-center">
                  <Search
                    className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="hero-search"
                    type="text"
                    placeholder="Search title, city, or topic…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    className="h-11 border-0 bg-transparent pl-10 pr-9 shadow-none focus-visible:ring-0 md:text-sm"
                    autoComplete="off"
                  />
                  {searchQuery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search input"
                      className="absolute right-2.5 flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 w-full shrink-0 gap-2 rounded-lg px-5 font-semibold sm:w-auto active:scale-[0.98]"
                >
                  <span>Find events</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary-foreground/15">
                    <ArrowRight className="size-3.5" data-icon="inline-end" />
                  </span>
                </Button>
              </div>
            </form>

            {/* Live Autosuggest Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border/80 bg-popover/95 p-2 shadow-xl backdrop-blur-md"
                >
                  {matchingCategories.length > 0 ? (
                    <div className="mb-2 px-3 pt-1">
                      <p className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        Matching Categories
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {matchingCategories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setIsFocused(false);
                              router.push(`/events?category=${cat.slug}`);
                            }}
                            className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Sparkles className="size-3 text-primary" />
                            <span>{cat.name}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              ({cat._count?.events ?? 0})
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-1.5 px-3 pt-1 text-xs text-muted-foreground">
                      <p className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                        Categories
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        No category matches &quot;{searchQuery}&quot;
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleSearchSubmit(e)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="size-3.5 text-primary" />
                      <span>
                        Search all events for &quot;
                        <strong className="text-primary font-semibold">
                          {searchQuery}
                        </strong>
                        &quot;
                      </span>
                    </span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category rail with mobile overflow mask */}
          {categories.length > 0 && (
            <div className="mt-6">
              <p className="mb-2.5 text-xs font-medium text-muted-foreground">
                Jump to a category
              </p>
              <div
                className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, black 85%, transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, black 85%, transparent 100%)",
                }}
              >
                {categories.slice(0, 8).map((cat) => (
                  <CategoryChip key={cat.id} category={cat} />
                ))}
              </div>
            </div>
          )}

          {/* Product truths + Fee transparency note */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:text-sm">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
              Atomic seat locking
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              No surprise checkout fees
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-signal" aria-hidden />
              Live remaining seats
            </li>
          </ul>
        </div>

        {/* Right — featured ticket / empty marquee */}
        <div className="relative lg:col-span-6">
          {featuredEvent ? (
            <div className="relative">
              {/* Ambient label */}
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  On the marquee
                </p>
                {ticket && (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {ticket.weekday} · {ticket.month} {ticket.day} ·{" "}
                    {formatCurrency(featuredEvent.price)}
                  </p>
                )}
              </div>

              <EventCard event={featuredEvent} featured className="relative z-10" />

              {/* Depth card behind */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-4 top-8 -z-0 hidden h-full rounded-xl border border-border/40 bg-muted/40 sm:block"
                style={{ transform: "translateY(18px) rotate(1.5deg)" }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 top-8 -z-[1] hidden h-full rounded-xl border border-border/30 bg-muted/25 sm:block"
                style={{ transform: "translateY(32px) rotate(-1.25deg)" }}
              />
            </div>
          ) : (
            <div className="flex min-h-[320px] flex-col justify-between rounded-xl border border-dashed border-border bg-muted/30 p-6 sm:p-8">
              <div>
                <p className="font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
                  Marquee empty
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  No published events yet.
                </h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  When organizers go live, their tickets appear here with
                  real-time seat counts.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  render={<Link href="/sign-up?role=ORGANIZER" />}
                  nativeButton={false}
                  className="rounded-full px-5 font-semibold"
                >
                  Host the first event
                </Button>
                <Button
                  render={<Link href="/events" />}
                  nativeButton={false}
                  variant="outline"
                  className="rounded-full px-5"
                >
                  Browse catalog
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
