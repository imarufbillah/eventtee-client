"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { AuthHeader } from "./AuthHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignInFormProps {
  redirectUrl?: string;
}

export function SignInForm({ redirectUrl }: SignInFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const signInEmail = signIn.email as unknown as (
        opts: Record<string, unknown>,
      ) => Promise<{ error?: { message?: string } }>;

      const result = await signInEmail({
        email: trimmedEmail,
        password,
      });

      if (result?.error) {
        const errorMsg = result.error.message || "Invalid email address or password.";
        setErrorMessage(errorMsg);
        toast.add({
          title: "Sign in failed",
          description: errorMsg,
        });
        setIsSubmitting(false);
        return;
      }

      toast.add({
        title: "Welcome back!",
        description: "You have signed in successfully.",
      });

      // Successful authentication -> navigate to redirect URL or default catalog
      const destination = redirectUrl || "/events";
      router.push(destination);
      router.refresh();
    } catch (err) {
      console.error("Sign in error:", err);
      setErrorMessage("A network error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  const signUpLink = `/sign-up${
    redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""
  }`;

  return (
    <div className="rounded-[2rem] border border-border/80 bg-card/90 p-2 shadow-2xl backdrop-blur-md">
      {/* Concentric inner container */}
      <div className="flex flex-col gap-6 rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 sm:p-8">
        {/* Header */}
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to access your bookings and events"
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
          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="signin-email"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Email Address
            </label>
            <Input
              id="signin-email"
              type="email"
              placeholder="user@example.com"
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="signin-password"
                className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <Input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
                autoComplete="current-password"
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
                Signing In…
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer switch to Sign Up */}
        <div className="border-t border-border/60 pt-4 text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={signUpLink}
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
