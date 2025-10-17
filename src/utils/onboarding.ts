import { Storage } from "expo-storage";

const ONBOARDING_KEY = "hasSeenOnboarding";

/**
 * Check if the user has seen the onboarding screen
 */
export const hasSeenOnboarding = async (): Promise<boolean> => {
  try {
    const value = await Storage.getItem({ key: ONBOARDING_KEY });
    return value === "true";
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};

/**
 * Mark onboarding as seen
 */
export const markOnboardingAsSeen = async (): Promise<void> => {
  try {
    await Storage.setItem({ key: ONBOARDING_KEY, value: "true" });
  } catch (error) {
    console.error("Error marking onboarding as seen:", error);
  }
};

/**
 * Reset onboarding status (for testing or logout)
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await Storage.removeItem({ key: ONBOARDING_KEY });
  } catch (error) {
    console.error("Error resetting onboarding status:", error);
  }
};
