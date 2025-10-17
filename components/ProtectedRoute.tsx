import { useUser } from "@/src/hooks/useUser";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackRoute?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallbackRoute = "/auth/login",
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated, hydrateAuthState } = useUser();

  useEffect(() => {
    // Initialize auth state when component mounts
    hydrateAuthState();
  }, [hydrateAuthState]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    router.replace(fallbackRoute as any); // Type assertion needed due to router type constraints
    return null;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && user.role !== requiredRole) {
    // You can customize this behavior - redirect to unauthorized page or show error
    router.replace("/(tabs)"); // For now, redirect to main app
    return null;
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
});
