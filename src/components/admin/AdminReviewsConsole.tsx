"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Search, Filter, ShieldCheck, Mail, Trash2, RefreshCw, Loader2, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Review } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface AdminReviewsConsoleProps {
  initialReviews: Review[];
}

export function AdminReviewsConsole({ initialReviews }: AdminReviewsConsoleProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | 0>(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [hardDeletingId, setHardDeletingId] = useState<string | null>(null);

  const filteredReviews = useMemo(() => {
    return initialReviews.filter((r) => {
      // Star rating filter
      if (ratingFilter > 0 && r.rating !== ratingFilter) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = r.user?.name?.toLowerCase().includes(query);
        const emailMatch = r.user?.email?.toLowerCase().includes(query);
        const commentMatch = r.comment?.toLowerCase().includes(query);

        return nameMatch || emailMatch || commentMatch;
      }

      return true;
    });
  }, [initialReviews, ratingFilter, searchQuery]);

  const handleSoftDelete = async (reviewId: string) => {
    setActionLoadingId(reviewId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/reviews/soft-delete/${reviewId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Soft Delete Failed",
          description: json.message || "Failed to soft-delete review.",
        });
        return;
      }

      toast.add({
        title: "Review Soft-Deleted",
        description: "Review has been hidden from public event pages.",
      });

      router.refresh();
    } catch (err) {
      console.error("Soft delete review error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (reviewId: string) => {
    setActionLoadingId(reviewId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/reviews/restore/${reviewId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Restore Failed",
          description: json.message || "Failed to restore review.",
        });
        return;
      }

      toast.add({
        title: "Review Restored!",
        description: "Review has been restored to active status.",
      });

      router.refresh();
    } catch (err) {
      console.error("Restore review error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleHardDeleteConfirm = async (reviewId: string) => {
    setActionLoadingId(reviewId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/reviews/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Permanent Delete Failed",
          description: json.message || "Failed to purge review from database.",
        });
        return;
      }

      toast.add({
        title: "Review Permanently Purged",
        description: "Review entry has been permanently deleted.",
      });

      setHardDeletingId(null);
      router.refresh();
    } catch (err) {
      console.error("Hard delete error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
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
          <ShieldCheck className="size-7 text-primary" />
          <span>Review Moderation Console</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          Moderate attendee ratings and comments across all system events.
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
              placeholder="Search reviewer name, email, or comment text…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-full text-xs bg-card border-border/70"
            />
          </div>

          {/* Star Rating Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-muted/40 p-1 rounded-full border border-border/50">
            <button
              type="button"
              onClick={() => setRatingFilter(0)}
              className={`rounded-full px-3 py-1.5 font-mono text-xs font-semibold transition-all ${
                ratingFilter === 0
                  ? "bg-background text-foreground shadow-xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Stars
            </button>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRatingFilter(star)}
                className={`rounded-full px-3 py-1.5 font-mono text-xs font-semibold flex items-center gap-1 transition-all ${
                  ratingFilter === star
                    ? "bg-background text-foreground shadow-xs border border-border/60"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{star}</span>
                <Star className="size-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 overflow-hidden">
          
          {filteredReviews.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Filter className="mx-auto size-10 text-muted-foreground/40" />
              <h3 className="font-display text-base font-bold text-foreground">
                No matching reviews found
              </h3>
              <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
                No attendee reviews match your search query or selected star rating filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">Reviewer</th>
                    <th className="py-3.5 px-4 font-semibold">Rating</th>
                    <th className="py-3.5 px-4 font-semibold">Comment Feedback</th>
                    <th className="py-3.5 px-4 font-semibold">Submitted</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {filteredReviews.map((rev) => {
                    const reviewerName = rev.user?.name || "Anonymous Attendee";
                    const reviewerEmail = rev.user?.email || "N/A";
                    const initials = reviewerName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);
                    const isLoading = actionLoadingId === rev.id;

                    return (
                      <tr key={rev.id} className="hover:bg-muted/20 transition-colors">
                        
                        {/* Reviewer Details */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8 border border-border">
                              {rev.user?.image && (
                                <AvatarImage src={rev.user.image} alt={reviewerName} />
                              )}
                              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground text-xs">{reviewerName}</p>
                              <p className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                                <Mail className="size-3" />
                                <span>{reviewerEmail}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Rating Stars */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`size-3.5 ${
                                  i < rev.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Comment */}
                        <td className="py-4 px-4 max-w-xs">
                          {rev.comment ? (
                            <p className="text-xs text-foreground/90 leading-snug line-clamp-2">
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                          ) : (
                            <span className="font-mono text-[11px] text-muted-foreground opacity-60">
                              (Rating only, no text comment)
                            </span>
                          )}
                        </td>

                        {/* Submitted Date */}
                        <td className="py-4 px-4 font-mono text-[11px] text-muted-foreground">
                          {formatDate(rev.createdAt)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {rev.isDeleted ? (
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

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {rev.isDeleted ? (
                              <Button
                                size="sm"
                                disabled={isLoading}
                                onClick={() => handleRestore(rev.id)}
                                className="rounded-full text-xs font-bold h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
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
                                onClick={() => handleSoftDelete(rev.id)}
                                className="rounded-full text-xs font-semibold h-8 px-3 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/30 gap-1"
                              >
                                {isLoading ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <span>Soft Delete</span>
                                )}
                              </Button>
                            )}

                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => setHardDeletingId(rev.id)}
                              className="rounded-full text-xs font-bold h-8 px-3 gap-1"
                            >
                              <Trash2 className="size-3" />
                              <span>Purge</span>
                            </Button>
                          </div>
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

      {/* Permanent Hard-Delete Confirmation Modal */}
      {hardDeletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[2rem] border border-border/80 bg-card p-2 shadow-2xl">
            <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background p-5 space-y-4 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  Permanently Purge Review?
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  This action will permanently delete this review entry from the database.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHardDeletingId(null)}
                  disabled={actionLoadingId === hardDeletingId}
                  className="flex-1 rounded-full text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleHardDeleteConfirm(hardDeletingId)}
                  disabled={actionLoadingId === hardDeletingId}
                  className="flex-1 rounded-full text-xs font-bold gap-1"
                >
                  {actionLoadingId === hardDeletingId ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Purge Review"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
