import { api, handleApiError } from "./client";
import { getAuthEndpoint } from "./config";

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  avatar_url?: string;
  avatar_thumbnail?: string;
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
  role: number;
  is_disabled: boolean;
  permissions_array: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Auth API service
export class AuthApi {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log("🚀 ~ AuthApi ~ login ~ credentials:", credentials);
      console.log("🚀 ~ AuthApi ~ login ~ endpoint:", getAuthEndpoint("login"));
      console.log(
        "🚀 ~ AuthApi ~ login ~ baseURL:",
        process.env.EXPO_PUBLIC_API_URL
      );
      console.log(
        "🚀 ~ AuthApi ~ login ~ full URL:",
        `${process.env.EXPO_PUBLIC_API_URL}${getAuthEndpoint("login")}`
      );

      const response = await api.post(getAuthEndpoint("login"), credentials);
      console.log("🚀 ~ AuthApi ~ login ~ response status:", response.status);
      console.log("🚀 ~ AuthApi ~ login ~ response headers:", response.headers);
      console.log("🚀 ~ AuthApi ~ login ~ response data:", response.data);

      // Extract token from Authorization header
      const token =
        response.headers.authorization || response.headers.Authorization;

      if (!token) {
        throw new Error("No authentication token received");
      }

      return {
        user: response.data,
        token: token,
      };
    } catch (error) {
      const apiError = handleApiError(error as any);
      console.log("🚀 ~ AuthApi ~ login ~ apiError:", apiError);
      throw new Error(apiError.message);
    }
  }

  /**
   * Register new user
   */
  static async signup(credentials: SignupCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post(getAuthEndpoint("signup"), credentials);

      // Extract token from Authorization header
      const token =
        response.headers.authorization || response.headers.Authorization;

      if (!token) {
        throw new Error("No authentication token received");
      }

      return {
        user: response.data,
        token: token,
      };
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Logout user (server-side session invalidation)
   */
  static async logout(): Promise<void> {
    try {
      await api.post(getAuthEndpoint("logout"));
    } catch (error) {
      // Don't throw error for logout - it's optional
      console.warn("Server logout failed:", error);
    }
  }

  /**
   * Get current user data
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get(getAuthEndpoint("me"));
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; refreshToken?: string }> {
    try {
      return await api.post(getAuthEndpoint("refresh"), { refreshToken });
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }
}

// Convenience functions
export const authApi = {
  login: AuthApi.login,
  signup: AuthApi.signup,
  logout: AuthApi.logout,
  getCurrentUser: AuthApi.getCurrentUser,
  refreshToken: AuthApi.refreshToken,
};
