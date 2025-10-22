import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../store/auth";

// Constants
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Types
interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const baseURL =
    process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Flag to prevent multiple simultaneous refresh attempts
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  // Process failed requests queue
  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    failedQueue = [];
  };

  // Request interceptor to attach JWT token
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error getting token for request:", error);
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling and token refresh
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 errors
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue the request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Attempt to refresh token
          const refreshToken =
            await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

          if (!refreshToken) {
            // No refresh token, logout user
            await handleLogout();
            return Promise.reject(error);
          }

          const response = await axios.post<RefreshTokenResponse>(
            `${baseURL}/auth/refresh`,
            { refreshToken },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { token: newToken, refreshToken: newRefreshToken } =
            response.data;

          // Store new tokens
          await SecureStore.setItemAsync(TOKEN_KEY, newToken);
          if (newRefreshToken) {
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
          }

          // Update auth store
          const authStore = useAuthStore.getState();
          if (authStore.user) {
            await authStore.login(authStore.user, newToken);
          }

          // Process queued requests
          processQueue(null, newToken);

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          processQueue(refreshError, null);
          await handleLogout();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Handle other errors
      return Promise.reject(error);
    }
  );

  return api;
};

// Logout handler
const handleLogout = async (): Promise<void> => {
  try {
    // Clear tokens from secure store
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);

    // Clear auth store
    const authStore = useAuthStore.getState();
    await authStore.logout();
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// Create and export the API instance
export const api = createApiClient();

// Helper functions for token management
export const setTokens = async (
  token: string,
  refreshToken?: string
): Promise<void> => {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    console.error("Error setting tokens:", error);
    throw error;
  }
};

// Removed clearTokens - use authStore.logout() instead

export const getToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Error handler utility
export const handleApiError = (error: AxiosError): ApiError => {
  
  if (error.response) {
    // Server responded with error status
    
    let errorMessage = "An error occurred";
    
    // Try to extract message from various response formats
    if (typeof error.response.data === 'object' && error.response.data !== null) {
      const data = error.response.data as any;
      errorMessage = data.message || data.error || data.error_message || 
                    (typeof data.errors === 'object' ? JSON.stringify(data.errors) : null) ||
                    "Server error: " + error.response.status;
      
      // For verification code errors, include expiration time in the message
      if (data.message && data.message.includes("verification code has already been sent") && data.code_expires_in_minutes) {
        errorMessage = `${data.message} The code expires in ${data.code_expires_in_minutes} minutes.`;
      }
    }
    
    return {
      message: errorMessage,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: "Network error. Please check your connection.",
      status: 0,
    };
  } else {
    // Something else happened
    return {
      message: error.message || "An unexpected error occurred",
    };
  }
};

// Export types
export type { ApiError, RefreshTokenResponse };

