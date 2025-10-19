// Mock authentication for frontend development
// This simulates API responses without needing a real backend

import type {
  LoginCredentials,
  LoginResponse,
  SignupCredentials,
  User,
} from "./authApi";

// Mock users database
const mockUsers: Array<User & { password: string }> = [
  {
    id: 1,
    email: "demo@beatit.com",
    first_name: "Demo",
    last_name: "User",
    password: "password123",
    role: 1,
    is_disabled: false,
    permissions_array: [],
  },
  {
    id: 2,
    email: "premium@beatit.com",
    first_name: "Premium",
    last_name: "User",
    password: "premium123",
    role: 2,
    is_disabled: false,
    permissions_array: [],
  },
  {
    id: 3,
    email: "admin@beatit.com",
    first_name: "Admin",
    last_name: "User",
    password: "admin123",
    role: 3,
    is_disabled: false,
    permissions_array: ["admin"],
  },
];

// Mock JWT token generator (just for demo)
const generateMockToken = (userId: number): string => {
  return `mock-jwt-token-${userId}-${Date.now()}`;
};

// Simulate API delay
const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock Auth API
export class MockAuthApi {
  /**
   * Mock login
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await simulateApiDelay(800); // Simulate network delay

    const user = mockUsers.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const { password, ...userWithoutPassword } = user;
    const token = generateMockToken(user.id);

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Mock signup
   */
  static async signup(credentials: SignupCredentials): Promise<LoginResponse> {
    await simulateApiDelay(1000);

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === credentials.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const newUser: User & { password: string } = {
      id: (mockUsers.length + 1),
      email: credentials.email,
      first_name: credentials.first_name,
      last_name: credentials.last_name,
      password: credentials.password,
      role: 1, // Default role
      is_disabled: false,
      permissions_array: []
    };

    mockUsers.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    const token = generateMockToken(newUser.id);

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Mock logout
   */
  static async logout(): Promise<void> {
    await simulateApiDelay(300);
    // In a real app, this would invalidate the token on the server
  }

  /**
   * Mock get current user
   */
  static async getCurrentUser(): Promise<User> {
    await simulateApiDelay(500);

    // For demo purposes, return the first user
    // In a real app, this would decode the JWT token
    const user = mockUsers[0];
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  /**
   * Mock refresh token
   */
  static async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; refreshToken?: string }> {
    await simulateApiDelay(400);

    // For demo, just generate a new token
    const newToken = generateMockToken(1);

    return {
      token: newToken,
      refreshToken: `refresh-${Date.now()}`,
    };
  }
}

// Export mock API
export const mockAuthApi = {
  login: MockAuthApi.login,
  signup: MockAuthApi.signup,
  logout: MockAuthApi.logout,
  getCurrentUser: MockAuthApi.getCurrentUser,
  refreshToken: MockAuthApi.refreshToken,
};

// Demo credentials for testing
export const DEMO_CREDENTIALS = {
  user: { email: "demo@beatit.com", password: "password123" },
  premium: { email: "premium@beatit.com", password: "premium123" },
  admin: { email: "admin@beatit.com", password: "admin123" },
};

