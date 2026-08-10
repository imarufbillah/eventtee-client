"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Calendar,
  LogOut,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Ticket,
  User as UserIcon,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const user = session?.user;
  const userRole = (user as Record<string, unknown> | undefined)?.role as
    | string
    | undefined;
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const getRoleBadgeVariant = (role?: string) => {
    if (role === "ADMIN") return "destructive";
    if (role === "ORGANIZER") return "default";
    return "secondary";
  };

  // Active Route Helper
  const isActiveRoute = (path: string) => {
    if (path === "/") return pathname === "/";
    if (path === "/events")
      return pathname === "/events" || pathname.startsWith("/events/");
    if (path === "/dashboard/events/new")
      return pathname === "/dashboard/events/new";
    return pathname.startsWith(path);
  };

  const getNavLinkClass = (path: string) =>
    cn(
      "text-xs font-semibold transition-all duration-200 px-3 py-1.5 rounded-full select-none",
      isActiveRoute(path)
        ? "bg-primary/10 text-primary border border-primary/25 shadow-xs"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
    );

  // Smart Scroll Listener (Hide on scroll down, reveal on scroll up)
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 80) {
        setIsAtTop(true);
        setIsVisible(true);
      } else {
        setIsAtTop(false);
        if (currentScrollY > lastScrollY + 5) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY - 5) {
          setIsVisible(true);
        }
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out-expo",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isAtTop
          ? "border-transparent bg-background/70 backdrop-blur-md"
          : "border-border/50 bg-background/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-200 ease-out-expo group-hover:scale-105 group-active:scale-95">
            <Calendar className="size-4" strokeWidth={1.75} />
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
            Event<span className="text-primary">tee</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className={getNavLinkClass("/")}>
            Home
          </Link>
          <Link href="/events" className={getNavLinkClass("/events")}>
            Browse Events
          </Link>
          {isOrganizer && (
            <Link
              href="/dashboard/events/new"
              className={getNavLinkClass("/dashboard/events/new")}
            >
              <span className="flex items-center gap-1.5">
                <PlusCircle className="size-3.5" />
                Create Event
              </span>
            </Link>
          )}
        </nav>

        {/* Desktop Auth Controls & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="group relative flex items-center gap-2 rounded-full p-1 pl-1 pr-2.5 border border-border/50 hover:bg-muted/80 transition-all active:scale-95"
                  />
                }
              >
                <Avatar size="sm" className="size-7">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name || "User"} />
                  )}
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-semibold text-foreground truncate max-w-28">
                  {user.name || user.email}
                </span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-64 p-2 rounded-2xl shadow-xl border border-border/60 bg-popover/95 backdrop-blur-md"
              >
                {/* User Header Profile Card */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="p-2 space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar size="lg" className="size-10">
                        {user.image && (
                          <AvatarImage
                            src={user.image}
                            alt={user.name || "User"}
                          />
                        )}
                        <AvatarFallback className="text-sm font-bold bg-primary/15 text-primary">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-sm text-foreground truncate">
                          {user.name || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <Badge
                        variant={getRoleBadgeVariant(userRole)}
                        className="text-[10px] uppercase font-mono"
                      >
                        {userRole || "USER"}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        Account Active
                      </span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="my-1" />

                {/* Account Navigation Group */}
                <DropdownMenuGroup>
                  <DropdownMenuItem render={<Link href="/dashboard" />}>
                    <LayoutDashboard className="size-4 text-primary" />
                    <span>Dashboard Overview</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    render={<Link href="/dashboard/bookings" />}
                  >
                    <Ticket className="size-4 text-primary" />
                    <span>My Bookings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                    <UserIcon className="size-4 text-primary" />
                    <span>My Profile & Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {/* Role-Gated Organizer Group */}
                {isOrganizer && (
                  <>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                        Organizer Console
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        render={<Link href="/dashboard/events/new" />}
                      >
                        <PlusCircle className="size-4 text-primary" />
                        <span>Create New Event</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href="/dashboard/events" />}
                      >
                        <Calendar className="size-4 text-primary" />
                        <span>Manage My Events</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}

                <DropdownMenuSeparator className="my-1" />

                {/* Sign Out Action */}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => signOut()}
                  className="cursor-pointer"
                >
                  <LogOut className="size-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              className={cn(
                "px-3 py-2 rounded-lg transition-colors flex items-center justify-between",
                isActiveRoute("/")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted",
              )}
            >
              <span>Home</span>
              {isActiveRoute("/") && (
                <span className="size-2 rounded-full bg-primary" />
              )}
            </Link>
            <Link
              href="/events"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "px-3 py-2 rounded-lg transition-colors flex items-center justify-between",
                isActiveRoute("/events")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted",
              )}
            >
              <span>Browse Events</span>
              {isActiveRoute("/events") && (
                <span className="size-2 rounded-full bg-primary" />
              )}
            </Link>
            {isOrganizer && (
              <Link
                href="/dashboard/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-3 py-2 rounded-lg transition-colors flex items-center justify-between",
                  isActiveRoute("/dashboard/events/new")
                    ? "bg-primary/15 text-primary font-semibold"
                    : "bg-primary/10 text-primary hover:bg-primary/20",
                )}
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="size-4" />
                  Create Event
                </span>
                {isActiveRoute("/dashboard/events/new") && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
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
