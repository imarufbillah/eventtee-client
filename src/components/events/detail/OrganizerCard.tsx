import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, ShieldCheck } from "lucide-react";
import type { Event } from "@/lib/types";

interface OrganizerCardProps {
  organizer: Event["organizer"];
}

export function OrganizerCard({ organizer }: OrganizerCardProps) {
  const initials = organizer.name
    ? organizer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "OH";

  return (
    <div className="rounded-2xl border border-border/70 bg-card/60 p-4 sm:p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar className="size-11 border border-border/80">
            {organizer.image && <AvatarImage src={organizer.image} alt={organizer.name} />}
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground truncate text-base">
                {organizer.name}
              </span>
              <ShieldCheck className="size-4 shrink-0 text-primary" aria-label="Verified Host" />
            </div>
            <p className="font-mono text-xs text-muted-foreground">Event Organizer</p>
          </div>
        </div>

        {organizer.email && (
          <a
            href={`mailto:${organizer.email}`}
            aria-label={`Contact ${organizer.name}`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-background px-3.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Mail className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Contact Host</span>
          </a>
        )}
      </div>
    </div>
  );
}
