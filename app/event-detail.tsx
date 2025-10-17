import { IconSymbol } from "@/components/ui/icon-symbol";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function EventDetailScreen() {
  const [goingPercentage, setGoingPercentage] = useState(60);
  const [interestedPercentage, setInterestedPercentage] = useState(40);

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
            uri: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
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
            Title
          </Text>
          <Text className="text-lg text-gray-800 mb-2">Name</Text>
          <View className="flex-row items-center">
            <IconSymbol name="location" size={16} color="#666" />
            <Text className="text-gray-500 ml-1">Adresa, Bitola</Text>
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
            Integer id augue iaculis, iaculis orci ut, blandit quam. Donec in
            elit auctor, finibus quam in, phar. Proin id ligula dictum, covalis
            enim ut, facilisis massa. Mauris a nisi ut sapien blandit imperdi.
            Interdum et malesuada fames ac ante ipsum primis in faucibs. Sed
            posuere egestas nunc ut tempus. Fu ipsum dolor sit amet.
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
              <Text className="text-gray-600 mb-1">Start date: 23.09.2025</Text>
              <Text className="text-gray-600">Start time: 09:00</Text>
            </View>
            <View className="items-end">
              <Text className="text-gray-600 mb-1">End date: 10.10.2025</Text>
              <Text className="text-gray-600">End time: 23:00</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity
            onPress={() => {
              setGoingPercentage(goingPercentage + 1);
              setInterestedPercentage(interestedPercentage - 1);
            }}
            className="flex-1 bg-brand-purple py-4 rounded-xl"
          >
            <Text className="text-white text-center font-bold text-lg">
              GOING {goingPercentage}%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setInterestedPercentage(interestedPercentage + 1);
              setGoingPercentage(goingPercentage - 1);
            }}
            className="flex-1 bg-gray-200 py-4 rounded-xl"
          >
            <Text className="text-gray-800 text-center font-bold text-lg">
              INTERESTED {interestedPercentage}%
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
