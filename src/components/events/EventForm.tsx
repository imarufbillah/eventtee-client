"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, DollarSign, Users, Tag, FileText, ArrowLeft, Loader2, Save, Sparkles } from "lucide-react";
import type { Category, Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

interface EventFormProps {
  categories: Category[];
  initialEvent?: Event;
  isEdit?: boolean;
}

export function EventForm({ categories, initialEvent, isEdit = false }: EventFormProps) {
  const router = useRouter();

  // Format initial ISO date string for datetime-local input
  const defaultDateString = initialEvent?.startDate
    ? new Date(initialEvent.startDate).toISOString().slice(0, 16)
    : "";

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(initialEvent?.description || "");
  const [price, setPrice] = useState<string>(
    initialEvent?.price !== undefined ? String(initialEvent.price) : "0"
  );
  const [capacity, setCapacity] = useState<string>(
    initialEvent?.capacity !== undefined ? String(initialEvent.capacity) : "100"
  );
  const [startDate, setStartDate] = useState(defaultDateString);
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [categoryId, setCategoryId] = useState(
    initialEvent?.categoryId || (categories[0]?.id || "")
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !location.trim() || !startDate || !categoryId) {
      toast.add({
        title: "Validation Error",
        description: "Please fill in all required event fields.",
      });
      return;
    }

    const numPrice = parseFloat(price);
    const numCapacity = parseInt(capacity, 10);

    if (isNaN(numPrice) || numPrice < 0) {
      toast.add({
        title: "Invalid Price",
        description: "Ticket price must be a valid non-negative number.",
      });
      return;
    }

    if (isNaN(numCapacity) || numCapacity < 1) {
      toast.add({
        title: "Invalid Capacity",
        description: "Seat capacity must be at least 1.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const isoStartDate = new Date(startDate).toISOString();

      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        capacity: numCapacity,
        startDate: isoStartDate,
        location: location.trim(),
        categoryId,
      };

      const endpoint = isEdit
        ? `${SERVER_URL}/api/v1/events/${initialEvent?.id}`
        : `${SERVER_URL}/api/v1/events`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: isEdit ? "Update Failed" : "Creation Failed",
          description: json.message || "Failed to save event details.",
        });
        return;
      }

      toast.add({
        title: isEdit ? "Event Updated!" : "Event Draft Created!",
        description: isEdit
          ? `"${title}" details have been updated.`
          : `"${title}" created as DRAFT. Publish when ready!`,
      });

      router.push("/dashboard/events");
      router.refresh();
    } catch (err) {
      console.error("Event form error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Breadcrumb */}
      <div className="space-y-1">
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Hosted Events Board</span>
        </Link>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
          <Sparkles className="size-7 text-primary" />
          <span>{isEdit ? "Edit Event Details" : "Create New Event"}</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground">
          {isEdit
            ? "Update ticket pricing, capacity, and venue information."
            : "Set event title, price, seat capacity, and schedule. Starts in DRAFT status."}
        </p>
      </div>

      {/* Main Double-Bezel Form Container */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-6 sm:p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Event Title */}
            <div className="space-y-2">
              <label htmlFor="event-title" className="font-mono text-xs font-semibold text-foreground">
                Event Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="event-title"
                  type="text"
                  required
                  placeholder="e.g. Next.js & AI Developers Summit 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pl-9 h-11 rounded-xl bg-card border-border/70 text-sm font-medium"
                />
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label htmlFor="event-category" className="font-mono text-xs font-semibold text-foreground">
                Category Taxonomy *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                <select
                  id="event-category"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full pl-9 pr-4 h-11 rounded-xl bg-card border border-border/70 text-sm font-medium text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label htmlFor="event-description" className="font-mono text-xs font-semibold text-foreground">
                Event Description *
              </label>
              <textarea
                id="event-description"
                required
                rows={4}
                placeholder="Describe key highlights, schedule, speakers, and instructions for attendees…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-card px-3.5 py-3 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>

            {/* Price & Capacity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Ticket Price */}
              <div className="space-y-2">
                <label htmlFor="event-price" className="font-mono text-xs font-semibold text-foreground">
                  Ticket Price ($ USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="event-price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="pl-9 h-11 rounded-xl bg-card border-border/70 text-sm font-mono"
                  />
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Set 0 for free admission events.
                </p>
              </div>

              {/* Total Seat Capacity */}
              <div className="space-y-2">
                <label htmlFor="event-capacity" className="font-mono text-xs font-semibold text-foreground">
                  Total Seat Capacity *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="event-capacity"
                    type="number"
                    min="1"
                    required
                    placeholder="100"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="pl-9 h-11 rounded-xl bg-card border-border/70 text-sm font-mono"
                  />
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  Maximum seats protected by atomic transaction locking.
                </p>
              </div>

            </div>

            {/* Date & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Start Date & Time */}
              <div className="space-y-2">
                <label htmlFor="event-startdate" className="font-mono text-xs font-semibold text-foreground">
                  Start Date &amp; Time *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="event-startdate"
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9 h-11 rounded-xl bg-card border-border/70 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Location / Venue */}
              <div className="space-y-2">
                <label htmlFor="event-location" className="font-mono text-xs font-semibold text-foreground">
                  Venue / Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="event-location"
                    type="text"
                    required
                    placeholder="e.g. Convention Center, Main Hall"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-9 h-11 rounded-xl bg-card border-border/70 text-sm"
                  />
                </div>
              </div>

            </div>

            {/* Action CTAs */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
              <Button
                render={<Link href="/dashboard/events" />}
                nativeButton={false}
                variant="outline"
                className="rounded-full px-5 h-11 text-xs font-semibold"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-6 h-11 text-xs font-bold gap-2 shadow-md active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Saving Event…</span>
                  </>
                ) : (
                  <>
                    <Save className="size-4" />
                    <span>{isEdit ? "Save Changes" : "Save as Draft"}</span>
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
