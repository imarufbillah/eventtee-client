import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col justify-center overflow-hidden bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* Venue Glow Radial Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, oklch(0.48 0.22 265 / 0.12), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 120%, oklch(0.72 0.16 55 / 0.08), transparent 55%)",
        }}
      />

      {/* Top Header Logo Navigation */}
      <div className="absolute top-6 left-6 z-20 sm:top-8 sm:left-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-bold tracking-tight text-foreground transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-lg"
        >
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-black text-lg shadow-md transition-transform group-hover:scale-105">
            E
          </div>
          <span className="font-display text-lg">Eventtee</span>
        </Link>
      </div>

      {/* Auth Content Container */}
      <div className="mx-auto w-full max-w-md">{children}</div>
    </div>
  );
}
