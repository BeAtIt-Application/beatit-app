// Export all API services and utilities
export { AuthApi, authApi } from "./authApi";
export {
    api,
    clearTokens,
    getToken,
    handleApiError,
    setTokens
} from "./client";
export {
    API_CONFIG,
    getApiUrl,
    getAuthEndpoint,
    getUserEndpoint
} from "./config";
export { TaxonomyApi, taxonomyApi } from "./taxonomyApi";
export { UserApi, userApi } from "./userApi";

// Export types
export type {
    LoginCredentials,
    LoginResponse,
    SaveInterestsRequest,
    SaveInterestsResponse,
    SignupCredentials,
    SignupResponse,
    User
} from "./authApi";
export type { ApiError, RefreshTokenResponse } from "./client";
export type { Taxonomy } from "./taxonomyApi";
export type { UpdateUserData, UserProfile } from "./userApi";

