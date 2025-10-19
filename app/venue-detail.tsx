import { CompactEventsHorizontalList } from "@/components/CompactEventsHorizontalList";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useVenue } from "@/src/hooks/useVenues";
import { Image } from "expo-image";
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
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
      tag: "Live Music",
    },
    {
      id: 2,
      title: "DJ Set Weekend",
      date: "Sat 16 Dec, 22:00",
      location: venue.name,
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop",
      tag: "DJ Set",
    },
    {
      id: 3,
      title: "Acoustic Session",
      date: "Sun 17 Dec, 19:00",
      location: venue.name,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      tag: "Acoustic",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-[linear-gradient(180deg,#6932D4_0%,#3F6AE9_100%)]">
      {/* Hero Image with Back Button */}
      <View className="relative">
        <Image
          source={{
            uri: venue.images?.[0] || venue.logo?.[0] || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
          }}
          style={{ width: "100%", height: 300 }}
          contentFit="cover"
        />

        {/* Back Button Overlay */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-5 w-10 h-10 bg-white rounded-full justify-center items-center shadow-lg"
        >
          <IconSymbol name="chevron.left" size={20} color="black" />
        </TouchableOpacity>

        {/* Venue Info Card Overlay */}
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
          <Text className="text-3xl font-bold text-[#22954B] mb-2">
            {venue.name}
          </Text>
          <Text className="text-lg text-gray-800 mb-2">{venue.type || 'Venue'}</Text>
          <View className="flex-row items-center">
            <IconSymbol name="location" size={16} color="#666" />
            <Text className="text-gray-500 ml-1">{venue.address || venue.name}, {venue.city}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="pt-6">
        {/* Description Section */}
        <View className="mb-6 px-5">
          <Text className="text-xl font-bold text-[#22954B] mb-3">
            About {venue.name}
          </Text>
          <Text className="text-gray-600 leading-6">
            {venue.bio || 'No description available for this venue.'}
          </Text>
        </View>

        {/* Location Section */}
        <View className="px-5 mb-6">
          <Text className="text-xl font-bold text-[#22954B] mb-3">
            Location
          </Text>
          <TouchableOpacity>
            <Text className="text-[#22954B] text-lg underline">
              (MAP?) {venue.address}, {venue.city}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Venue Details Section */}
        {/* <View className="px-5 mb-6">
          <Text className="text-xl font-bold text-[#22954B] mb-3">
            Venue Details
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-gray-600 mb-1">Capacity: 500 people</Text>
              <Text className="text-gray-600">Type: Club & Bar</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-600 mb-1">Rating: 4.5/5</Text>
              <Text className="text-gray-600">Price: $$</Text>
            </View>
          </View>
        </View> */}

        {/* Upcoming Events Section */}
        <CompactEventsHorizontalList
          title="Upcoming Events"
          events={upcomingEvents}
          showSeeAll={false}
        />

        <CompactEventsHorizontalList
          title="Passed Events"
          events={upcomingEvents}
          showSeeAll={false}
        />

        {/* Contact Section */}
        <View className="px-5 mb-8">
          <Text className="text-xl font-bold text-[#22954B] mb-4">
            Contact & Booking
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="flex-row items-center mb-3">
              <IconSymbol name="phone" size={16} color="#666" />
              <Text className="text-gray-600 ml-2">+389 70 123 456</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <IconSymbol name="envelope" size={16} color="#666" />
              <Text className="text-gray-600 ml-2">info@venue.com</Text>
            </View>
            <View className="flex-row items-center">
              <IconSymbol name="globe" size={16} color="#666" />
              <Text className="text-gray-600 ml-2">www.venue.com</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
