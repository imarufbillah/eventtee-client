import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || num === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
  }).format(num);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "";
  }
}

/** Compact ticket-stub date: "SEP 15" */
export function formatTicketDate(dateString: string): { month: string; day: string; weekday: string } {
  try {
    const date = new Date(dateString);
    return {
      month: new Intl.DateTimeFormat("en-US", { month: "short" })
        .format(date)
        .toUpperCase(),
      day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date),
      weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" })
        .format(date)
        .toUpperCase(),
    };
  } catch {
    return { month: "—", day: "—", weekday: "—" };
  }
}

export function getBookedPercent(bookedSeats: number, capacity: number): number {
  return Math.min(100, Math.round((bookedSeats / (capacity || 1)) * 100));
}

export function getCategoryAccent(slug: string): {
  tint: string;
  ink: string;
  bar: string;
} {
  const s = slug.toLowerCase();
  if (s.includes("tech") || s.includes("code") || s.includes("test")) {
    return {
      tint: "bg-primary/8 dark:bg-primary/15",
      ink: "text-primary",
      bar: "bg-primary",
    };
  }
  if (s.includes("music") || s.includes("concert")) {
    return {
      tint: "bg-fuchsia-500/10 dark:bg-fuchsia-500/15",
      ink: "text-fuchsia-600 dark:text-fuchsia-400",
      bar: "bg-fuchsia-500",
    };
  }
  if (s.includes("sport") || s.includes("fitness")) {
    return {
      tint: "bg-emerald-500/10 dark:bg-emerald-500/15",
      ink: "text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-500",
    };
  }
  if (s.includes("art") || s.includes("design")) {
    return {
      tint: "bg-amber-500/10 dark:bg-amber-500/15",
      ink: "text-amber-700 dark:text-amber-400",
      bar: "bg-amber-500",
    };
  }
  if (s.includes("business") || s.includes("work")) {
    return {
      tint: "bg-cyan-500/10 dark:bg-cyan-500/15",
      ink: "text-cyan-700 dark:text-cyan-400",
      bar: "bg-cyan-500",
    };
  }
  return {
    tint: "bg-primary/8 dark:bg-primary/15",
    ink: "text-primary",
    bar: "bg-primary",
  };
}

/** @deprecated Prefer getCategoryAccent — kept for any residual callers */
export function getCategoryGradient(slug: string): string {
  const slugLower = slug.toLowerCase();
  if (slugLower.includes("tech") || slugLower.includes("code")) {
    return "from-blue-600/20 via-indigo-600/15 to-purple-600/20 text-blue-500 border-blue-500/30";
  }
  if (slugLower.includes("music") || slugLower.includes("concert")) {
    return "from-purple-600/20 via-pink-600/15 to-rose-600/20 text-purple-500 border-purple-500/30";
  }
  if (slugLower.includes("sport") || slugLower.includes("fitness")) {
    return "from-emerald-600/20 via-teal-600/15 to-cyan-600/20 text-emerald-500 border-emerald-500/30";
  }
  if (slugLower.includes("art") || slugLower.includes("design")) {
    return "from-amber-600/20 via-orange-600/15 to-yellow-600/20 text-amber-500 border-amber-500/30";
  }
  if (slugLower.includes("business") || slugLower.includes("work")) {
    return "from-cyan-600/20 via-blue-600/15 to-indigo-600/20 text-cyan-500 border-cyan-500/30";
  }
  return "from-primary/20 via-primary/10 to-primary/5 text-primary border-primary/30";
}
