import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/SignUpForm";

interface SignUpPageProps {
  searchParams: Promise<{
    role?: string;
    redirect?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SignUpPageProps): Promise<Metadata> {
  const params = await searchParams;
  const isOrganizer = params.role?.toUpperCase() === "ORGANIZER";

  return {
    title: isOrganizer
      ? "Host Events — Sign Up | Eventtee"
      : "Sign Up — Eventtee",
    description: isOrganizer
      ? "Create an Event Host account on Eventtee to publish and manage your events."
      : "Create an account on Eventtee to discover and book tickets for top events.",
  };
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  const rawRole = params.role?.toUpperCase();
  const initialRole: "USER" | "ORGANIZER" =
    rawRole === "ORGANIZER" ? "ORGANIZER" : "USER";

  const redirectUrl = params.redirect?.trim();

  return (
    <SignUpForm initialRole={initialRole} redirectUrl={redirectUrl} />
  );
}
