import React from "react";
import {
  Ticket,
  Calendar,
  Users,
  Sparkles,
  CheckCircle2,
  Star,
} from "lucide-react";

export function AuthSidebar() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-linear-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl shadow-2xl border border-white/10">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />

      {/* Top Brand Tagline */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-indigo-200 to-pink-200">
            EventTee
          </span>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            v2.0
          </span>
        </div>

        <h2 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
          Discover & Host <br />
          <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-300 to-pink-400">
            Extraordinary Events
          </span>
        </h2>
        <p className="text-slate-300 text-base max-w-md leading-relaxed">
          Join thousands of event organizers, creators, and attendees. Manage
          tickets, live RSVPs, and seamless check-ins all in one place.
        </p>
      </div>

      {/* Middle Interactive Floating Mock Card */}
      <div className="relative z-10 my-8">
        <div className="glass-panel p-6 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl animate-float">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-medium text-emerald-300 uppercase tracking-wider">
                Featured Live Event
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-white border border-white/10">
              VIP Pass
            </span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            Global Tech & Creator Summit 2026
          </h3>
          <p className="text-xs text-slate-300 mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Sep 18 - 20 •
            Convention Center
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">
                JD
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">
                SK
              </div>
              <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-slate-900 flex items-center justify-center text-xs font-bold">
                AM
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-300">
                +4k
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Tickets Left</span>
              <span className="text-sm font-bold text-indigo-300">
                42 / 5,000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Badges & Social Proof */}
      <div className="relative z-10 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Instant QR Ticketing</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Zero Booking Friction</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
            <span className="font-semibold text-white ml-1.5">4.9/5</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>50,000+ Active Members</span>
          </div>
        </div>
      </div>
    </div>
  );
}
