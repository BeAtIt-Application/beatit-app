// Switch between mock and real auth API
import type {
    LoginCredentials,
    LoginResponse,
    SaveInterestsRequest,
    SaveInterestsResponse,
    SignupCredentials,
    SignupResponse,
    User,
    VerifyEmailByCodeRequest,
    VerifyEmailByCodeResponse,
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

  async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    try {
      // Call the actual signup function
      const response = await authApiSwitch.signup(credentials);
      
      // If we get a LoginResponse with token (from mock), convert it to SignupResponse
      if (response && 'token' in response) {
        return {
          message: "Account created successfully. Please select your interests.",
          user: response.user,
          interests_selection_required: true
        };
      }
      
      // Otherwise, return the SignupResponse directly
      // Check if we have a valid response with the expected format
      if (!response) {
        throw new Error("Empty response from server");
      }
      
      // For SignupResponse, we need user and interests_selection_required
      if (!response.user) {
        // Try to adapt the response format if possible
        if (typeof response === 'object') {
          // Create a fallback user object if user is missing
          const fallbackUser = { 
            id: 0, 
            email: credentials.email, 
            first_name: credentials.first_name, 
            last_name: credentials.last_name, 
            role: 1, 
            is_disabled: false, 
            permissions_array: [] 
          };
          
          return {
            message: response.message || "Account created successfully",
            user: (response as any).data || fallbackUser,
            interests_selection_required: true
          };
        }
        throw new Error("Invalid response format: missing user data");
      }
      
      return response;
    } catch (error) {
      console.error("authApiSwitch: Signup error:", error);
      if (error instanceof Error) {
        console.error("authApiSwitch: Error message:", error.message);
        console.error("authApiSwitch: Error stack:", error.stack);
      }
      throw error;
    }
  },

  async saveInterests(data: SaveInterestsRequest): Promise<SaveInterestsResponse> {
    // If using real API, call it directly
    if (!USE_MOCK_API) {
      return await authApi.saveInterests(data);
    }
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      message: "Interests saved successfully. Registration complete.",
      // No email verification required in the simplified flow
    };
  },

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    // If using real API, call it directly
    if (!USE_MOCK_API) {
      return await authApi.resendVerificationEmail(email);
    }
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      message: "Verification email sent successfully",
    };
  },

  async verifyEmailByCode(data: VerifyEmailByCodeRequest): Promise<VerifyEmailByCodeResponse> {
    // If using real API, call it directly
    if (!USE_MOCK_API) {
      return await authApi.verifyEmailByCode(data);
    }
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For testing, accept code "123456" as valid
    const isValid = data.code === "123456";
    
    if (!isValid) {
      throw new Error("Invalid verification code");
    }
    
    return {
      message: "Email verified successfully! You can now log in.",
      user: {
        id: 1,
        email: data.email,
        first_name: "Test",
        last_name: "User",
        email_verified_at: new Date().toISOString(),
        role: 5,
        is_disabled: false,
        permissions_array: ["write_public", "read_events_public", "read_venues_public"]
      }
    };
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

  async sendPasswordResetEmail(email: string): Promise<{ message: string }> {
    return await authApiSwitch.sendPasswordResetEmail(email);
  },
};
