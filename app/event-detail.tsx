import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEvent, useToggleEventStatus } from "@/src/hooks/useEvents";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = id ? parseInt(id) : null;
  
  const { event, loading, error } = useEvent(eventId);
  const { toggleStatus, loading: toggleLoading } = useToggleEventStatus();

  const handleToggleStatus = async (status: 'interested' | 'going') => {
    if (!eventId) return;
    
    try {
      await toggleStatus(eventId, status);
      // The event data will be refetched automatically by the hook
    } catch (error) {
      console.error('Failed to toggle event status:', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading event details...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">{error || 'Event not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const artists = [
    {
      id: 1,
      name: "Saso Parketo",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "I brat mu",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop",
    },
  ];

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Hero Image with Back Button */}
      <View className="relative">
        <Image
          source={{
            uri: event.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
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

        {/* Event Info Card Overlay */}
        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6">
          <Text className="text-3xl font-bold text-brand-purple mb-2">
            {event.name}
          </Text>
          <Text className="text-lg text-gray-800 mb-2">{event.music_genres?.[0] || 'Event'}</Text>
          <View className="flex-row items-center">
            <IconSymbol name="location" size={16} color="#666" />
            <View className="flex-row items-center ml-1">
              {event.venue_name ? (
                <>
                  <Text className="text-gray-500 font-medium text-[#1A1A2E]">{event.venue_name}</Text>
                  <Text className="text-gray-500">, {event.city}</Text>
                </>
              ) : (
                <Text className="text-gray-500">{event.city}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="px-5 pt-6">
        {/* Description Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Description
          </Text>
          <Text className="text-gray-600 leading-6">
            {event.description || 'No description available for this event.'}
          </Text>
        </View>

        {/* Location Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Location
          </Text>
          <TouchableOpacity>
            <Text className="text-brand-purple text-lg underline">
              Kamarite, Bitola
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date and Time Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Description
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-gray-600 mb-1">Event date: {new Date(event.event_start).toLocaleDateString()}</Text>
              <Text className="text-gray-600">Event time: {new Date(event.event_start).toLocaleTimeString()}</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-600 mb-1">Location: {event.city}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity
            onPress={() => handleToggleStatus('going')}
            disabled={toggleLoading}
            className={`flex-1 py-4 rounded-xl ${
              event.user_status === 'going' ? 'bg-brand-purple' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-center font-bold text-lg ${
              event.user_status === 'going' ? 'text-white' : 'text-gray-800'
            }`}>
              {toggleLoading ? 'Loading...' : `GOING ${event.going_count || 0}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleToggleStatus('interested')}
            disabled={toggleLoading}
            className={`flex-1 py-4 rounded-xl ${
              event.user_status === 'interested' ? 'bg-brand-purple' : 'bg-gray-200'
            }`}
          >
            <Text className={`text-center font-bold text-lg ${
              event.user_status === 'interested' ? 'text-white' : 'text-gray-800'
            }`}>
              {toggleLoading ? 'Loading...' : `INTERESTED ${event.interested_count || 0}`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Artists Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-brand-purple mb-4">
            Artists
          </Text>
          <View className="flex-row gap-4">
            {artists.map((artist) => (
              <View key={artist.id} className="flex-1">
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <Image
                    source={{ uri: artist.image }}
                    style={{ width: "100%", height: 120, borderRadius: 12 }}
                    contentFit="cover"
                  />
                  <Text className="text-gray-800 font-medium text-center mt-3">
                    {artist.name}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
