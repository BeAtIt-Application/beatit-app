# API Usage Examples

This document shows how to use the centralized API services in your BeatIt app.

## Environment Setup

First, set your API base URL in your environment:

```bash
# .env or .env.local
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## Basic Usage

### Using Auth API Service

```typescript
import { authApi } from "@/src/api/authApi";

// In a component or service
const handleLogin = async () => {
  try {
    const response = await authApi.login({
      email: "user@example.com",
      password: "password123",
    });

    // response contains { user, token }
    console.log("Logged in user:", response.user);
  } catch (error) {
    console.error("Login failed:", error.message);
  }
};
```

### Using User API Service

```typescript
import { userApi } from "@/src/api/userApi";

// Get user profile
const fetchProfile = async () => {
  try {
    const profile = await userApi.getProfile();
    console.log("User profile:", profile);
  } catch (error) {
    console.error("Failed to fetch profile:", error.message);
  }
};

// Update user profile
const updateProfile = async () => {
  try {
    const updatedUser = await userApi.updateProfile({
      name: "New Name",
      email: "newemail@example.com",
    });
    console.log("Updated user:", updatedUser);
  } catch (error) {
    console.error("Failed to update profile:", error.message);
  }
};
```

### Using the Raw API Client

```typescript
import { api } from "@/src/api/client";

// Make custom API calls
const fetchCustomData = async () => {
  try {
    const data = await api.get("/custom/endpoint");
    return data;
  } catch (error) {
    console.error("API call failed:", error);
  }
};
```

## Using API Configuration

```typescript
import { API_CONFIG, getApiUrl, getAuthEndpoint } from "@/src/api/config";

// Get the base URL
console.log("API Base URL:", API_CONFIG.baseURL);

// Get full URL for an endpoint
const loginUrl = getApiUrl("/auth/login");
console.log("Login URL:", loginUrl);

// Get auth endpoint
const meEndpoint = getAuthEndpoint("me");
console.log("Me endpoint:", meEndpoint);
```

## Error Handling

All API services use consistent error handling:

```typescript
import { authApi } from "@/src/api/authApi";

const handleApiCall = async () => {
  try {
    const result = await authApi.login(credentials);
    // Success
  } catch (error) {
    // Error is already formatted by handleApiError
    if (error.message.includes("401")) {
      // Handle unauthorized
    } else if (error.message.includes("Network")) {
      // Handle network error
    } else {
      // Handle other errors
    }
  }
};
```

## Type Safety

All API services are fully typed:

```typescript
import type { User, LoginCredentials, LoginResponse } from "@/src/api/authApi";

const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  return await authApi.login(credentials);
};

const processUser = (user: User) => {
  console.log(`User ${user.name} has role ${user.role}`);
};
```

## Adding New API Endpoints

To add new API endpoints:

1. **Add to config.ts**:

```typescript
export const API_CONFIG = {
  // ... existing config
  endpoints: {
    // ... existing endpoints
    music: {
      tracks: "/music/tracks",
      playlists: "/music/playlists",
    },
  },
} as const;
```

2. **Create API service**:

```typescript
// src/api/musicApi.ts
import { api, handleApiError } from "./client";
import { API_CONFIG } from "./config";

export class MusicApi {
  static async getTracks(): Promise<Track[]> {
    try {
      return await api.get(API_CONFIG.endpoints.music.tracks);
    } catch (error) {
      const apiError = handleApiError(error as any);
      throw new Error(apiError.message);
    }
  }
}

export const musicApi = { getTracks: MusicApi.getTracks };
```

3. **Export from index.ts**:

```typescript
export { MusicApi, musicApi } from "./musicApi";
export type { Track } from "./musicApi";
```

## Benefits of This Architecture

- **Centralized Configuration**: Single source of truth for API URLs
- **Consistent Error Handling**: All API calls use the same error format
- **Automatic Token Management**: JWT tokens are automatically attached and refreshed
- **Type Safety**: Full TypeScript support with proper interfaces
- **Easy Testing**: Services can be easily mocked for testing
- **Scalable**: Easy to add new API services and endpoints
