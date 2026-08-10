"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventsSearchFormProps {
  defaultValue?: string;
  /** Preserve this category slug in the resulting URL. */
  activeCategory?: string;
}

/**
 * Client-side shell for the events search form.
 * Keeps the parent (EventsPageHeader) a Server Component;
 * only the clear button and input state live here.
 */
export function EventsSearchForm({
  defaultValue = "",
  activeCategory,
}: EventsSearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("search", trimmed);
    if (activeCategory) params.set("category", activeCategory);
    router.push(`/events${params.toString() ? `?${params}` : ""}`);
  };

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
    const params = new URLSearchParams();
    if (activeCategory) params.set("category", activeCategory);
    router.push(`/events${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative flex w-full max-w-sm items-center gap-2"
    >
      <label htmlFor="events-search" className="sr-only">
        Search events
      </label>
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          ref={inputRef}
          id="events-search"
          type="text"
          placeholder="Search events…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-9 pl-8 pr-8 text-sm"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className={cn(
              "absolute right-2.5 top-1/2 -translate-y-1/2",
              "flex size-4 items-center justify-center rounded-full",
              "text-muted-foreground transition-colors hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            )}
          >
            <X className="size-3" aria-hidden />
          </button>
        )}
      </div>
      <Button
        type="submit"
        size="sm"
        className="h-9 shrink-0 rounded-lg px-4 text-sm"
      >
        Search
      </Button>
    </form>
  );
}
