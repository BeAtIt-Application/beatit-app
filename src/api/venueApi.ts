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

}

// Convenience functions
export const venueApi = {
  getPublicVenuesFiltered: VenueApi.getPublicVenuesFiltered,
  getPublicVenueById: VenueApi.getPublicVenueById,
  getVenuesNearUser: VenueApi.getVenuesNearUser,
};





