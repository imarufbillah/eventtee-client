"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, ChevronDown, Layers, Loader2, Sparkles } from "lucide-react";
import type { Category } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  initialCategories?: Category[];
  className?: string;
  variant?: "dropdown" | "list";
}

export function CategoryNav({
  initialCategories = [],
  className,
  variant = "dropdown",
}: CategoryNavProps) {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(initialCategories.length === 0);

  useEffect(() => {
    if (initialCategories.length > 0) return;

    let isMounted = true;
    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

    fetch(`${SERVER_URL}/api/v1/categories/active?limit=30`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (isMounted && json?.data?.categories) {
          setCategories(json.data.categories);
        } else if (isMounted && json?.data?.items) {
          setCategories(json.data.items);
        }
      })
      .catch((err) => {
        console.error("Failed to load categories for CategoryNav:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialCategories]);

  if (variant === "list") {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 pb-1">
          Categories
        </p>
        {loading ? (
          <div className="flex items-center gap-2 p-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            <span>Loading rooms...</span>
          </div>
        ) : categories.length === 0 ? (
          <p className="p-2 text-xs text-muted-foreground">No active categories</p>
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/events?category=${cat.slug}`}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80 hover:text-foreground",
                pathname.includes(`category=${cat.slug}`)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              <span>{cat.name}</span>
              {typeof cat._count?.events === "number" && (
                <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                  {cat._count.events}
                </Badge>
              )}
            </Link>
          ))
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className={cn(
              "text-xs font-semibold transition-all duration-200 px-3 py-1.5 rounded-full select-none gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50",
              className
            )}
          />
        }
      >
        <Layers className="size-3.5 text-muted-foreground" />
        <span>Categories</span>
        <ChevronDown className="size-3 text-muted-foreground/70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56 p-1.5" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center justify-between px-2 py-1">
            <span>Active Categories</span>
            <Sparkles className="size-3 text-primary/70" />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuGroup className="max-h-64 overflow-y-auto space-y-0.5">
          <DropdownMenuItem
            render={<Link href="/events" />}
            className="flex items-center justify-between text-xs font-semibold cursor-pointer rounded-md"
          >
            <div className="flex items-center gap-2">
              <Compass className="size-3.5 text-primary" />
              <span>All Categories</span>
            </div>
          </DropdownMenuItem>

          {loading ? (
            <div className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Loading categories...</span>
            </div>
          ) : (
            categories.map((cat) => (
              <DropdownMenuItem
                key={cat.id}
                render={<Link href={`/events?category=${cat.slug}`} />}
                className="flex items-center justify-between text-xs cursor-pointer rounded-md"
              >
                <span>{cat.name}</span>
                {typeof cat._count?.events === "number" && (
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                    {cat._count.events}
                  </span>
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
