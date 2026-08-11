export type Role = "USER" | "ORGANIZER" | "ADMIN";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    events: number;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  price: number | string;
  capacity: number;
  bookedSeats: number;
  remainingSeats: number;
  startDate: string;
  location?: string | null;
  status: EventStatus;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  organizerId: string;
  category: Category;
  organizer: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  reviews?: Review[];
  averageRating: number | null;
  totalReviews: number;
}

export interface Booking {
  id: string;
  seats: number;
  seatsBooked?: number;
  totalPrice: number | string;
  status: BookingStatus;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  event?: Event;
  user?: User;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  user?: User;
}

export interface EventListPayload {
  events: Event[];
  total: number;
}

export interface CategoryListPayload {
  categories: Category[];
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  error?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
