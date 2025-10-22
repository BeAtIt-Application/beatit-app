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

  // Transform API events to match CompactEvent interface
  const transformEvent = (event: any) => {
    const eventDate = new Date(event.event_start);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return {
      id: event.id,
      title: event.name,
      date: formattedDate,
      location: event.venue_name,
      image: event.image || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tag: event.music_genres?.[0] || "Event",
    };
  };

  const upcomingEvents = (venue as any).upcoming_events?.map(transformEvent) || [];
  const pastEvents = (venue as any).past_events?.map(transformEvent) || [];

  return (
    <View className="flex-1">
      {/* Back Button Overlay */}
  

      <ScrollView className="flex-1">
        {/* Venue Details Component */}
        <VenueDetails venue={venue} />

        {/* Events Section */}
        {upcomingEvents.length > 0 && (
          <CompactEventsHorizontalList
            title="Upcoming Events"
            events={upcomingEvents}
            showSeeAll={false}
          />
        )}

        {pastEvents.length > 0 && (
          <CompactEventsHorizontalList
            title="Past Events"
            events={pastEvents}
            showSeeAll={false}
          />
        )}
      </ScrollView>
    </View>
  );
}
