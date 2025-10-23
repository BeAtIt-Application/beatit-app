import { api, handleApiError } from "./client";
import { getEventEndpoint } from "./config";

// Types
export interface Event {
  id: number;
  name: string;
  description?: string;
  event_start: string;
  city: string;
  image?: string;
  event_image?: string;
  lat?: string;
  lng?: string;
  meters?: number;
  music_genres?: string[];
  ticket_price?: string;
  venue_name?: string;
  venue_id?: number;
  user_status?: 'interested' | 'going' | null;
  interested_count?: number;
  going_count?: number;
  // New fields from API response
  current_user_vote?: 'interested' | 'going' | null;
  interested_percentage?: number;
  going_percentage?: number;
  total_votes?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventFilterParams {
  search?: string;
  city?: string;
  genre?: string;
  musicGenre?: number; // Music genre ID for map filtering
  venueType?: number; // Venue type ID for map filtering
  date_from?: string;
  date_to?: string;
  dateFilter?: 'today' | 'this_week' | 'next_2_weeks' | 'this_month' | 'this_year' | 'custom';
  startDate?: string; // Custom date range start
  endDate?: string; // Custom date range end
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

export interface EventResponse {
  data?: Event[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  status?: string;
}

export interface EventToggleStatusRequest {
  status: 'interested' | 'going';
}

export interface EventToggleStatusResponse {
  message: string;
  status: 'interested' | 'going' | null;
  previous_status?: 'interested' | 'going' | null;
  action?: string;
  success: boolean;
  // Optional count fields (may not be present in all responses)
  interested_count?: number;
  going_count?: number;
  // Optional percentage fields in case API returns them directly
  interested_percentage?: number;
  going_percentage?: number;
}

// Event API service
export class EventApi {
  /**
   * Get filtered public events
   */
  static async getPublicEvents(filters: EventFilterParams = {}): Promise<EventResponse> {
    try {
      const response = await api.get(getEventEndpoint("publicFilter"), {
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
   * Get single public event by ID
   */
  static async getPublicEventById(id: number): Promise<Event> {
    try {
      const response = await api.get(`${getEventEndpoint("publicGet")}/${id}`);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get events near user location
   * @param lat - User latitude
   * @param lng - User longitude
   * @param radiusInMeters - Search radius in meters
   * @param filters - Additional filter parameters (genre, date, etc.)
   */
  static async getEventsNearUser(
    lat: number, 
    lng: number, 
    radiusInMeters: number = 10000,
    filters: Omit<EventFilterParams, 'lat' | 'lng' | 'radius'> = {}
  ): Promise<EventResponse> {
    try {
      const endpoint = getEventEndpoint("publicEventsNearUser");
      const params = { lat, lng, radiusInMeters, ...filters };
      
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
   * Toggle user's event status (interested/going)
   */
  static async toggleEventStatus(
    id: number, 
    status: 'interested' | 'going'
  ): Promise<EventToggleStatusResponse> {
    try {
      const response = await api.post(
        `${getEventEndpoint("publicToggleStatus")}/${id}/toggle-status`,
        { status }
      );
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }
}

// Convenience functions
export const eventApi = {
  getPublicEvents: EventApi.getPublicEvents,
  getPublicEventById: EventApi.getPublicEventById,
  getEventsNearUser: EventApi.getEventsNearUser,
  toggleEventStatus: EventApi.toggleEventStatus,
};
