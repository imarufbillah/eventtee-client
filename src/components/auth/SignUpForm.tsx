"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { AuthHeader } from "./AuthHeader";
import { RoleSelector } from "./RoleSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignUpFormProps {
  initialRole?: "USER" | "ORGANIZER";
  redirectUrl?: string;
}

export function SignUpForm({
  initialRole = "USER",
  redirectUrl,
}: SignUpFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ORGANIZER">(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const signUpEmail = signUp.email as unknown as (
        opts: Record<string, unknown>,
      ) => Promise<{ error?: { message?: string } }>;

      const result = await signUpEmail({
        email: trimmedEmail,
        password,
        name: trimmedName,
        role,
      });

      if (result.error) {
        const errorMsg = result.error.message || "Failed to create account. Please try again.";
        setErrorMessage(errorMsg);
        toast.add({
          title: "Sign up failed",
          description: errorMsg,
        });
        setIsSubmitting(false);
        return;
      }

      toast.add({
        title: "Account created!",
        description: `Welcome to Eventtee as ${role === "ORGANIZER" ? "an Event Host" : "an Attendee"}.`,
      });

      // Successful registration & auto session log-in
      const destination =
        redirectUrl || (role === "ORGANIZER" ? "/events" : "/events");

      router.push(destination);
      router.refresh();
    } catch (err) {
      console.error("Sign up error:", err);
      setErrorMessage("A network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const signInLink = `/sign-in${
    redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""
  }`;

  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/90 p-2 shadow-2xl backdrop-blur-md">
      {/* Concentric inner container */}
      <div className="flex flex-col gap-6 rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 sm:p-8">
        
        {/* Header */}
        <AuthHeader
          title="Create your account"
          subtitle="Join Eventtee to discover and host events"
        />

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Account Type
            </label>
            <RoleSelector
              value={role}
              onChange={setRole}
              disabled={isSubmitting}
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="signup-name"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Full Name
            </label>
            <Input
              id="signup-name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="name"
              className="h-10 text-sm"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="signup-email"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email Address
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              required
              autoComplete="email"
              className="h-10 text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="signup-password"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
                minLength={8}
                autoComplete="new-password"
                className="h-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isSubmitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-11 rounded-full font-bold shadow-md active:scale-[0.99] mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Creating Account…
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer switch to Sign In */}
        <div className="border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={signInLink}
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
          >
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
