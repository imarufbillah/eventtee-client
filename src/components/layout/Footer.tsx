import Link from "next/link";
import { Calendar, Globe, Share2, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/20 text-muted-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calendar className="size-4" strokeWidth={1.75} />
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight text-foreground">
                Event<span className="text-primary">tee</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Discover live events and reserve seats with real-time
              availability. Built for attendees who hate double-bookings and
              organizers who need a clean board.
            </p>
            <div className="flex items-center gap-3 pt-2 text-muted-foreground">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
                aria-label="GitHub Repository"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
                aria-label="Social Link"
              >
                <Share2 className="size-4" />
              </a>
              <a
                href="mailto:support@eventtee.com"
                className="hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
                aria-label="Email Support"
              >
                <Mail className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-foreground">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/events"
                  className="hover:text-foreground transition-colors"
                >
                  All Events
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=tech"
                  className="hover:text-foreground transition-colors"
                >
                  Tech Conferences
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=music"
                  className="hover:text-foreground transition-colors"
                >
                  Music Concerts
                </Link>
              </li>
              <li>
                <Link
                  href="/events?category=sports"
                  className="hover:text-foreground transition-colors"
                >
                  Sports Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform / Account */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-foreground">
              Account
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="hover:text-foreground transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/bookings"
                  className="hover:text-foreground transition-colors"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up?role=ORGANIZER"
                  className="hover:text-foreground transition-colors"
                >
                  Host an Event
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
              Why Eventtee
            </h4>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Atomic seat locking, live remaining inventory, and verified
              attendee reviews — so every ticket means a real seat.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Eventtee. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-foreground transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
