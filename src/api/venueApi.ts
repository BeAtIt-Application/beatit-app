import { api, handleApiError } from "./client";
import { getVenueEndpoint } from "./config";

// Types
export interface Venue {
  id: number;
  name: string;
  city: string;
  image?: string;
  lat?: number;
  lng?: number;
  meters?: number;
  type?: string;
  type_label?: string;
  working_hours_today?: any[];
  bio?: string;
  address?: string;
  country?: string;
  phone_number?: string;
  email?: string;
  banner?: {
    id: number;
    url: string;
    srcset: string;
    webp: string[];
  };
  images?: Array<{
    id: number;
    banner: any;
    card: any;
    thumbnail: any;
  }>;
  logo?: string[] | {
    id: number;
    url: string;
    webp: string[];
    srcset: string;
  };
  venue_type_id?: number;
  is_active?: boolean;
  is_boosted?: boolean;
  slug?: string;
  user_id?: number;
  collaborator_id?: number;
  working_hours?: WorkingHour[];
  // Additional properties from API response
  upcoming_events?: VenueEvent[];
  past_events?: VenueEvent[];
  average_rating?: number;
  total_ratings?: number;
  current_user_rating?: number | null;
  is_favourite?: boolean;
  gallery?: any[];
}

export interface WorkingHour {
  day_of_week: string;
  opens_at: any;
  closes_at: any;
  is_closed: boolean;
}

export interface VenueEvent {
  id: number;
  name: string;
  event_start: string;
  image?: string | null;
  venue_name: string;
  city: string;
  lat?: number;
  lng?: number;
  meters?: number | null;
  music_genres?: string[];
  ticket_price?: number;
}

export interface VenueFilterParams {
  search?: string;
  city?: string;
  venue_type?: string;
  venueType?: number; // Venue type ID for map filtering
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  // Map-based filtering parameters
  latNE?: number; // Northeast corner latitude
  lngNE?: number; // Northeast corner longitude
  latSW?: number; // Southwest corner latitude
  lngSW?: number; // Southwest corner longitude
  zoom?: number; // Map zoom level (default: 14)
}

export interface VenueResponse {
  data?: Venue[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  status?: string;
}

// Rating types
export interface RateVenueRequest {
  rating: number; // 1-5
}

export interface RateVenueResponse {
  success: boolean;
  rating: number;
  total_ratings: number;
  average_rating: number;
}

export interface VenueRatingInfo {
  average_rating: number;
  total_ratings: number;
  current_user_rating: number | null;
}

// Venue API service
export class VenueApi {
  /**
   * Get filtered public venues
   */
  static async getPublicVenuesFiltered(filters: VenueFilterParams = {}): Promise<VenueResponse> {
    try {
      const response = await api.get(getVenueEndpoint("publicFilter"), {
        params: filters,
      });
      
      // Handle both array response and object response
      if (Array.isArray(response.data)) {
        return { data: response.data };
      }
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get single public venue by ID
   * Returns venue details including rating information (average_rating, total_ratings, current_user_rating)
   */
  static async getPublicVenueById(id: number): Promise<Venue> {
    try {
      const response = await api.get(`${getVenueEndpoint("publicGet")}/${id}`);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Rate a venue
   * @param venueId - The venue ID to rate
   * @param rating - Rating value (1-5)
   */
  static async rateVenue(venueId: number, rating: number): Promise<RateVenueResponse> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        throw new Error("Rating must be an integer between 1 and 5");
      }

      const endpoint = `/venue/public/${venueId}/rate-venue`;
      const requestBody: RateVenueRequest = { rating };
      
      const response = await api.post(endpoint, requestBody);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get venues near user location
   * @param lat - User latitude
   * @param lng - User longitude
   * @param radiusInMeters - Search radius in meters
   */
  static async getVenuesNearUser(
    lat: number, 
    lng: number, 
    radiusInMeters: number = 10000
  ): Promise<VenueResponse> {
    try {
      const endpoint = getVenueEndpoint("publicVenuesNearUser");
      const params = { lat, lng, radiusInMeters };
      
      const response = await api.get(endpoint, { params });
      // Handle both direct array response and nested object response
      if (Array.isArray(response.data)) {
        return { data: response.data };
      }
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Toggle venue favorite status
   * @param venueId - The venue ID to toggle favorite
   * @returns { is_favourite: boolean, message: string }
   */
  static async toggleVenueFavorite(venueId: number): Promise<{ is_favourite: boolean; message: string }> {
    try {
      const endpoint = `/venue/public/${venueId}/toggle-favourite`;
      
      const response = await api.post(endpoint);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

}

// Convenience functions
export const venueApi = {
  getPublicVenuesFiltered: VenueApi.getPublicVenuesFiltered,
  getPublicVenueById: VenueApi.getPublicVenueById,
  getVenuesNearUser: VenueApi.getVenuesNearUser,
  rateVenue: VenueApi.rateVenue,
  toggleVenueFavorite: VenueApi.toggleVenueFavorite,
};





