// Export all API services and utilities
export { AuthApi, authApi } from "./authApi";
export {
    api,
    getToken,
    handleApiError,
    setTokens
} from "./client";
export {
    API_CONFIG,
    getApiUrl,
    getAuthEndpoint,
    getEventEndpoint,
    getUserEndpoint,
    getVenueEndpoint
} from "./config";
export { EventApi, eventApi } from "./eventApi";
export { TaxonomyApi, taxonomyApi } from "./taxonomyApi";
export { UserApi, userApi } from "./userApi";
export { VenueApi, venueApi } from "./venueApi";

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
export type { Event, EventFilterParams, EventResponse, EventToggleStatusResponse } from "./eventApi";
export type { Taxonomy } from "./taxonomyApi";
export type { Artist, MusicGenre, Organization, PublicUser, UserFilterParams, UserListResponse, UserPagination, VenueType } from "./userApi";
export type { RateVenueRequest, RateVenueResponse, Venue, VenueFilterParams, VenueRatingInfo, VenueResponse } from "./venueApi";

