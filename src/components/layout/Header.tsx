"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  LogOut,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Ticket,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = session?.user;
  const userRole = (user as Record<string, unknown> | undefined)?.role;
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
            <Calendar className="size-5" />
          </div>
          <span className="font-sans font-extrabold text-xl tracking-tight text-foreground">
            Event<span className="text-primary">tee</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <Link
            href="/events"
            className="transition-colors hover:text-foreground"
          >
            Browse Events
          </Link>
          {isOrganizer && (
            <Link
              href="/dashboard/events/new"
              className="flex items-center gap-1.5 text-primary font-semibold transition-colors hover:text-primary/80"
            >
              <PlusCircle className="size-4" />
              Create Event
            </Link>
          )}
        </nav>

        {/* Desktop Auth Controls & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-border/50">
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Ticket className="size-4 text-primary" />
                <span>My Bookings</span>
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-xs font-semibold bg-muted/60 px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted transition-colors"
              >
                <LayoutDashboard className="size-3.5" />
                <span className="truncate max-w-30">
                  {user.name || user.email}
                </span>
              </Link>

              <Button
                variant="ghost"
                size="icon-sm"
                className="size-8 text-muted-foreground hover:text-destructive"
                onClick={() => signOut()}
                title="Sign out"
              >
                <LogOut className="size-4" />
                <span className="sr-only">Sign out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                variant="ghost"
                size="sm"
                className="rounded-full"
              >
                Sign In
              </Button>
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                size="sm"
                className="rounded-full font-semibold px-4"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/50 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              Home
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              Browse Events
            </Link>
            {isOrganizer && (
              <Link
                href="/dashboard/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-primary/10 text-primary font-semibold flex items-center gap-2"
              >
                <PlusCircle className="size-4" />
                Create Event
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-border/40">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1.5 text-xs text-muted-foreground font-mono">
                  Signed in as{" "}
                  <span className="font-semibold text-foreground">
                    {user.name || user.email}
                  </span>
                </div>
                <Button
                  render={<Link href="/dashboard/bookings" />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Ticket className="size-4" />
                  My Bookings
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  render={<Link href="/sign-in" />}
                  nativeButton={false}
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Button>
                <Button
                  render={<Link href="/sign-up" />}
                  nativeButton={false}
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
