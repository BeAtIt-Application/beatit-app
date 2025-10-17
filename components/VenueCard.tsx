import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface VenueCardProps {
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
  fromHorizontalList?: boolean;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onPress, fromHorizontalList }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <IconSymbol key={i} name="star.fill" size={14} color="#FFD700" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <IconSymbol key={i} name="star.leadinghalf.filled" size={14} color="#FFD700" />
        );
      } else {
        // Empty star
        stars.push(
          <IconSymbol key={i} name="star" size={14} color="#D1D5DB" />
        );
      }
    }
    
    return stars;
  };

  return (
    <TouchableOpacity onPress={onPress} className={"mb-4 " + (fromHorizontalList ? "max-w-[310] w-[310] mr-4" : "max-w-full w-full")}>
      <View className="bg-white rounded-2xl shadow-sm">
        {/* Venue Image */}
        <View className="relative">
          <Image
            source={{ uri: venue.image }}
            style={{ width: "100%", height: 200, borderTopRightRadius: 16, borderTopLeftRadius: 16 }}
            contentFit="cover"
          />
          <TouchableOpacity className="absolute top-2.5 right-2.5 bg-white/90 p-2 rounded-full">
            <IconSymbol name="heart" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Venue Details */}
        <View className="p-4">
          <Text className="text-base font-bold text-[#1A1A2E] mb-2 leading-5 text-lg">
            {venue.name}
          </Text>
          {venue.venueType && (
            <Text className="text-md text-gray-600 mb-1">{venue.venueType}</Text>
          )}
          {venue.stars !== undefined && (
            <View className="flex-row items-center gap-1 mb-1">
              {renderStars(venue.stars)}
              <Text className="text-sm font-semibold text-gray-700 ml-1">
                {venue.stars.toFixed(1)}
              </Text>
            </View>
          )}
          <View className="flex-row items-center mb-3">
            <IconSymbol name="location" size={14} color="#666" />
            <Text className="text-md text-gray-600 ml-1">{venue.location}</Text>
          </View>
          {venue.venueTypes && (
            <View className="flex-row gap-2">
              {venue.venueTypes.map((type, index) => (
                <View key={index} className="bg-[#2FCC67] px-2 py-1 rounded-2xl">
                  <Text className="text-xs text-white font-medium">{type}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
