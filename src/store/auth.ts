import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import type { User } from "../api/authApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthActions {
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

// Constants
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Store
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  token: null,
  isLoading: true,

  // Actions
  login: async (user: User, token: string) => {
    try {
      // Store token securely
      await SecureStore.setItemAsync(TOKEN_KEY, token);

      // Store user data securely
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      // Update state
      set({ user, token, isLoading: false });
    } catch (error) {
      console.error("Error during login:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      // Remove stored data
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      // Clear state
      set({ user: null, token: null, isLoading: false });
    } catch (error) {
      console.error("Error during logout:", error);
      set({ isLoading: false });
      throw error;
    }
  },

  setUser: (user: User) => {
    try {
      // Update stored user data
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      // Update state
      set({ user });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      // Retrieve stored token and user
      const [storedToken, storedUser] = await Promise.all([
        SecureStore.getItemAsync(TOKEN_KEY),
        SecureStore.getItemAsync(USER_KEY),
      ]);

      if (storedToken && storedUser) {
        const user = JSON.parse(storedUser);
        set({ user, token: storedToken, isLoading: false });
      } else {
        // No stored credentials - user is not logged in
        set({ user: null, token: null, isLoading: false });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ user: null, token: null, isLoading: false });
    }
  },
}));

// Helper functions for external use
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const clearAuthData = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);

    // Also clear the store state
    useAuthStore.setState({ user: null, token: null, isLoading: false });
  } catch (error) {
    console.error("Error clearing auth data:", error);
    throw error;
  }
};

// Force logout function that clears everything
export const forceLogout = async (): Promise<void> => {
  try {
    const store = useAuthStore.getState();
    await store.logout();
  } catch (error) {
    console.error("Error during force logout:", error);
    // Even if logout fails, clear the state
    useAuthStore.setState({ user: null, token: null, isLoading: false });
  }
};
