import { api, handleApiError } from "./client";

// Types
export interface Taxonomy {
  id: number;
  name: string;
}

// Taxonomy API service
export class TaxonomyApi {
  /**
   * Get all music genres
   */
  static async getMusicGenres(): Promise<Taxonomy[]> {
    try {
      const response = await api.get("/taxonomies/music-genres");
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get all venue types
   */
  static async getVenueTypes(): Promise<Taxonomy[]> {
    try {
      const response = await api.get("/taxonomies/venue-types");
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }
}

// Convenience functions
export const taxonomyApi = {
  getMusicGenres: TaxonomyApi.getMusicGenres,
  getVenueTypes: TaxonomyApi.getVenueTypes,
};

