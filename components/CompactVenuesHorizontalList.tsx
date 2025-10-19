import { CompactVenueCard } from "@/components/CompactVenueCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface CompactVenue {
  id: number;
  name: string;
  venueType?: string;
  location: string;
  image: string;
  stars?: number;
  venueTypes?: string[];
}

interface CompactVenuesHorizontalListProps {
  title: string;
  venues: CompactVenue[];
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export function CompactVenuesHorizontalList({
  title,
  venues,
  onSeeAll,
  showSeeAll = true,
}: CompactVenuesHorizontalListProps) {
  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center px-5 mb-4">
        <Text className="text-xl font-bold text-[#1A1A2E]">{title}</Text>
        {showSeeAll && (
          <TouchableOpacity onPress={onSeeAll} activeOpacity={0.7}>
            <Text className="text-brand-blue font-semibold">See all</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <View className="flex-row gap-2.5 items-center">
          {venues.map((venue) => (
            <CompactVenueCard
              key={venue.id}
              venue={venue}
              onPress={() => router.push("/venue-detail")}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

