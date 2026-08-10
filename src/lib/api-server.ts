import type { ApiResponse, Category, Event, PaginatedResponse } from "./types";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export async function fetchActiveEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}): Promise<PaginatedResponse<Event>> {
  const fallback: PaginatedResponse<Event> = {
    items: [],
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 6,
    totalPages: 0,
  };

  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.categoryId) query.set("categoryId", params.categoryId);

    const url = `${SERVER_URL}/api/v1/events/active${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return fallback;
    }

    const json: ApiResponse<{ events?: Event[]; items?: Event[]; total?: number }> = await res.json();
    const rawEvents = json?.data?.events || json?.data?.items;

    if (Array.isArray(rawEvents)) {
      const total = json.data?.total ?? rawEvents.length;
      const limit = params?.limit || 6;
      const page = params?.page || 1;
      return {
        items: rawEvents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    return fallback;
  } catch (error) {
    console.error("Error fetching active events:", error);
    return fallback;
  }
}

export async function fetchActiveCategories(params?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<Category>> {
  const fallback: PaginatedResponse<Category> = {
    items: [],
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 20,
    totalPages: 0,
  };

  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const url = `${SERVER_URL}/api/v1/categories/active${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    const res = await fetch(url, {
      next: { revalidate: 120 },
    });

    if (!res.ok) {
      return fallback;
    }

    const json: ApiResponse<{ categories?: Category[]; items?: Category[]; total?: number }> = await res.json();
    const rawCategories = json?.data?.categories || json?.data?.items;

    if (Array.isArray(rawCategories)) {
      const total = json.data?.total ?? rawCategories.length;
      const limit = params?.limit || 20;
      const page = params?.page || 1;
      return {
        items: rawCategories,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    return fallback;
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return fallback;
  }
}
