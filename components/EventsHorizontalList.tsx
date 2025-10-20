import { EventCard } from "@/components/EventCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  venueName?: string;
  city?: string;
  image: string;
  tags: string[];
}

interface EventsHorizontalListProps {
  title: string;
  events: Event[];
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export function EventsHorizontalList({ 
  title, 
  events, 
  onSeeAll,
  showSeeAll = true 
}: EventsHorizontalListProps) {
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
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/event-detail?id=${event.id}`)}
              fromHorizontalList={true}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

