import { api, handleApiError } from "./client";
import { getUserPublicEndpoint } from "./config";

// Types
export interface MusicGenre {
  id: number;
  name: string;
}

export interface VenueType {
  id: number;
  name: string;
}

export interface PublicUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  username: string;
  artist_tag?: string;
  bio?: string;
  city_from?: string;
  country_from?: string;
  avatar_url?: string;
  avatar_thumbnail?: string;
  instagram_link?: string;
  instagram_video?: string;
  facebook_link?: string;
  facebook_video?: string;
  soundcloud_link?: string;
  soundcloud_track?: string;
  spotify_link?: string;
  spotify_track?: string;
  youtube_link?: string;
  youtube_video?: string;
  contact_phone?: string;
  contact_email?: string;
  email_verified_at?: string;
  role?: string;
  is_disabled?: boolean;
  permissions_array?: string[];
  preferred_music_genres?: MusicGenre[];
  preferred_venue_types?: VenueType[];
}

export type Artist = PublicUser;
export type Organization = PublicUser;

export interface UserPagination {
  total: number;
  count: number;
  currentPage: number;
  lastPage: number;
  limit: number;
  options: {
    path: string;
    pageName: string;
  };
  dataLength: number;
}

export interface UserListResponse {
  data: PublicUser[];
  pagination: UserPagination;
}

export interface UserFilterParams {
  length?: number;
  column?: string;
  dir?: 'asc' | 'desc';
  search?: string;
  draw?: number;
  page?: number;
  limit?: number;
  music_genre?: number[]; // Array of genre IDs for filtering
  city?: string; // City name for filtering
}

// User API service
export class UserApi {
  /**
   * Get filtered public artists
   */
  static async getPublicArtists(filters: UserFilterParams = {}): Promise<UserListResponse> {
    try {
      const params: any = {
        length: filters.limit || filters.length || 20,
        column: filters.column || 'users.first_name',
        dir: filters.dir || 'asc',
        search: filters.search || '',
        draw: filters.draw || 1,
        page: filters.page || 1,
      };

      // Add music_genre filter if provided
      if (filters.music_genre && filters.music_genre.length > 0) {
        params.music_genre = filters.music_genre;
      }

      // Add city filter if provided
      if (filters.city) {
        params.city = filters.city;
      }

      const response = await api.get(getUserPublicEndpoint("artists"), {
        params,
      });
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get filtered public organizations
   */
  static async getPublicOrganizations(filters: UserFilterParams = {}): Promise<UserListResponse> {
    try {
      const params: any = {
        length: filters.limit || filters.length || 20,
        column: filters.column || 'users.first_name',
        dir: filters.dir || 'asc',
        search: filters.search || '',
        draw: filters.draw || 1,
        page: filters.page || 1,
      };

      // Add music_genre filter if provided
      if (filters.music_genre && filters.music_genre.length > 0) {
        params.music_genre = filters.music_genre;
      }

      // Add city filter if provided
      if (filters.city) {
        params.city = filters.city;
      }

      const response = await api.get(getUserPublicEndpoint("organizations"), {
        params,
      });
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get single public user (artist/organization) by ID
   */
  static async getPublicUserById(id: number): Promise<PublicUser> {
    try {
      const response = await api.get(`${getUserPublicEndpoint("detail")}/${id}`);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }
}

// Convenience wrapper with default error handling
export const userApi = {
  getPublicArtists: UserApi.getPublicArtists,
  getPublicOrganizations: UserApi.getPublicOrganizations,
  getPublicUserById: UserApi.getPublicUserById,
};
