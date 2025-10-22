import { api, handleApiError } from "./client";
import { getAuthEndpoint, getUserEndpoint } from "./config";
import { MusicGenre, PublicUser, VenueType } from "./userApi";

// Profile is the same structure as PublicUser
export type UserProfile = PublicUser;

// Update profile request
export interface UpdateProfileRequest {
  first_name: string; // required, min 2
  last_name: string; // required, min 2
  email?: string; // readonly, required by backend but cannot be changed
  phone_number?: string;
  username?: string;
  artist_tag?: string;
  bio?: string;
  city_from?: string;
  country_from?: string;
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
  music_genre_ids?: number[]; // min 3, max 5
  venue_type_ids?: number[]; // min 2, max 4
}

// Update password request
export interface UpdatePasswordRequest {
  current_password: string; // required
  password: string; // required, min 8
  password_confirmation: string; // required
}

// Update interests request
export interface UpdateInterestsRequest {
  type: 'music_genres' | 'venue_types';
  ids: number[];
}

// Response types
export interface ProfileResponse {
  message?: string;
  user?: UserProfile;
}

export interface PasswordUpdateResponse {
  message: string;
}

export interface AvatarUploadResponse {
  message: string;
  avatar_url?: string;
  avatar_thumbnail?: string;
}

export interface InterestsUpdateResponse {
  message: string;
  preferred_music_genres?: MusicGenre[];
  preferred_venue_types?: VenueType[];
}

// Profile API service
export class ProfileApi {
  /**
   * Get current user's profile
   */
  static async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get(getAuthEndpoint("me"));
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update current user's profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      // Use /me/profile endpoint for updating current user's profile
      const response = await api.patch(getAuthEndpoint("updateProfile"), data);
      return response.data.user || response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update current user's password
   */
  static async updatePassword(data: UpdatePasswordRequest): Promise<PasswordUpdateResponse> {
    try {
      const response = await api.patch(getAuthEndpoint("updatePassword"), data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Upload avatar for current user or specified user
   */
  static async uploadAvatar(file: File | Blob, userId?: number): Promise<AvatarUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', file as any);

      const endpoint = userId 
        ? `${getUserEndpoint("uploadAvatar")}/${userId}`
        : getUserEndpoint("uploadAvatar");

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update user interests (music genres or venue types)
   */
  static async updateInterests(data: UpdateInterestsRequest): Promise<InterestsUpdateResponse> {
    try {
      // Use /me/profile endpoint for updating interests
      const response = await api.patch(getAuthEndpoint("updateProfile"), data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }
}

// Convenience wrapper
export const profileApi = {
  getProfile: ProfileApi.getProfile,
  updateProfile: ProfileApi.updateProfile,
  updatePassword: ProfileApi.updatePassword,
  uploadAvatar: ProfileApi.uploadAvatar,
  updateInterests: ProfileApi.updateInterests,
};

