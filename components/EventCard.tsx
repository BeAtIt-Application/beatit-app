import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    location: string;
    image: string;
    tags: string[];
  };
  onPress?: () => void;
  fromHorizontalList?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, fromHorizontalList }) => {
  return (
    <TouchableOpacity onPress={onPress} className={"mb-4 " + (fromHorizontalList ? "max-w-[310] w-[310] mr-4" : "max-w-full w-full")}>
      <View className="bg-white rounded-2xl">
        {/* Event Image */}
        <View className="relative">
          <Image
            source={{ uri: event.image }}
            style={{ width: "100%", height: 200, borderTopRightRadius: 16, borderTopLeftRadius: 16 }}
            contentFit="cover"
          />
          <View className="absolute top-3 left-3 bg-black/70 px-3 py-2 rounded-md">
            <Text className="text-white text-sm font-semibold text-center">12</Text>
            <Text className="text-white text-sm font-semibold">May</Text>
          </View>
          <TouchableOpacity className="absolute top-2.5 right-2.5 bg-white/90 p-2 rounded-full">
            <IconSymbol name="heart" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Event Details */}
        <View className="p-4">
          <Text className="text-base font-bold text-[#1A1A2E] mb-2 leading-5 text-lg">
            {event.title}
          </Text>
          <Text className="text-md text-gray-600 mb-1">{event.date}</Text>
          <View className="flex-row items-center mb-3">
            <IconSymbol name="location" size={14} color="#666" />
            <Text className="text-md text-gray-600 ml-1">{event.location}</Text>
          </View>
          <View className="flex-row gap-2">
            {event.tags.map((tag, index) => (
              <View key={index} className="bg-[#761CBC] px-2 py-1 rounded-2xl">
                <Text className="text-xs text-white font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
