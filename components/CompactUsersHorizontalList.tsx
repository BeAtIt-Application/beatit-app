import { CompactUserCard } from "@/components/CompactUserCard";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface CompactUser {
  id: number;
  first_name: string;
  last_name: string;
  artist_tag?: string;
  city_from?: string;
  country_from?: string;
  avatar_url?: string;
  avatar_thumbnail?: string;
  role?: string;
}

interface CompactUsersHorizontalListProps {
  title: string;
  users: CompactUser[];
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export function CompactUsersHorizontalList({
  title,
  users,
  onSeeAll,
  showSeeAll = true,
}: CompactUsersHorizontalListProps) {
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
          {users.map((user) => (
            <CompactUserCard
              key={user.id}
              user={user}
              onPress={() => router.push(`/user-detail?id=${user.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

