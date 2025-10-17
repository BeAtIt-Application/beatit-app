import { IconSymbol } from "@/components/ui/icon-symbol";
import { useUser } from "@/src/hooks/useUser";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useUser();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            // Navigate to login screen after successful logout
            router.replace("/auth/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-16">
        <View className="flex-1 justify-center items-center py-20">
          <IconSymbol name="person.circle" size={80} color="#3AB795" />
          <Text className="text-2xl font-bold mt-4 mb-2 text-[#1A1A2E]">
            Profile
          </Text>
          <Text className="text-base opacity-70 text-center mb-8 text-[#1A1A2E]">
            {user ? `Welcome, ${user.name}!` : "Your profile information"}
          </Text>

          {user && (
            <View className="w-full max-w-sm">
              <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-sm text-gray-600">Name</Text>
                <Text className="text-lg font-semibold text-[#1A1A2E]">
                  {user.name}
                </Text>
              </View>
              <View className="bg-gray-100 rounded-xl p-4 mb-4">
                <Text className="text-sm text-gray-600">Email</Text>
                <Text className="text-lg font-semibold text-[#1A1A2E]">
                  {user.email}
                </Text>
              </View>
              <View className="bg-gray-100 rounded-xl p-4 mb-8">
                <Text className="text-sm text-gray-600">Role</Text>
                <Text className="text-lg font-semibold capitalize text-[#1A1A2E]">
                  {user.role}
                </Text>
              </View>
            </View>
          )}

          <View className="w-full max-w-sm space-y-4">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-500 px-8 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            >
              <IconSymbol name="arrow.right.square" size={20} color="white" />
              <Text className="text-white font-semibold text-lg">Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert("Settings", "Settings feature coming soon!")
              }
              className="bg-gray-200 px-8 py-4 rounded-xl flex-row items-center justify-center space-x-2"
            >
              <IconSymbol name="gear" size={20} color="#666" />
              <Text className="text-gray-700 font-semibold text-lg">
                Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
