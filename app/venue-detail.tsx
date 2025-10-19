import { CompactEventsHorizontalList } from "@/components/CompactEventsHorizontalList";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function VenueDetailScreen() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Live Music Night",
      date: "Fri 15 Dec, 20:00",
      location: "This Venue",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
      tag: "Live Music",
    },
    {
      id: 2,
      title: "DJ Set Weekend",
      date: "Sat 16 Dec, 22:00",
      location: "This Venue",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop",
      tag: "DJ Set",
    },
    {
      id: 3,
      title: "Acoustic Session",
      date: "Sun 17 Dec, 19:00",
      location: "This Venue",
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
            uri: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
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
            Venue Name
          </Text>
          <Text className="text-lg text-gray-800 mb-2">Venue Type</Text>
          <View className="flex-row items-center">
            <IconSymbol name="location" size={16} color="#666" />
            <Text className="text-gray-500 ml-1">Adresa, Bitola</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="pt-6">
        {/* Description Section */}
        <View className="mb-6 px-5">
          <Text className="text-xl font-bold text-[#22954B] mb-3">
            About Venue Name
          </Text>
          <Text className="text-gray-600 leading-6">
            This is a premium venue located in the heart of the city. With state-of-the-art 
            sound systems and lighting, it provides the perfect atmosphere for live music 
            events, DJ sets, and private parties. The venue can accommodate up to 500 guests 
            and features a spacious dance floor, VIP areas, and a full-service bar.
          </Text>
        </View>

        {/* Location Section */}
        <View className="px-5 mb-6">
          <Text className="text-xl font-bold text-[#22954B] mb-3">
            Location
          </Text>
          <TouchableOpacity>
            <Text className="text-[#22954B] text-lg underline">
              (MAP?) Kamarite, Bitola
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
