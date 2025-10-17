# Mock Authentication System

This document explains how to use the mock authentication system for frontend development.

## 🎯 Quick Start

The app is now configured to use **mock authentication** by default. You can log in immediately without needing a backend!

## 🔑 Demo Login Credentials

### Regular User

- **Email**: `demo@beatit.com`
- **Password**: `password123`
- **Role**: `user`

### Premium User

- **Email**: `premium@beatit.com`
- **Password**: `premium123`
- **Role**: `premium`

### Admin User

- **Email**: `admin@beatit.com`
- **Password**: `admin123`
- **Role**: `admin`

## 🚀 How to Login

1. **Open the app** - you'll see the login screen
2. **Tap any demo credential button** to auto-fill the form
3. **Tap "Sign In"** - you'll be logged in immediately!
4. **Explore the app** with different user roles

## 🔄 Switching to Real API

When you're ready to connect to a real backend:

1. **Open** `src/api/authApiSwitch.ts`
2. **Change** `USE_MOCK_API` from `true` to `false`
3. **Set** your `EXPO_PUBLIC_API_URL` environment variable
4. **That's it!** All API calls will now use your real backend

```typescript
// In src/api/authApiSwitch.ts
const USE_MOCK_API = false; // Switch to real API

// Set your API URL
EXPO_PUBLIC_API_URL=https://your-api.com/api
```

## 🎭 What the Mock System Does

- **Simulates API delays** (800ms-1000ms) for realistic feel
- **Generates mock JWT tokens** for authentication
- **Stores user data** in memory (resets on app restart)
- **Handles all auth flows**: login, signup, logout, user data
- **Supports different user roles** for testing

## 🧪 Testing Different Features

### Test User Roles

- **Regular User**: Access to Home and Explore tabs
- **Premium User**: Access to Premium tab with special features
- **Admin User**: Full access to all features

### Test Auth Flows

- **Login**: Use demo credentials
- **Signup**: Create new accounts (stored in memory)
- **Logout**: Clears session and returns to login
- **Session Persistence**: Login persists across app restarts

## 🔧 Customizing Mock Data

To add more demo users or modify existing ones:

1. **Open** `src/api/mockAuth.ts`
2. **Edit** the `mockUsers` array
3. **Add new users** with different roles
4. **Update** `DEMO_CREDENTIALS` if needed

```typescript
const mockUsers: Array<User & { password: string }> = [
  {
    id: "4",
    email: "artist@beatit.com",
    name: "Music Artist",
    password: "artist123",
    role: "artist", // New role!
  },
  // ... existing users
];
```

## 🎨 UI Features

- **Demo credential buttons** on login screen for easy testing
- **Role-based navigation** - different tabs based on user role
- **User profile display** showing name, email, and role
- **Logout functionality** with confirmation dialog

## 🚀 Next Steps

1. **Test the authentication flow** with different user roles
2. **Build your frontend features** using the mock system
3. **When ready**, switch to real API by changing one flag
4. **Deploy** with confidence knowing your auth system works!

The mock system gives you a fully functional authentication experience while you develop your frontend! 🎉

