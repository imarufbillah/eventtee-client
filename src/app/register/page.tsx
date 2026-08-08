import { Metadata } from "next";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { AuthSidebar } from "@/components/auth/AuthSidebar";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account - EventTee",
  description:
    "Join EventTee to discover, host, and manage ticketed events easily.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#090d16] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-170">
        {/* Left Side: Brand Visual Sidebar */}
        <AuthSidebar />

        {/* Right Side: Register Form Card */}
        <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 glass-panel rounded-3xl shadow-xl dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80">
          {/* Mobile Header Logo */}
          <div className="flex lg:hidden items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-md">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                EventTee
              </span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              v2.0
            </span>
          </div>

          <div className="flex-1 flex items-center">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
}
