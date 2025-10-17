# Authentication System

This document describes the authentication system implemented in the BeatIt app.

## Features

### 🔐 Authentication Flow

- **Login Screen**: Email/password authentication with modern UI
- **Signup Screen**: User registration with validation
- **Protected Routes**: Automatic redirection based on authentication state
- **Role-based Access**: Different user types can access different features

### 🛡️ Security

- **Secure Token Storage**: Uses Expo SecureStore for token persistence
- **Automatic Token Refresh**: Fetches fresh user data on app startup
- **Logout Functionality**: Clears all stored authentication data

### 👤 User Management

- **User Roles**: Support for different user types (user, premium, admin)
- **Profile Information**: Display user name, email, and role
- **Session Management**: Persistent login across app restarts

## File Structure

```
app/
├── auth/
│   ├── _layout.tsx          # Auth stack navigation
│   ├── login.tsx           # Login screen
│   └── signup.tsx          # Signup screen
├── (tabs)/
│   ├── _layout.tsx         # Tab navigation with logout
│   ├── index.tsx          # Home screen (shows user info)
│   ├── explore.tsx        # Explore screen
│   └── premium.tsx        # Premium features (role-protected)
├── _layout.tsx            # Root layout with auth initialization
└── index.tsx              # Initial screen with auth routing

src/
├── api/
│   ├── index.ts           # API exports
│   ├── client.ts          # Axios client with interceptors
│   ├── config.ts          # API configuration
│   ├── authApi.ts         # Authentication API service
│   └── userApi.ts         # User API service
├── hooks/
│   └── useUser.ts         # Authentication hook
└── store/
    └── auth.ts            # Zustand auth store

components/
└── ProtectedRoute.tsx     # Route protection wrapper
```

## API Endpoints

The authentication system expects these API endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user data
- `POST /api/auth/logout` - User logout

## User Roles

- **user**: Basic access to home and explore screens
- **premium**: Access to premium features and content
- **admin**: Full administrative access

## Usage Examples

### Using the Authentication Hook

```typescript
import { useUser } from '@/src/hooks/useUser';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useUser();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <WelcomeScreen user={user} />;
}
```

### Protecting Routes

```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

function PremiumScreen() {
  return (
    <ProtectedRoute requiredRole="premium">
      <PremiumContent />
    </ProtectedRoute>
  );
}
```

### Manual Authentication

```typescript
// Login
await login({ email: "user@example.com", password: "password" });

// Signup
await signup({
  name: "John Doe",
  email: "john@example.com",
  password: "password",
});

// Logout
await logout();
```

## Configuration

Set your API base URL in environment variables:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

The API configuration is centralized in `src/api/config.ts` and automatically used by all API services.

## API Services

### Centralized API Client

- **Axios Instance**: Pre-configured with base URL, timeout, and headers
- **Request Interceptors**: Automatically attach JWT tokens
- **Response Interceptors**: Handle token refresh and error management
- **Error Handling**: Consistent error formatting across all API calls

### Auth API Service

```typescript
import { authApi } from "@/src/api/authApi";

// Login
const response = await authApi.login({ email, password });

// Signup
const response = await authApi.signup({ name, email, password });

// Get current user
const user = await authApi.getCurrentUser();

// Logout
await authApi.logout();
```

### User API Service

```typescript
import { userApi } from "@/src/api/userApi";

// Get user profile
const profile = await userApi.getProfile();

// Update profile
const updatedUser = await userApi.updateProfile({ name: "New Name" });
```

## Security Notes

- Tokens are stored securely using Expo SecureStore
- Automatic logout on token expiration (401 responses)
- All authentication state is managed through Zustand store
- Protected routes automatically redirect unauthenticated users
