"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { Event, Review } from "@/lib/types";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface EventReviewsSectionProps {
  event: Event;
  initialReviews?: Review[];
}

export function EventReviewsSection({
  event,
  initialReviews = [],
}: EventReviewsSectionProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const reviewsList = event.reviews && event.reviews.length > 0 ? event.reviews : initialReviews;
  const rating = event.averageRating ?? 0;
  const totalCount = event.totalReviews ?? reviewsList.length;

  const [isWriting, setIsWriting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isCompleted = event.status === "COMPLETED";

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/sign-in?redirect=/events/${event.id}`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

      const res = await fetch(`${serverUrl}/api/v1/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          eventId: event.id,
          rating: selectedRating,
          comment: comment.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setSubmitError(
          json.message || "Failed to submit review. Check eligibility.",
        );
        return;
      }

      setSubmitSuccess(true);
      setIsWriting(false);
      setComment("");
      router.refresh();
    } catch (err) {
      console.error("Error submitting review:", err);
      setSubmitError("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="reviews-heading" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
        <div>
          <h2
            id="reviews-heading"
            className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl"
          >
            Attendee Reviews & Ratings
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">
            Verified feedback from attendees
          </p>
        </div>

        {session && !isWriting && !submitSuccess && (
          <Button
            size="sm"
            onClick={() => setIsWriting(true)}
            className="rounded-full text-xs font-semibold self-start sm:self-auto"
          >
            <MessageSquare className="mr-1.5 size-3.5" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Summary Score Box */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-sm">
        <div className="sm:col-span-4 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-border/60 pb-4 sm:pb-0 sm:pr-4 text-center">
          <span className="font-display text-4xl font-extrabold text-foreground tabular-nums">
            {rating > 0 ? rating.toFixed(1) : "N/A"}
          </span>
          <div className="my-1.5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < Math.round(rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            Based on {totalCount} {totalCount === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="sm:col-span-8 flex flex-col justify-center gap-2 pl-0 sm:pl-2">
          {!isCompleted ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
              <AlertCircle className="size-4 shrink-0 text-muted-foreground/70 mt-0.5" />
              <span>
                Reviews open once an event is marked <strong>COMPLETED</strong>. Confirmed ticket holders can submit feedback after attending.
              </span>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Reviews are verified and submitted exclusively by confirmed attendees who completed this event.
            </p>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      {isWriting && (
        <form
          onSubmit={handleReviewSubmit}
          className="space-y-4 rounded-2xl border border-primary/30 bg-card p-5 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-foreground">
              Write Your Review
            </h3>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>

          {/* Interactive Star Picker */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-muted-foreground">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`size-6 ${
                      star <= (hoverRating || selectedRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="review-comment" className="font-mono text-xs text-muted-foreground">
              Your Feedback (Optional)
            </label>
            <textarea
              id="review-comment"
              rows={3}
              placeholder="Share your experience at this event..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>

          {submitError && (
            <p className="font-mono text-xs font-semibold text-destructive">
              {submitError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-full px-5 text-xs font-bold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </div>
        </form>
      )}

      {submitSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Thank you! Your review has been published.</span>
        </div>
      )}

      {/* Reviews Cards List */}
      {reviewsList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
          <p className="font-display text-base font-bold text-foreground">
            No reviews yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Be the first attendee to share feedback after attending this event!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviewsList.map((rev) => {
            const reviewerName = rev.user?.name || "Anonymous Attendee";
            const initials = reviewerName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const dateFormatted = formatDate(rev.createdAt);

            return (
              <div
                key={rev.id}
                className="space-y-2.5 rounded-2xl border border-border/70 bg-card/40 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9 border border-border">
                      {rev.user?.image && (
                        <AvatarImage src={rev.user.image} alt={reviewerName} />
                      )}
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {reviewerName}
                      </h4>
                      <p className="font-mono text-[11px] text-muted-foreground">
                        {dateFormatted}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars */}
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
                </div>

                {rev.comment && (
                  <p className="text-sm text-foreground/90 leading-relaxed pl-12">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
