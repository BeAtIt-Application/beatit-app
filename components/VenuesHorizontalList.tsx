import { VenueCard } from "@/components/VenueCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Venue {
  id: number;
  name: string;
  city: string;
  image: string;
  banner?: {
    id: number;
    url: string;
    srcset: string;
    webp: string[];
  };
  stars?: number;
  venueTypes?: string[];
}

interface VenuesHorizontalListProps {
  title: string;
  venues: Venue[];
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export function VenuesHorizontalList({ 
  title, 
  venues, 
  onSeeAll,
  showSeeAll = true 
}: VenuesHorizontalListProps) {
  return (
    <View>
      <View className="flex-row justify-between items-center px-5 mb-4">
        <Text className="text-xl font-bold text-[#1A1A2E]">
          {title}
        </Text>
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
        <View className="flex-row gap-2 items-center">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onPress={() => router.push(`/venue-detail?id=${venue.id}`)}
              fromHorizontalList={true}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

