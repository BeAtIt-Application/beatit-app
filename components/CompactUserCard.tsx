import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CompactUserCardProps {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    artist_tag?: string;
    city_from?: string;
    country_from?: string;
    avatar_url?: string;
    avatar_thumbnail?: string;
    role?: string;
  };
  onPress?: () => void;
}

export const CompactUserCard: React.FC<CompactUserCardProps> = ({
  user,
  onPress,
}) => {
  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const location = [user.city_from, user.country_from].filter(Boolean).join(', ');
  const avatarUrl = user.avatar_thumbnail || user.avatar_url || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="mr-4" style={{ width: 300 }}>
      <View className="flex-row bg-white rounded-xl p-4 shadow-sm">
        <Image
          source={{ uri: avatarUrl }}
          style={{
            width: 60,
            height: 80,
            borderRadius: 8,
            marginRight: 15,
          }}
          contentFit="cover"
        />
        <View className="flex-1 justify-center">
          <Text className="text-base font-semibold text-[#1A1A2E]">
            {fullName}
          </Text>
          {user.artist_tag && (
            <Text className="text-sm text-gray-600 mb-1">{user.artist_tag}</Text>
          )}
          <View className="flex-column items-start">
            {location && (
              <View className="flex-row items-center mb-1">
                <IconSymbol name="location" size={12} color="#666" />
                <Text className="text-xs text-gray-600">
                  {location}
                </Text>
              </View>
            )}
            {user.role && (
              <View className="bg-[#761CBC] px-2 py-1 rounded-2xl">
                <Text className="text-xs text-white font-medium">
                  {user.role !== "3" ? "Artist" : "Organization"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

