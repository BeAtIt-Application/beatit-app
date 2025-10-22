import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date?: string; // Keep for backward compatibility
    event_start?: string; // Actual API field
    location: string;
    venueName?: string;
    city?: string;
    image: string;
    tags: string[];
  };
  onPress?: () => void;
  fromHorizontalList?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress, fromHorizontalList }) => {
  const handleHeartPress = (e: any) => {
    e.stopPropagation();
    // Handle heart press logic here
  };

  // Format event date to extract day and month
  const formatEventDate = (dateString: string) => {
    try {
      if (!dateString) return { day: '--', month: '---' };
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return { day: '--', month: '---' };
      
      const day = date.getDate().toString();
      const month = date.toLocaleDateString('en-US', { month: 'short' }); // Max 3 letters
      
      return { day, month };
    } catch (error) {
      console.log('Error formatting date:', error);
      return { day: '--', month: '---' };
    }
  };

  const { day, month } = formatEventDate(event.event_start || event.date || '');

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      className={"mb-4 " + (fromHorizontalList ? "max-w-[310] w-[310] mr-4" : "max-w-full w-full")}
    >
      <View className="bg-white rounded-2xl">
        {/* Event Image */}
        <View className="relative">
          <Image
            source={{ uri: event.image }}
            style={{ width: "100%", height: 200, borderTopRightRadius: 16, borderTopLeftRadius: 16 }}
            contentFit="cover"
          />
          <View className="absolute top-3 left-3 bg-black/70 px-3 py-2 rounded-md">
            <Text className="text-white text-sm font-semibold text-center">{day}</Text>
            <Text className="text-white text-sm font-semibold">{month}</Text>
          </View>
        </View>

        {/* Event Details */}
        <View className="p-4">
          <Text className="text-base font-bold text-[#1A1A2E] mb-2 leading-5 text-lg">
            {event.title}
          </Text>
          <Text className="text-md text-gray-600 mb-1">{event.date}</Text>
          <View className="flex-row items-center mb-3">
            <IconSymbol name="location" size={14} color="#666" />
            <View className="flex-row items-center ml-1">
              {event.venueName ? (
                <>
                  <Text className="text-md text-[#2FCC67] font-medium">{event.venueName}</Text>
                  <Text className="text-md text-gray-600">, {event.city}</Text>
                </>
              ) : (
                <Text className="text-md text-gray-600">{event.location}</Text>
              )}
            </View>
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
