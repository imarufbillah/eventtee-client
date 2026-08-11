"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag, Plus, Search, Filter, Edit, Trash2, RefreshCw, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Category } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { CategoryFormDialog } from "./CategoryFormDialog";

interface AdminCategoriesConsoleProps {
  initialCategories: Category[];
}

export function AdminCategoriesConsole({ initialCategories }: AdminCategoriesConsoleProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    category?: Category | null;
  }>({ isOpen: false, category: null });
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return initialCategories;
    const query = searchQuery.toLowerCase();
    return initialCategories.filter((c) => {
      const nameMatch = c.name?.toLowerCase().includes(query);
      const slugMatch = c.slug?.toLowerCase().includes(query);
      const descMatch = c.description?.toLowerCase().includes(query);
      return nameMatch || slugMatch || descMatch;
    });
  }, [initialCategories, searchQuery]);

  const handleSoftDelete = async (categoryId: string) => {
    setActionLoadingId(categoryId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/categories/soft-delete/${categoryId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Delete Failed",
          description: json.message || "Failed to soft-delete category.",
        });
        return;
      }

      toast.add({
        title: "Category Soft-Deleted",
        description: "Category has been hidden from public event filters.",
      });

      router.refresh();
    } catch (err) {
      console.error("Soft delete category error:", err);
      toast.add({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestore = async (categoryId: string) => {
    setActionLoadingId(categoryId);
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
      const res = await fetch(`${SERVER_URL}/api/v1/categories/restore/${categoryId}`, {
        method: "PATCH",
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.add({
          title: "Restore Failed",
          description: json.message || "Failed to restore category.",
        });
        return;
      }

      toast.add({
        title: "Category Restored!",
        description: "Category taxonomy is now active for event categorization.",
      });

      router.refresh();
    } catch (err) {
      console.error("Restore category error:", err);
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
      
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Dashboard Console</span>
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Tag className="size-7 text-primary" />
            <span>Category Taxonomy Management</span>
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Create, edit, soft-delete, and restore event categories.
          </p>
        </div>

        <Button
          onClick={() => setDialogState({ isOpen: true, category: null })}
          size="sm"
          className="rounded-full px-5 text-xs font-bold shrink-0 self-start sm:self-auto shadow-md active:scale-[0.98]"
        >
          <Plus className="mr-1.5 size-4" />
          <span>Create New Category</span>
        </Button>
      </div>

      {/* Search Filter Bar */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xs backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 p-4 sm:p-5">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search category name, slug, description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 rounded-full text-xs bg-card border-border/70"
            />
          </div>
        </div>
      </div>

      {/* Category Table */}
      <div className="rounded-[2rem] border border-border/80 bg-card/80 p-2 shadow-xl backdrop-blur-md">
        <div className="rounded-[calc(2rem-0.5rem)] border border-border/60 bg-background/95 overflow-hidden">
          
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Filter className="mx-auto size-10 text-muted-foreground/40" />
              <h3 className="font-display text-base font-bold text-foreground">
                No categories found
              </h3>
              <p className="font-mono text-xs text-muted-foreground max-w-sm mx-auto">
                No event category taxonomies match your search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4 font-semibold">Category Name</th>
                    <th className="py-3.5 px-4 font-semibold">Slug Identifier</th>
                    <th className="py-3.5 px-4 font-semibold">Events Count</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-sm">
                  {filteredCategories.map((cat) => {
                    const eventCount = cat._count?.events || 0;
                    const isLoading = actionLoadingId === cat.id;

                    return (
                      <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                        
                        {/* Name & Description */}
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-foreground text-xs">{cat.name}</p>
                            {cat.description && (
                              <p className="font-mono text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="py-4 px-4 font-mono text-xs text-primary font-semibold">
                          /{cat.slug}
                        </td>

                        {/* Events Count */}
                        <td className="py-4 px-4 font-mono text-xs font-bold text-foreground">
                          {eventCount} {eventCount === 1 ? "event" : "events"}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {cat.isDeleted ? (
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

                        {/* Action Buttons */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isLoading}
                              onClick={() => setDialogState({ isOpen: true, category: cat })}
                              className="rounded-full text-xs font-semibold h-8 px-3 gap-1"
                            >
                              <Edit className="size-3" />
                              <span>Edit</span>
                            </Button>

                            {cat.isDeleted ? (
                              <Button
                                size="sm"
                                disabled={isLoading}
                                onClick={() => handleRestore(cat.id)}
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
                                onClick={() => handleSoftDelete(cat.id)}
                                className="rounded-full text-xs font-semibold h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30 gap-1"
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

      {/* Category Modal Dialog */}
      <CategoryFormDialog
        key={dialogState.category?.id || (dialogState.isOpen ? "open" : "closed")}
        category={dialogState.category}
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, category: null })}
      />

    </div>
  );
}
