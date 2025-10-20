import { IconSymbol } from "@/components/ui/icon-symbol";
import { useUser } from "@/src/hooks/useUser";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
            router.replace("/auth/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleEmail = () => {
    if (user?.email) {
      Linking.openURL(`mailto:${user.email}`);
    }
  };

  const avatarUrl = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header with Avatar */}
      <View className="relative bg-[#5271FF]" style={{ height: 200 }}>
        {/* Avatar */}
        <View className="absolute -bottom-16 left-0 right-0 items-center">
          <View className="bg-white rounded-full p-2 shadow-lg">
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
              contentFit="cover"
            />
          </View>
        </View>
      </View>

      {/* User Info */}
      <View className="mt-20 px-5">
        <Text className="text-3xl font-bold text-center text-[#1A1A2E] mb-2">
          {user.first_name} {user.last_name}
        </Text>

        {/* Contact Info */}
        <View className="mb-6 mt-8">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Contact Information
          </Text>
          
          <View className="bg-gray-50 rounded-xl p-4">
            {user.email && (
              <TouchableOpacity
                onPress={handleEmail}
                className="flex-row items-center mb-3"
              >
                <IconSymbol name="envelope" size={20} color="#761CBC" />
                <Text className="text-brand-purple ml-3 text-base">
                  {user.email}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Actions
          </Text>

          <TouchableOpacity
            onPress={() => Alert.alert("Edit Profile", "Edit profile feature coming soon!")}
            className="bg-gray-200 px-6 py-4 rounded-xl flex-row items-center mb-3"
          >
            <IconSymbol name="pencil" size={24} color="#666" />
            <Text className="text-gray-700 font-semibold text-lg ml-3">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Language", "Language settings coming soon!")}
            className="bg-gray-200 px-6 py-4 rounded-xl flex-row items-center mb-3"
          >
            <IconSymbol name="globe" size={24} color="#666" />
            <Text className="text-gray-700 font-semibold text-lg ml-3">
              Language
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 px-6 py-4 rounded-xl flex-row items-center"
          >
            <IconSymbol name="arrow.right.square" size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-3">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
