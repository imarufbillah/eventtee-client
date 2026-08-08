import Link from "next/link";
import {
  Ticket,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserPlus,
  LogIn,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-white flex flex-col justify-between">
      {/* Header Navigation */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-pink-200">
              EventTee
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center flex-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation Event Management & Ticketing Platform</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl mb-6">
          The seamless way to host & discover{" "}
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500">
            extraordinary experiences
          </span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          Manage ticketing, live guest check-ins, VIP passes, and analytics with
          zero friction. Built for modern event creators and passionate
          attendees.
        </p>

        {/* Action Callouts */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm justify-center">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-sm shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Create Free Account</span>
          </Link>
        </div>

        {/* Features Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Smart QR Tickets
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant digital passes with dynamic QR validation for
              lightning-fast event entrances.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Enterprise Security
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Powered by Better Auth & JWT tokens ensuring secure authentication
              and privacy.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">
              Real-Time Analytics
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Track ticket sales, attendance trends, and audience engagement
              live as it happens.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>© 2026 EventTee. All rights reserved.</p>
      </footer>
    </div>
  );
}
