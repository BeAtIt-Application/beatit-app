import { useUser } from "@/src/hooks/useUser";
import { useAuthStore } from "@/src/store/auth";
import { hasSeenOnboarding } from "@/src/utils/onboarding";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function IndexScreen() {
  const { user, isAuthenticated, hydrateAuthState } = useUser();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth state and redirect based on authentication and onboarding
    const initializeApp = async () => {
      try {
        await hydrateAuthState();
        const hasSeenOnboardingScreen = await hasSeenOnboarding();
        // Get the current state after hydration
        const { user: currentUser, token: currentToken } = useAuthStore.getState();
        const currentAuth = !!currentUser && !!currentToken;
        
        if (currentAuth && currentUser) {
          router.replace("/(tabs)");
        } else if (!hasSeenOnboardingScreen) {
          router.replace("/onboarding");
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        // Fallback to login on error
        router.replace("/auth/login");
      } finally {
        setIsInitialized(true);
      }
    };

    initializeApp();
  }, []); // Remove dependencies to prevent re-running

  // Don't render anything until initialization is complete
  if (!isInitialized) {
    return null;
  }

  return null;
}
