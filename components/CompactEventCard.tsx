import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CompactEventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    image: string;
    tag: string;
  };
  onPress?: () => void;
}

export const CompactEventCard: React.FC<CompactEventCardProps> = ({
  event,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} className="mr-4" style={{ width: 300 }}>
      <View className="flex-row bg-white rounded-xl p-4 shadow-sm">
        <Image
          source={{ uri: event.image }}
          style={{
            width: 60,
            height: 80,
            borderRadius: 8,
            marginRight: 15,
          }}
          contentFit="cover"
        />
        <View className="flex-1 justify-center">
          <Text className="text-base font-semibold text-[#1A1A2E] mb-1">
            {event.title}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">{event.date}</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconSymbol name="location" size={12} color="#666" />
              <Text className="text-xs text-gray-600 ml-1">
                {event.location}
              </Text>
            </View>
            <View className="bg-[#761CBC] px-2 py-1 rounded-2xl">
              <Text className="text-xs text-white font-medium">
                {event.tag}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
