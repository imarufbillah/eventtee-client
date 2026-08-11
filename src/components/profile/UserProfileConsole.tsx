"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User as UserIcon, Mail, ShieldCheck, Sparkles, Loader2, ArrowLeft, CheckCircle2, Image as ImageIcon, Save } from "lucide-react";
import type { User, Role } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface UserProfileConsoleProps {
  user: User;
}

export function UserProfileConsole({ user }: UserProfileConsoleProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role: Role = user.role || "USER";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Name field cannot be empty.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim() || null,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Update Failed",
          description: json.message || "Failed to update profile.",
        });
        return;
      }

      toast.add({
        title: "Profile Updated!",
        description: "Your account details have been saved successfully.",
      });

      router.refresh();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = () => {
    if (role === "ADMIN") {
      return (
        <Badge variant="destructive" className="font-mono text-[10px] gap-1 px-2.5 py-0.5">
          <ShieldCheck className="size-3" />
          <span>SYSTEM ADMIN</span>
        </Badge>
      );
    }
    if (role === "ORGANIZER") {
      return (
        <Badge variant="default" className="font-mono text-[10px] gap-1 px-2.5 py-0.5 bg-primary/20 text-primary border-primary/30">
          <Sparkles className="size-3" />
          <span>EVENT HOST</span>
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="font-mono text-[10px] gap-1 px-2.5 py-0.5">
        <UserIcon className="size-3" />
        <span>ATTENDEE</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Header Breadcrumb */}
      <div className="space-y-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Dashboard Console</span>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <UserIcon className="size-7 text-primary" />
          <span>Account &amp; Profile Settings</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Manage your personal details, avatar image, and account role.
        </p>
      </div>

      {/* Main Double-Bezel Profile Card */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 sm:p-8 space-y-8">
          
          {/* Avatar Preview & Role Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/50 pb-6">
            <div className="flex items-center gap-5">
              <Avatar size="lg" className="size-20 shrink-0 border-2 border-primary/30 shadow-md">
                {image && <AvatarImage src={image} alt={name} />}
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {user.name}
                  </h2>
                  {getRoleBadge()}
                </div>

                <p className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-muted-foreground/70" />
                  <span>{user.email}</span>
                </p>

                <p className="font-mono text-[11px] text-muted-foreground">
                  Member since {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-3 font-mono text-[11px] space-y-1 text-muted-foreground self-start sm:self-auto">
              <span className="block font-semibold text-foreground">Account Status</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="size-3.5" />
                <span>Active &amp; Verified</span>
              </span>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-4">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="profile-name" className="font-mono text-xs font-semibold text-foreground">
                  Full Display Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-9 h-11 rounded-xl bg-card border-border/70 text-sm"
                  />
                </div>
              </div>

              {/* Avatar Image URL */}
              <div className="space-y-2">
                <label htmlFor="profile-image" className="font-mono text-xs font-semibold text-foreground">
                  Avatar Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="profile-image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="pl-9 h-11 rounded-xl bg-card border-border/70 text-sm"
                  />
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Provide a public image URL for your profile picture.
                </p>
              </div>

              {/* Email (Read-Only) */}
              <div className="space-y-2">
                <label className="font-mono text-xs font-semibold text-foreground opacity-70">
                  Registered Email Address (Managed by Better Auth)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="email"
                    disabled
                    value={user.email}
                    className="pl-9 h-11 rounded-xl bg-muted/40 border-border/50 text-sm font-mono opacity-80"
                  />
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border/50">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-6 h-11 text-xs font-bold gap-2 shadow-md active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Saving Changes…</span>
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </Button>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
}
