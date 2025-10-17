// Switch between mock and real auth API
import type {
  LoginCredentials,
  LoginResponse,
  SignupCredentials,
  User,
} from "./authApi";
import { authApi } from "./authApi";
import { mockAuthApi } from "./mockAuth";

// Set to true to use mock API, false to use real API
const USE_MOCK_API = false; // Using mock API for demo

// Export the appropriate API based on the switch
export const authApiSwitch = USE_MOCK_API ? mockAuthApi : authApi;

// Export demo credentials for easy testing
export { DEMO_CREDENTIALS } from "./mockAuth";

// Type-safe wrapper that works with both APIs
export const authApiWrapper = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return await authApiSwitch.login(credentials);
  },

  async signup(credentials: SignupCredentials): Promise<LoginResponse> {
    return await authApiSwitch.signup(credentials);
  },

  async logout(): Promise<void> {
    return await authApiSwitch.logout();
  },

  async getCurrentUser(): Promise<User> {
    return await authApiSwitch.getCurrentUser();
  },

  async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; refreshToken?: string }> {
    return await authApiSwitch.refreshToken(refreshToken);
  },
};
