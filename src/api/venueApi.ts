import { api, handleApiError } from "./client";
import { getVenueEndpoint } from "./config";

// Types
export interface Venue {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  capacity?: number;
  image_url?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VenueResponse {
  data: Venue[];
  message?: string;
  status?: string;
}

// Venue API service
export class VenueApi {
  /**
   * Get all public venues
   */
  static async getPublicVenues(): Promise<VenueResponse> {
    try {
      console.log(
        "🚀 ~ VenueApi ~ getPublicVenues ~ endpoint:",
        getVenueEndpoint("publicAll")
      );
      const response = await api.get(getVenueEndpoint("publicAll"));
      console.log("🚀 ~ VenueApi ~ getPublicVenues ~ response:", response);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      console.log("🚀 ~ VenueApi ~ getPublicVenues ~ apiError:", apiError);
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
  getPublicVenues: VenueApi.getPublicVenues,
  getAllVenues: VenueApi.getAllVenues,
  createVenue: VenueApi.createVenue,
  updateVenue: VenueApi.updateVenue,
  deleteVenue: VenueApi.deleteVenue,
};





