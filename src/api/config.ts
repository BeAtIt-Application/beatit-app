// API Configuration
export const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  endpoints: {
    auth: {
      login: "/auth/login",
      signup: "/auth/sign-up",
      saveInterests: "/auth/public/save-interests",
      resendVerificationEmail: "/auth/send-verification-code",
      verifyEmailByCode: "/auth/verify-email-by-code",
      logout: "/auth/logout",
      refresh: "/auth/refresh",
      passwordReset: "/auth/password/email",
      me: "/me/profile",
      updateProfile: "/me/profile",
      updatePassword: "/me/password",
    },
    user: {
      profile: "/user/profile",
      updateProfile: "/user/profile",
      updatePassword: "/user/password",
      uploadAvatar: "/user/avatar",
      updateInterests: "/user/update-interests",
    },
    userPublic: {
      artists: "/user/public/artists",
      organizations: "/user/public/organizations",
      detail: "/user/public",
    },
    event: {
      publicFilter: "/event/public/filter",
      publicGet: "/event/public/get",
      publicEventsNearUser: "/event/public/events-near-user",
      publicToggleStatus: "/event/public",
    },
    venue: {
      publicFilter: "/venue/public/filter",
      publicGet: "/venue/public/get",
      publicVenuesNearUser: "/venue/public/venues-near-user",
     
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

// Helper function to get event endpoints
export const getEventEndpoint = (
  endpoint: keyof typeof API_CONFIG.endpoints.event
): string => {
  return API_CONFIG.endpoints.event[endpoint];
};

// Helper function to get venue endpoints
export const getVenueEndpoint = (
  endpoint: keyof typeof API_CONFIG.endpoints.venue
): string => {
  return API_CONFIG.endpoints.venue[endpoint];
};

// Helper function to get user public endpoints
export const getUserPublicEndpoint = (
  endpoint: keyof typeof API_CONFIG.endpoints.userPublic
): string => {
  return API_CONFIG.endpoints.userPublic[endpoint];
};
