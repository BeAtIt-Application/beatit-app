import { CompactEventCard } from "@/components/CompactEventCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface CompactEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  tag: string;
}

interface CompactEventsHorizontalListProps {
  title: string;
  events: CompactEvent[];
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export function CompactEventsHorizontalList({
  title,
  events,
  onSeeAll,
  showSeeAll = true,
}: CompactEventsHorizontalListProps) {
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
          {events.map((event) => (
            <CompactEventCard
              key={event.id}
              event={event}
              onPress={() => router.push(`/event-detail?id=${event.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

