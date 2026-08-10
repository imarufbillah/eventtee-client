import type { ApiResponse, Category, Event, PaginatedResponse } from "./types";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export async function fetchActiveEvents(params?: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}): Promise<PaginatedResponse<Event>> {
  const fallback: PaginatedResponse<Event> = {
    items: [],
    total: 0,
    page: 1,
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

    const json: ApiResponse<PaginatedResponse<Event>> = await res.json();
    if (json?.data && Array.isArray(json.data.items)) {
      return json.data;
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
    page: 1,
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

    const json: ApiResponse<PaginatedResponse<Category>> = await res.json();
    if (json?.data && Array.isArray(json.data.items)) {
      return json.data;
    }
    return fallback;
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return fallback;
  }
}
