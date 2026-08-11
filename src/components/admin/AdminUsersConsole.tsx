"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Search, Filter, ShieldCheck, Sparkles, User as UserIcon, Mail, Trash2, RefreshCw, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { User, Role } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface AdminUsersConsoleProps {
  initialUsers: User[];
  currentAdminId: string;
}

export function AdminUsersConsole({ initialUsers, currentAdminId }: AdminUsersConsoleProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | Role>("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((u) => {
      // Role filter
      if (roleFilter !== "ALL" && u.role !== roleFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = u.name?.toLowerCase().includes(query);
        const emailMatch = u.email?.toLowerCase().includes(query);

        return nameMatch || emailMatch;
      }

      return true;
    });
  }, [initialUsers, roleFilter, searchQuery]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setActionLoadingId(userId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/users/role/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Role Update Failed",
          description: json.message || "Failed to update user role.",
        });
        return;
      }

      toast.add({
        title: "Role Updated!",
        description: `User role has been changed to ${newRole}.`,
      });

      router.refresh();
    } catch (err) {
      console.error("Role update error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSoftDelete = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/users/soft-delete/${userId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Delete Failed",
          description: json.message || "Failed to soft-delete user.",
        });
        return;
      }

      toast.add({
        title: "User Soft-Deleted",
        description: "User account has been soft-deleted.",
      });

      router.refresh();
    } catch (err) {
      console.error("Soft delete error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/users/restore/${userId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Restore Failed",
          description: json.message || "Failed to restore user.",
        });
        return;
      }

      toast.add({
        title: "User Restored!",
        description: "User account has been restored to active status.",
      });

      router.refresh();
    } catch (err) {
      console.error("Restore error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="destructive" className="font-mono text-[10px] gap-1 px-2.5 py-0.5">
            <ShieldCheck className="size-3" />
            <span>SYSTEM ADMIN</span>
          </Badge>
        );
      case "ORGANIZER":
        return (
          <Badge variant="default" className="font-mono text-[10px] gap-1 px-2.5 py-0.5 bg-primary/20 text-primary border-primary/30">
            <Sparkles className="size-3" />
            <span>EVENT HOST</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="font-mono text-[10px] gap-1 px-2.5 py-0.5">
            <UserIcon className="size-3" />
            <span>ATTENDEE</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header & Breadcrumb */}
      <div className="space-y-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Dashboard Console</span>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Users className="size-7 text-primary" />
          <span>System User Management</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          View all registered accounts, manage role permissions, and soft-delete/restore users.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Keyword Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search user by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-full text-xs bg-card border-border/70"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-full border border-border/50 self-start md:self-auto">
            {(["ALL", "USER", "ORGANIZER", "ADMIN"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                  roleFilter === role
                    ? "bg-background text-foreground shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {role === "ALL" ? "All Users" : role}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* User Table */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 overflow-hidden">
          
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Filter className="mx-auto size-10 text-muted-foreground/40" />
              <h3 className="font-display text-base font-bold text-foreground">
                No matching user accounts found
              </h3>
              <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
                No system accounts match your search query or selected role filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">User Details</th>
                    <th className="py-3.5 px-4 font-semibold">Role Permission</th>
                    <th className="py-3.5 px-4 font-semibold">Member Since</th>
                    <th className="py-3.5 px-4 font-semibold">Account Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {filteredUsers.map((u) => {
                    const initials = u.name
                      ? u.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U";
                    const isSelf = u.id === currentAdminId;
                    const isLoading = actionLoadingId === u.id;

                    return (
                      <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                        
                        {/* User Details */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9 border border-border">
                              {u.image && <AvatarImage src={u.image} alt={u.name} />}
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground text-xs">{u.name}</p>
                                {isSelf && (
                                  <span className="font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5 font-bold">
                                    You
                                  </span>
                                )}
                              </div>
                              <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                                <Mail className="size-3" />
                                <span>{u.email}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role Permission */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getRoleBadge(u.role)}
                            {!isSelf && (
                              <select
                                disabled={isLoading}
                                value={u.role}
                                onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                                className="font-mono text-[11px] rounded-lg border border-border/70 bg-card px-2 py-1 text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              >
                                <option value="USER">USER</option>
                                <option value="ORGANIZER">ORGANIZER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            )}
                          </div>
                        </td>

                        {/* Member Since */}
                        <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">
                          {formatDate(u.createdAt)}
                        </td>

                        {/* Account Status */}
                        <td className="py-4 px-4">
                          {u.isDeleted ? (
                            <Badge variant="destructive" className="font-mono text-[10px] gap-1">
                              <Trash2 className="size-3" />
                              <span>DELETED</span>
                            </Badge>
                          ) : (
                            <Badge variant="default" className="font-mono text-[10px] gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                              <CheckCircle2 className="size-3" />
                              <span>ACTIVE</span>
                            </Badge>
                          )}
                        </td>

                        {/* Action Row */}
                        <td className="py-4 px-4 text-right">
                          {isSelf ? (
                            <span className="font-mono text-[11px] text-muted-foreground">—</span>
                          ) : u.isDeleted ? (
                            <Button
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleRestore(u.id)}
                              className="rounded-full text-xs font-bold px-3 py-1 h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                            >
                              {isLoading ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <>
                                  <RefreshCw className="size-3" />
                                  <span>Restore</span>
                                </>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => handleSoftDelete(u.id)}
                              className="rounded-full text-xs font-semibold px-3 py-1 h-8 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 gap-1"
                            >
                              {isLoading ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="size-3" />
                                  <span>Delete</span>
                                </>
                              )}
                            </Button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
