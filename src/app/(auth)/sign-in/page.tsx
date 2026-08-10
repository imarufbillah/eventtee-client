import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";

interface SignInPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Sign In — Eventtee",
  description: "Sign in to your Eventtee account to manage bookings and events.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectUrl = params.redirect?.trim();

  return <SignInForm redirectUrl={redirectUrl} />;
}
