"use client";

import { Ticket, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  value: "USER" | "ORGANIZER";
  onChange: (role: "USER" | "ORGANIZER") => void;
  disabled?: boolean;
}

export function RoleSelector({ value, onChange, disabled }: RoleSelectorProps) {
  const roles: {
    id: "USER" | "ORGANIZER";
    title: string;
    description: string;
    icon: typeof Ticket;
  }[] = [
    {
      id: "USER",
      title: "Attendee",
      description: "Book & attend events",
      icon: Ticket,
    },
    {
      id: "ORGANIZER",
      title: "Event Host",
      description: "Create & manage events",
      icon: Sparkles,
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Select account role"
      className="grid grid-cols-2 gap-3"
    >
      {roles.map((r) => {
        const isSelected = value === r.id;
        const Icon = r.icon;

        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(r.id)}
            className={cn(
              "relative flex flex-col items-start gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-200 ease-out-expo select-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
              isSelected
                ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-sm"
                : "border-border/80 bg-card/50 text-muted-foreground hover:border-primary/40 hover:bg-muted hover:text-foreground",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-4" aria-hidden />
              </div>
              {isSelected && (
                <span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3 stroke-[3]" aria-hidden />
                </span>
              )}
            </div>

            <div>
              <span className="font-display text-sm font-bold text-foreground block">
                {r.title}
              </span>
              <span className="font-sans text-[11px] text-muted-foreground block mt-0.5 leading-tight">
                {r.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
