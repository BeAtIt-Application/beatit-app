import { CompactEventsHorizontalList } from "@/components/CompactEventsHorizontalList";
import { VenueDetails } from "@/components/VenueDetails";
import { useVenue } from "@/src/hooks/useVenues";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function VenueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const venueId = id ? parseInt(id) : null;
  
  const { venue, loading, error } = useVenue(venueId);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading venue details...</Text>
      </View>
    );
  }

  if (error || !venue) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">{error || 'Venue not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const upcomingEvents = [
    {
      id: 1,
      title: "Live Music Night",
      date: "Fri 15 Dec, 20:00",
      location: venue.name,
      image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tag: "Live Music",
    },
    {
      id: 2,
      title: "DJ Set Weekend",
      date: "Sat 16 Dec, 22:00",
      location: venue.name,
      image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tag: "DJ Set",
    },
    {
      id: 3,
      title: "Acoustic Session",
      date: "Sun 17 Dec, 19:00",
      location: venue.name,
      image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tag: "Acoustic",
    },
  ];

  return (
    <View className="flex-1">
      {/* Back Button Overlay */}
  

      <ScrollView className="flex-1">
        {/* Venue Details Component */}
        <VenueDetails venue={venue} />

        {/* Events Section */}
        <View className="px-5 py-6">
          <CompactEventsHorizontalList
            title="Upcoming Events"
            events={upcomingEvents}
            showSeeAll={false}
          />

          <CompactEventsHorizontalList
            title="Past Events"
            events={upcomingEvents}
            showSeeAll={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}
