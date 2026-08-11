"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Compass,
  Home,
  LogOut,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  Ticket,
  User as UserIcon,
  Users,
  FolderTree,
  ShieldAlert,
  MessageSquare,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { CategoryNav } from "@/components/categories/CategoryNav";
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

const emptySubscribe = () => () => {};

function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const mounted = useHydrated();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    signOut();
    toast.add({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const user = session?.user;
  const userRole = (user as Record<string, unknown> | undefined)?.role as
    | string
    | undefined;
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";
  const isAdmin = userRole === "ADMIN";

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
          <CategoryNav />
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

                {/* Role-Gated Admin Group */}
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-destructive">
                        Admin System Console
                      </DropdownMenuLabel>
                      <DropdownMenuItem render={<Link href="/admin/users" />}>
                        <Users className="size-4 text-destructive" />
                        <span>User Accounts</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href="/admin/categories" />}>
                        <FolderTree className="size-4 text-destructive" />
                        <span>Categories CRUD</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href="/admin/events" />}>
                        <ShieldAlert className="size-4 text-destructive" />
                        <span>All Event Overrides</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem render={<Link href="/admin/reviews" />}>
                        <MessageSquare className="size-4 text-destructive" />
                        <span>Review Moderation</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}

                <DropdownMenuSeparator className="my-1" />

                {/* Sign Out Action */}
                <DropdownMenuItem
                  variant="destructive"
                  onClick={handleSignOut}
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

      {/* Full-Screen Mobile Drawer & Blurred Backdrop Portaled to document.body */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-40 md:hidden flex flex-col pointer-events-auto">
                {/* Full-Screen Blurred Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute inset-0 bg-background/80 backdrop-blur-md"
                  aria-hidden
                />

                {/* Header Height Spacer (64px) */}
                <div className="h-16 shrink-0 pointer-events-none" />

                {/* Mobile Navigation Drawer */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="relative z-10 border-b border-border/50 bg-background/95 px-4 pt-2.5 pb-5 space-y-4 rounded-b-2xl shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto"
                >
                  {/* Top Sheet Drag Handle Indicator */}
                  <div className="flex justify-center pb-1">
                    <span aria-hidden className="h-1 w-10 rounded-full bg-border/70" />
                  </div>

                  {/* User Profile Header Card (Mobile) */}
                  {user && (
                    <div className="rounded-xl border border-border/70 bg-muted/40 p-3.5 space-y-2.5 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg" className="size-11 shrink-0 ring-2 ring-primary/20">
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
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {user.name || "User"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate font-mono">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
                        <Badge
                          variant={getRoleBadgeVariant(userRole)}
                          className="text-[10px] uppercase font-mono px-2 py-0.5"
                        >
                          {userRole || "USER"}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Account Active
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-1 text-sm font-medium">
                    <p className="px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                      Navigation
                    </p>
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-3.5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between text-sm min-h-11 select-none active:scale-[0.99]",
                        isActiveRoute("/")
                          ? "bg-primary/10 text-primary font-semibold border border-primary/25 shadow-2xs"
                          : "hover:bg-muted text-foreground/90",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Home className="size-4 text-primary" />
                        <span>Home</span>
                      </span>
                      {isActiveRoute("/") && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </Link>
                    <Link
                      href="/events"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "px-3.5 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between text-sm min-h-11 select-none active:scale-[0.99]",
                        isActiveRoute("/events")
                          ? "bg-primary/10 text-primary font-semibold border border-primary/25 shadow-2xs"
                          : "hover:bg-muted text-foreground/90",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <Compass className="size-4 text-primary" />
                        <span>Browse Events</span>
                      </span>
                      {isActiveRoute("/events") && (
                        <span className="size-2 rounded-full bg-primary" />
                      )}
                    </Link>
                    <div className="pt-2 border-t border-border/40">
                      <CategoryNav variant="list" />
                    </div>
                  </nav>

                  {/* Account & Console Group */}
                  <div className="pt-2 border-t border-border/50 space-y-3">
                    {user ? (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <p className="px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                            Account Console
                          </p>
                          <div className="grid gap-1.5">
                            <Button
                              render={<Link href="/dashboard" />}
                              nativeButton={false}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start gap-2.5 h-11 px-3.5 text-xs rounded-xl font-medium active:scale-[0.99]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <LayoutDashboard className="size-4 text-primary" />
                              <span>Dashboard Overview</span>
                            </Button>
                            <Button
                              render={<Link href="/dashboard/bookings" />}
                              nativeButton={false}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start gap-2.5 h-11 px-3.5 text-xs rounded-xl font-medium active:scale-[0.99]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Ticket className="size-4 text-primary" />
                              <span>My Bookings</span>
                            </Button>
                            <Button
                              render={<Link href="/dashboard/profile" />}
                              nativeButton={false}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start gap-2.5 h-11 px-3.5 text-xs rounded-xl font-medium active:scale-[0.99]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <UserIcon className="size-4 text-primary" />
                              <span>My Profile &amp; Settings</span>
                            </Button>
                          </div>
                        </div>

                        {isOrganizer && (
                          <div className="space-y-1 pt-1">
                            <p className="px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80 font-mono">
                              Organizer Console
                            </p>
                            <div className="grid gap-1.5">
                              <Button
                                render={<Link href="/dashboard/events/new" />}
                                nativeButton={false}
                                variant="secondary"
                                size="sm"
                                className="w-full justify-start gap-2.5 h-11 px-3.5 text-xs font-semibold rounded-xl bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20 active:scale-[0.99]"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <PlusCircle className="size-4 text-primary" />
                                <span>Create New Event</span>
                              </Button>
                              <Button
                                render={<Link href="/dashboard/events" />}
                                nativeButton={false}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-2.5 h-11 px-3.5 text-xs rounded-xl font-medium active:scale-[0.99]"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Calendar className="size-4 text-primary" />
                                <span>Manage My Events</span>
                              </Button>
                            </div>
                          </div>
                        )}

                        {isAdmin && (
                          <div className="space-y-1 pt-1">
                            <p className="px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive font-mono">
                              Admin System Console
                            </p>
                            <div className="grid gap-1.5">
                              <Button
                                render={<Link href="/admin/users" />}
                                nativeButton={false}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-2.5 h-10 px-3.5 text-xs rounded-xl font-medium border-destructive/30 hover:bg-destructive/10 text-foreground active:scale-[0.99]"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <Users className="size-4 text-destructive" />
                                <span>User Accounts</span>
                              </Button>
                              <Button
                                render={<Link href="/admin/categories" />}
                                nativeButton={false}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-2.5 h-10 px-3.5 text-xs rounded-xl font-medium border-destructive/30 hover:bg-destructive/10 text-foreground active:scale-[0.99]"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <FolderTree className="size-4 text-destructive" />
                                <span>Categories CRUD</span>
                              </Button>
                              <Button
                                render={<Link href="/admin/events" />}
                                nativeButton={false}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-2.5 h-10 px-3.5 text-xs rounded-xl font-medium border-destructive/30 hover:bg-destructive/10 text-foreground active:scale-[0.99]"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <ShieldAlert className="size-4 text-destructive" />
                                <span>All Event Overrides</span>
                              </Button>
                              <Button
                                render={<Link href="/admin/reviews" />}
                                nativeButton={false}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start gap-2.5 h-10 px-3.5 text-xs rounded-xl font-medium border-destructive/30 hover:bg-destructive/10 text-foreground active:scale-[0.99]"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <MessageSquare className="size-4 text-destructive" />
                                <span>Review Moderation</span>
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="pt-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full justify-start gap-2.5 h-11 px-3.5 text-xs rounded-xl font-medium active:scale-[0.98]"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              handleSignOut();
                            }}
                          >
                            <LogOut className="size-4 text-destructive-foreground" />
                            <span>Sign Out</span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          render={<Link href="/sign-in" />}
                          nativeButton={false}
                          variant="outline"
                          size="sm"
                          className="h-11 rounded-xl font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Sign In
                        </Button>
                        <Button
                          render={<Link href="/sign-up" />}
                          nativeButton={false}
                          size="sm"
                          className="h-11 rounded-xl font-semibold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
