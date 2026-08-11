import Link from "next/link";
import { Compass, PlusCircle, Sparkles, Shield, User as UserIcon } from "lucide-react";
import type { User, Role } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const role: Role = user.role || "USER";
  const isOrganizer = role === "ORGANIZER" || role === "ADMIN";
  const isAdmin = role === "ADMIN";

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const getRoleBadge = () => {
    if (isAdmin) {
      return (
        <Badge variant="destructive" className="font-mono text-[10px] gap-1 px-2 py-0.5">
          <Shield className="size-3" />
          <span>SYSTEM ADMIN</span>
        </Badge>
      );
    }
    if (isOrganizer) {
      return (
        <Badge variant="default" className="font-mono text-[10px] gap-1 px-2 py-0.5 bg-primary/20 text-primary border-primary/30">
          <Sparkles className="size-3" />
          <span>EVENT HOST</span>
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="font-mono text-[10px] gap-1 px-2 py-0.5">
        <UserIcon className="size-3" />
        <span>ATTENDEE</span>
      </Badge>
    );
  };

  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/90 p-2 shadow-xl backdrop-blur-md">
      <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Left Profile Info */}
          <div className="flex items-start sm:items-center gap-4">
            <Avatar size="lg" className="size-14 sm:size-16 shrink-0 border-2 border-primary/30 shadow-md">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Personal Console
                </span>
                {getRoleBadge()}
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back, {user.name.split(" ")[0]}!
              </h1>

              <p className="font-mono text-xs text-muted-foreground">
                {user.email} · Account ID: <span className="text-foreground/80">{user.id.slice(0, 8)}…</span>
              </p>
            </div>
          </div>

          {/* Right Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              render={<Link href="/events" />}
              nativeButton={false}
              variant="outline"
              size="sm"
              className="rounded-full px-4 gap-2 text-xs font-semibold h-10"
            >
              <Compass className="size-4 text-primary" />
              <span>Explore Catalog</span>
            </Button>

            {isOrganizer && (
              <Button
                render={<Link href="/dashboard/events/new" />}
                nativeButton={false}
                size="sm"
                className="rounded-full px-5 gap-2 text-xs font-bold h-10 shadow-md active:scale-[0.98]"
              >
                <PlusCircle className="size-4" />
                <span>Create New Event</span>
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
