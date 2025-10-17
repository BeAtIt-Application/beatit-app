// API Configuration
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  endpoints: {
    auth: {
      login: "/auth/login",
      signup: "/auth/sign-up",
      logout: "/auth/logout",
      me: "/auth/me",
      refresh: "/auth/refresh",
    },
    user: {
      profile: "/user/profile",
      update: "/user/update",
    },
    venue: {
      publicAll: "/venue/public/draw?length=2&dir=asc",
      all: "/venue",
      create: "/venue",
      update: "/venue",
      delete: "/venue",
    },
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function to get auth endpoints
export const getAuthEndpoint = (
  endpoint: keyof typeof API_CONFIG.endpoints.auth
): string => {
  return API_CONFIG.endpoints.auth[endpoint];
};

// Helper function to get user endpoints
export const getUserEndpoint = (
  endpoint: keyof typeof API_CONFIG.endpoints.user
): string => {
  return API_CONFIG.endpoints.user[endpoint];
};

// Helper function to get venue endpoints
export const getVenueEndpoint = (
  endpoint: keyof typeof API_CONFIG.endpoints.venue
): string => {
  return API_CONFIG.endpoints.venue[endpoint];
};
