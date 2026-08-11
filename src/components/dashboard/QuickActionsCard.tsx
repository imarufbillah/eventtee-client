import Link from "next/link";
import { Compass, PlusCircle, Ticket, ShieldAlert, Sparkles, ChevronRight } from "lucide-react";
import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface QuickActionsCardProps {
  user: User;
}

export function QuickActionsCard({ user }: QuickActionsCardProps) {
  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
      <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="font-display text-base font-bold text-foreground">
              Console Tools
            </h3>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            Shortcuts
          </span>
        </div>

        {/* Shortcuts Buttons */}
        <div className="space-y-2">
          <Button
            render={<Link href="/events" />}
            nativeButton={false}
            variant="outline"
            className="w-full justify-between h-11 px-4 text-xs font-semibold rounded-xl active:scale-[0.99]"
          >
            <span className="flex items-center gap-2.5">
              <Compass className="size-4 text-primary" />
              <span>Browse Event Catalog</span>
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Button>

          {isOrganizer && (
            <Button
              render={<Link href="/dashboard/events/new" />}
              nativeButton={false}
              variant="secondary"
              className="w-full justify-between h-11 px-4 text-xs font-semibold rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 active:scale-[0.99]"
            >
              <span className="flex items-center gap-2.5">
                <PlusCircle className="size-4 text-primary" />
                <span>Create New Event</span>
              </span>
              <ChevronRight className="size-4 text-primary" />
            </Button>
          )}

          <Button
            render={<Link href="/events" />}
            nativeButton={false}
            variant="outline"
            className="w-full justify-between h-11 px-4 text-xs font-medium rounded-xl active:scale-[0.99]"
          >
            <span className="flex items-center gap-2.5">
              <Ticket className="size-4 text-emerald-500" />
              <span>My Ticket Inventory</span>
            </span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Button>

          {isAdmin && (
            <div className="pt-2 border-t border-border/50">
              <p className="font-mono text-[10px] uppercase font-semibold text-muted-foreground px-1 pb-1">
                Admin Oversight
              </p>
              <Button
                render={<Link href="/events" />}
                nativeButton={false}
                variant="destructive"
                className="w-full justify-between h-11 px-4 text-xs font-semibold rounded-xl active:scale-[0.99]"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldAlert className="size-4" />
                  <span>Admin System Panel</span>
                </span>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Security / Seat Guarantee Note */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-1">
          <p className="font-display text-xs font-bold text-foreground">
            Atomic Seat Locking Active
          </p>
          <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
            All ticket holds are locked in PostgreSQL transactions to prevent double-booking.
          </p>
        </div>

      </div>
    </div>
  );
}
