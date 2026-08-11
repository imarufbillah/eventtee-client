import type { ApiResponse, Category, Event, PaginatedResponse, Review } from "./types";

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
    error: true,
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
        error: false,
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
    error: true,
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
        error: false,
      };
    }

    return fallback;
  } catch (error) {
    console.error("Error fetching active categories:", error);
    return fallback;
  }
}

export async function fetchEventById(id: string): Promise<Event | null> {
  try {
    const url = `${SERVER_URL}/api/v1/events/${id}`;
    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return null;
    }

    const json: ApiResponse<Event> = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error(`Error fetching event details for ID ${id}:`, error);
    return null;
  }
}

export async function fetchEventReviews(
  eventId: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<Review>> {
  const fallback = {
    items: [],
    total: 0,
    page: params?.page || 1,
    limit: params?.limit || 5,
    totalPages: 0,
  };

  try {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const url = `${SERVER_URL}/api/v1/events/${eventId}/reviews${
      query.toString() ? `?${query.toString()}` : ""
    }`;

    const res = await fetch(url, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return fallback;
    }

    const json = await res.json();
    const rawReviews = json?.data?.reviews || json?.data?.items || json?.data;

    if (Array.isArray(rawReviews)) {
      const total = json?.data?.total ?? rawReviews.length;
      const limit = params?.limit || 5;
      const page = params?.page || 1;
      return {
        items: rawReviews,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      };
    }

    return fallback;
  } catch (error) {
    console.error(`Error fetching reviews for event ID ${eventId}:`, error);
    return fallback;
  }
}
