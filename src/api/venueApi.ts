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
  working_hours_today?: any[];
  bio?: string;
  address?: string;
  country?: string;
  phone_number?: string;
  email?: string;
  images?: string[];
  logo?: string[];
  venue_type_id?: number;
  is_active?: boolean;
  is_boosted?: boolean;
  slug?: string;
  user_id?: number;
  collaborator_id?: number;
  working_hours?: WorkingHour[];
}

export interface WorkingHour {
  day_of_week: string;
  opens_at: any;
  closes_at: any;
  is_closed: boolean;
}

export interface VenueFilterParams {
  search?: string;
  city?: string;
  venue_type?: string;
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
}

export interface VenueResponse {
  data?: Venue[];
  total?: number;
  page?: number;
  limit?: number;
  message?: string;
  status?: string;
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
   * Get venues near user location
   */
  static async getVenuesNearUser(
    lat: number, 
    lng: number, 
    radius: number = 10
  ): Promise<VenueResponse> {
    try {
      const response = await api.get(getVenueEndpoint("publicVenuesNearUser"), {
        params: { lat, lng, radius },
      });
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get all venues (requires authentication)
   */
  static async getAllVenues(): Promise<VenueResponse> {
    try {
      const response = await api.get(getVenueEndpoint("all"));
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Create a new venue (requires authentication)
   */
  static async createVenue(venueData: Partial<Venue>): Promise<Venue> {
    try {
      const response = await api.post(getVenueEndpoint("create"), venueData);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update a venue (requires authentication)
   */
  static async updateVenue(
    id: number,
    venueData: Partial<Venue>
  ): Promise<Venue> {
    try {
      const response = await api.put(
        `${getVenueEndpoint("update")}/${id}`,
        venueData
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Delete a venue (requires authentication)
   */
  static async deleteVenue(id: number): Promise<void> {
    try {
      await api.delete(`${getVenueEndpoint("delete")}/${id}`);
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
  getAllVenues: VenueApi.getAllVenues,
  createVenue: VenueApi.createVenue,
  updateVenue: VenueApi.updateVenue,
  deleteVenue: VenueApi.deleteVenue,
};





