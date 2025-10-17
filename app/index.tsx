import { useUser } from "@/src/hooks/useUser";
import { hasSeenOnboarding, resetOnboarding } from "@/src/utils/onboarding";
import { router } from "expo-router";
import { useEffect } from "react";

export default function IndexScreen() {
  const { user, isAuthenticated, hydrateAuthState } = useUser();

  useEffect(() => {
    // Initialize auth state and redirect based on authentication and onboarding
    const initializeApp = async () => {
      try {
        await hydrateAuthState();
        await resetOnboarding();
        const hasSeenOnboardingScreen = await hasSeenOnboarding();

        if (isAuthenticated && user) {
          router.replace("/(tabs)");
        } else if (!hasSeenOnboardingScreen) {
          router.replace("/onboarding");
        } else {
          router.replace("/auth/login");
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      }
    };

    initializeApp();
  }, [hydrateAuthState, isAuthenticated, user]);

  return null;
}
