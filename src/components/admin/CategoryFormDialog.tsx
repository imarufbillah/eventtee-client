"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, Loader2, Save, X } from "lucide-react";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

interface CategoryFormDialogProps {
  category?: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryFormDialog({ category, isOpen, onClose }: CategoryFormDialogProps) {
  const router = useRouter();
  const isEdit = Boolean(category);

  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.add({
        title: "Validation Error",
        description: "Category name is required.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const endpoint = isEdit
        ? `${SERVER_URL}/api/v1/categories/${category?.id}`
        : `${SERVER_URL}/api/v1/categories`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: isEdit ? "Update Failed" : "Creation Failed",
          description: json.message || "Failed to save category.",
        });
        return;
      }

      toast.add({
        title: isEdit ? "Category Updated!" : "Category Created!",
        description: isEdit
          ? `Category "${name.trim()}" details were saved.`
          : `New category "${name.trim()}" has been created.`,
      });

      onClose();
      router.refresh();
    } catch (err) {
      console.error("Category form error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[2rem] border border-border/80 bg-card p-2 shadow-2xl">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background p-6 space-y-5">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <Tag className="size-5 text-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">
                {isEdit ? "Edit Category" : "Create New Category"}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Category Name */}
            <div className="space-y-2">
              <label htmlFor="cat-name" className="font-mono text-xs font-semibold text-foreground">
                Category Name *
              </label>
              <Input
                id="cat-name"
                type="text"
                required
                placeholder="e.g. Technology & Code"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 rounded-xl bg-card border-border/70 text-sm font-medium"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="cat-desc" className="font-mono text-xs font-semibold text-foreground">
                Description (Optional)
              </label>
              <textarea
                id="cat-desc"
                rows={3}
                placeholder="Brief summary of events included in this category taxonomy…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border/70 bg-card px-3 py-2.5 text-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full text-xs font-semibold"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="rounded-full text-xs font-bold gap-1.5 px-5"
              >
                {isSubmitting ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>{isEdit ? "Save Changes" : "Create Category"}</span>
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
