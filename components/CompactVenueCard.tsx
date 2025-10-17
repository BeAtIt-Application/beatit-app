import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CompactVenueCardProps {
  venue: {
    id: number;
    name: string;
    venueType?: string;
    location: string;
    image: string;
    stars?: number;
    venueTypes?: string[];
  };
  onPress?: () => void;
}

export const CompactVenueCard: React.FC<CompactVenueCardProps> = ({
  venue,
  onPress,
}) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <IconSymbol key={i} name="star.fill" size={10} color="#FFD700" />
        );
      } else {
        stars.push(
          <IconSymbol key={i} name="star" size={10} color="#D1D5DB" />
        );
      }
    }
    
    return stars;
  };

  return (
    <TouchableOpacity onPress={onPress} className="mr-4" style={{ width: 300 }}>
      <View className="flex-row bg-white rounded-xl p-4 shadow-sm">
        <Image
          source={{ uri: venue.image }}
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
            {venue.name}
          </Text>
          {venue.stars !== undefined && (
            <View className="flex-row items-center gap-1 mb-1">
              {renderStars(venue.stars)}
              <Text className="text-xs text-gray-700 ml-1">
                {venue.stars.toFixed(1)}
              </Text>
            </View>
          )}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <IconSymbol name="location" size={12} color="#666" />
              <Text className="text-xs text-gray-600 ml-1">
                {venue.location}
              </Text>
            </View>
            {venue.venueTypes && venue.venueTypes.length > 0 && (
              <View className="bg-[#2FCC67] px-2 py-1 rounded-2xl">
                <Text className="text-xs text-white font-medium">
                  {venue.venueTypes[0]}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
