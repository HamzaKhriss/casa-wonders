import { Listing, User, Booking } from "./mockData";
import { mockListings, mockUser } from "./mockData";

// Base API URL - will be updated when FastAPI backend is ready
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Simulate API delay for realistic UX
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ListingFilters {
  category?: "restaurant" | "event" | "cultural";
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  date?: string;
  location?: {
    lat: number;
    lng: number;
    radius: number; // in km
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Listings API
export async function getListings(
  filters?: ListingFilters,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Listing>> {
  await delay(800); // Simulate network delay

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/listings?${new URLSearchParams({
  //   page: page.toString(),
  //   limit: limit.toString(),
  //   ...filters
  // })}`);
  // return response.json();

  let filteredListings = [...mockListings];

  // Apply filters
  if (filters) {
    if (filters.category) {
      filteredListings = filteredListings.filter(
        (listing) => listing.category === filters.category
      );
    }
    if (filters.minPrice) {
      filteredListings = filteredListings.filter(
        (listing) => listing.price >= filters.minPrice!
      );
    }
    if (filters.maxPrice) {
      filteredListings = filteredListings.filter(
        (listing) => listing.price <= filters.maxPrice!
      );
    }
    if (filters.minRating) {
      filteredListings = filteredListings.filter(
        (listing) => listing.rating >= filters.minRating!
      );
    }
    if (filters.location) {
      // Simple distance calculation for mock data
      filteredListings = filteredListings.filter((listing) => {
        const distance = calculateDistance(
          filters.location!.lat,
          filters.location!.lng,
          listing.location.lat,
          listing.location.lng
        );
        return distance <= filters.location!.radius;
      });
    }
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredListings.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: filteredListings.length,
    page,
    limit,
    hasMore: endIndex < filteredListings.length,
  };
}

export async function getListing(id: string): Promise<Listing | null> {
  await delay(500);

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/listings/${id}`);
  // return response.json();

  return mockListings.find((listing) => listing.id === id) || null;
}

export async function searchListings(query: string): Promise<Listing[]> {
  await delay(600);

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/listings/search?q=${encodeURIComponent(query)}`);
  // return response.json();

  const lowercaseQuery = query.toLowerCase();
  return mockListings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(lowercaseQuery) ||
      listing.titleFr.toLowerCase().includes(lowercaseQuery) ||
      listing.description.toLowerCase().includes(lowercaseQuery) ||
      listing.descriptionFr.toLowerCase().includes(lowercaseQuery)
  );
}

// User API
export async function getUser(): Promise<User> {
  await delay(400);

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/user`, {
  //   headers: { Authorization: `Bearer ${getAuthToken()}` }
  // });
  // return response.json();

  return mockUser;
}

export async function updateUserPreferences(
  preferences: Partial<User["preferences"]>
): Promise<User> {
  await delay(500);

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/user/preferences`, {
  //   method: 'PATCH',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${getAuthToken()}`
  //   },
  //   body: JSON.stringify(preferences)
  // });
  // return response.json();

  mockUser.preferences = { ...mockUser.preferences, ...preferences };
  return mockUser;
}

// Wishlist API
export async function addToWishlist(listingId: string): Promise<void> {
  await delay(300);

  // TODO: Replace with actual API call
  // await fetch(`${API_BASE_URL}/user/wishlist`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${getAuthToken()}`
  //   },
  //   body: JSON.stringify({ listingId })
  // });

  if (!mockUser.wishlist.includes(listingId)) {
    mockUser.wishlist.push(listingId);
  }
}

export async function removeFromWishlist(listingId: string): Promise<void> {
  await delay(300);

  // TODO: Replace with actual API call
  // await fetch(`${API_BASE_URL}/user/wishlist/${listingId}`, {
  //   method: 'DELETE',
  //   headers: { Authorization: `Bearer ${getAuthToken()}` }
  // });

  mockUser.wishlist = mockUser.wishlist.filter((id) => id !== listingId);
}

export async function getWishlist(): Promise<Listing[]> {
  await delay(500);

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/user/wishlist`, {
  //   headers: { Authorization: `Bearer ${getAuthToken()}` }
  // });
  // return response.json();

  return mockListings.filter((listing) =>
    mockUser.wishlist.includes(listing.id)
  );
}

// Booking API
export async function createBooking(
  booking: Omit<Booking, "id" | "createdAt">
): Promise<Booking> {
  await delay(1000);

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/bookings`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${getAuthToken()}`
  //   },
  //   body: JSON.stringify(booking)
  // });
  // return response.json();

  const newBooking: Booking = {
    ...booking,
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  mockUser.bookings.push(newBooking);
  return newBooking;
}

export async function getBookings(): Promise<Booking[]> {
  await delay(400);

  // TODO: Replace with actual API call
  // const response = await fetch(`${API_BASE_URL}/user/bookings`, {
  //   headers: { Authorization: `Bearer ${getAuthToken()}` }
  // });
  // return response.json();

  return mockUser.bookings;
}

export async function cancelBooking(bookingId: string): Promise<void> {
  await delay(500);

  // TODO: Replace with actual API call
  // await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
  //   method: 'POST',
  //   headers: { Authorization: `Bearer ${getAuthToken()}` }
  // });

  const booking = mockUser.bookings.find((b) => b.id === bookingId);
  if (booking) {
    booking.status = "cancelled";
  }
}

// Utility functions
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Auth helpers (placeholder for now)
function getAuthToken(): string {
  // TODO: Implement actual auth token retrieval
  return "mock-token";
}
