import { useCallback } from "react";
import type { LoginCredentials, SignupCredentials, SignupResponse, User } from "../api/authApi";
import { authApiWrapper } from "../api/authApiSwitch";
import { useAuthStore } from "../store/auth";

// Types are now imported from authApi

// API Configuration is now handled by the centralized client

// Custom hook for user authentication
export const useUser = () => {
  const { user, token, isLoading, login, logout, setUser, initializeAuth } =
    useAuthStore();

  // Login function that calls API and saves token securely
  const handleLogin = useCallback(
    async (credentials: LoginCredentials): Promise<void> => {
      try {
        const data = await authApiWrapper.login(credentials);

        // Save token and user data securely using the auth store
        await login(data.user, data.token);
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [login]
  );

  // Signup function that calls API (no auto-login in new flow)
  const handleSignup = useCallback(
    async (credentials: SignupCredentials): Promise<SignupResponse> => {
      try {
        console.log("useUser: Calling authApiWrapper.signup with:", credentials.email);
        const data = await authApiWrapper.signup(credentials);
        
        // New flow: user must complete interests selection and email verification
        // before they can login, so we don't auto-login here
        console.log("useUser: Signup successful, response:", data);
        
        if (!data || !data.user) {
          console.error("useUser: Invalid response format:", data);
          throw new Error("Invalid response from server");
        }
        
        return data;
      } catch (error) {
        console.error("useUser: Signup error details:", error);
        if (error instanceof Error) {
          console.error("useUser: Error message:", error.message);
          console.error("useUser: Error stack:", error.stack);
        }
        throw error;
      }
    },
    []
  );

  // Logout function that clears token and resets state
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      // Call logout endpoint if token exists (optional - for server-side session invalidation)
      if (token) {
        await authApiWrapper.logout();
      }

      // Clear token from secure store and reset state
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, [token, logout]);

  // Update user data
  const updateUser = useCallback(
    (userData: User): void => {
      setUser(userData);
    },
    [setUser]
  );

  // Hydrate auth state on app start
  const hydrateAuthState = useCallback(async (): Promise<void> => {
    try {
      await initializeAuth();

      // If we have a token, fetch fresh user data from /me endpoint
      if (token) {
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error hydrating auth state:", error);
      // Only clear auth state if it's an authentication error
      if (error instanceof Error && (error.message.includes("401") || error.message.includes("unauthorized"))) {
        await logout();
      }
    }
  }, [token, initializeAuth, logout]);

  // Fetch user data from /me endpoint
  const fetchUserData = useCallback(async (): Promise<User | null> => {
    if (!token) {
      return null;
    }

    try {
      const userData = await authApiWrapper.getCurrentUser();

      // Update user data in store
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);

      // If it's a 401 error, logout user
      if (error instanceof Error && error.message.includes("401")) {
        await logout();
        return null;
      }

      throw error;
    }
  }, [token, setUser, logout]);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    await fetchUserData();
  }, [fetchUserData]);

  return {
    // State
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,

    // Actions
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    setUser: updateUser,
    refreshUser,
    hydrateAuthState,
    fetchUserData,
  };
};

// Helper function to initialize auth state on app start (standalone, not a hook)
export const initializeAppAuth = async (): Promise<void> => {
  try {
    // Get the store state directly
    const state = useAuthStore.getState();

    // Initialize auth state from secure store
    await state.initializeAuth();

    // If we have a token, fetch fresh user data
    const currentState = useAuthStore.getState();
    if (currentState.token) {
      // Create a temporary fetch function for user data
      const fetchUserData = async (): Promise<void> => {
        try {
          const userData = await authApiWrapper.getCurrentUser();
          currentState.setUser(userData);
        } catch (error) {
          console.error(
            "Error fetching user data during initialization:",
            error
          );

          // If it's a 401 error, logout user
          if (error instanceof Error && error.message.includes("401")) {
            await currentState.logout();
          }
        }
      };

      await fetchUserData();
    }
  } catch (error) {
    console.error("Error initializing app auth:", error);
    // Only clear auth state if it's an authentication error
    if (error instanceof Error && (error.message.includes("401") || error.message.includes("unauthorized"))) {
      const state = useAuthStore.getState();
      await state.logout();
    }
  }
};

// Export types for external use
export type {
  LoginCredentials,
  LoginResponse,
  SignupCredentials,
  SignupResponse,
  User
} from "../api/authApi";

