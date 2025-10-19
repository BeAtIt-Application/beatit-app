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
  email_verified_at?: string;
  preferred_music_genres?: any[];
  preferred_venue_types?: any[];
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

export interface SignupResponse {
  message: string;
  user: User;
  interests_selection_required: boolean;
}

export interface SaveInterestsRequest {
  email: string;
  music_genre_ids: number[];
  venue_type_ids: number[];
}

export interface SaveInterestsResponse {
  message: string;
  email_verification_required?: boolean;
}

export interface VerifyEmailByCodeRequest {
  email: string;
  code: string;
}

export interface VerifyEmailByCodeResponse {
  message: string;
  user: User; // API returns the user object instead of a verified flag
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
  static async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    try {
      console.log("AuthApi.signup: Calling API with:", credentials.email);
      console.log("AuthApi.signup: Endpoint:", getAuthEndpoint("signup"));
      console.log("AuthApi.signup: Full URL:", `${process.env.EXPO_PUBLIC_API_URL}${getAuthEndpoint("signup")}`);
      
      const response = await api.post(getAuthEndpoint("signup"), credentials);
      
      console.log("AuthApi.signup: Response status:", response.status);
      console.log("AuthApi.signup: Response headers:", response.headers);
      console.log("AuthApi.signup: Response data:", response.data);
      
      // Handle different response formats
      const data = response.data;
      
      // If we have a standard format with user and message, return it
      if (data && typeof data === 'object' && data.user) {
        return {
          message: data.message || "Account created successfully",
          user: data.user,
          interests_selection_required: data.interests_selection_required !== false
        };
      }
      
      // If we have a different format, try to adapt it
      if (data && typeof data === 'object') {
        // Try to extract user data from various formats
        const user = data.user || data.data || {
          id: 0,
          email: credentials.email,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          role: 1,
          is_disabled: false,
          permissions_array: []
        };
        
        return {
          message: data.message || "Account created successfully",
          user,
          interests_selection_required: true
        };
      }
      
      // If all else fails, create a minimal valid response
      return {
        message: "Account created successfully",
        user: {
          id: 0,
          email: credentials.email,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          role: 1,
          is_disabled: false,
          permissions_array: []
        },
        interests_selection_required: true
      };
    } catch (error) {
      console.error("AuthApi.signup: Error occurred:", error);
      
      const apiError = handleApiError(error as any);
      console.error("AuthApi.signup: API error:", apiError);
      
      throw new Error(apiError.message);
    }
  }

  /**
   * Save user interests (music genres and venue types)
   */
  static async saveInterests(data: SaveInterestsRequest): Promise<SaveInterestsResponse> {
    try {
      const response = await api.post(getAuthEndpoint("saveInterests"), data);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Resend email verification
   */
  static async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post(getAuthEndpoint("resendVerificationEmail"), { email });
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Verify email with code
   */
  static async verifyEmailByCode(data: VerifyEmailByCodeRequest): Promise<VerifyEmailByCodeResponse> {
    try {
      console.log("AuthApi.verifyEmailByCode: Calling API with:", data.email);
      const response = await api.post(getAuthEndpoint("verifyEmailByCode"), data);
      console.log("AuthApi.verifyEmailByCode: Response data:", response.data);
      return response.data;
    } catch (error) {
      console.error("AuthApi.verifyEmailByCode: Error occurred:", error);
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

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post(getAuthEndpoint("passwordReset"), { email });
      return response.data;
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
  saveInterests: AuthApi.saveInterests,
  resendVerificationEmail: AuthApi.resendVerificationEmail,
  verifyEmailByCode: AuthApi.verifyEmailByCode,
  logout: AuthApi.logout,
  getCurrentUser: AuthApi.getCurrentUser,
  refreshToken: AuthApi.refreshToken,
  sendPasswordResetEmail: AuthApi.sendPasswordResetEmail,
};
