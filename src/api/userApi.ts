import type { User } from "./authApi";
import { api, handleApiError } from "./client";
import { getUserEndpoint } from "./config";

// Types
export interface UpdateUserData {
  name?: string;
  email?: string;
  // Add other updatable user fields as needed
}

export interface UserProfile extends User {
  createdAt: string;
  updatedAt: string;
  // Add other profile-specific fields
}

// User API service
export class UserApi {
  /**
   * Get user profile with additional details
   */
  static async getProfile(): Promise<UserProfile> {
    try {
      return await api.get(getUserEndpoint("profile"));
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateUserData): Promise<User> {
    try {
      return await api.put(getUserEndpoint("update"), data);
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }
}

// Convenience functions
export const userApi = {
  getProfile: UserApi.getProfile,
  updateProfile: UserApi.updateProfile,
};
