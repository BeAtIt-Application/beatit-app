import { IconSymbol } from "@/components/ui/icon-symbol";
import { PublicUser } from "@/src/api/userApi";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UserCardProps {
  user: PublicUser;
  onPress?: () => void;
  fromHorizontalList?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onPress, fromHorizontalList }) => {
  const handleHeartPress = (e: any) => {
    e.stopPropagation();
    // Handle heart press logic here
  };

  // Get the avatar image
  const getCardImage = () => {
    if (user.avatar_url) {
      return user.avatar_url;
    }
    if (user.avatar_thumbnail) {
      return user.avatar_thumbnail;
    }
    return "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  };

  const cardImageUrl = getCardImage();

  // Get user display name
  const getDisplayName = () => {
    return `${user.first_name} ${user.last_name}`;
  };

  // Get user role/type
  const getUserType = () => {
    // Handle numeric role values from API
    if (user.role === '4' || (typeof user.role === 'number' && user.role === 4)) {
      return 'Artist';
    }
    if (user.role === '3' || (typeof user.role === 'number' && user.role === 3)) {
      return 'Organization';
    }
    // Fallback for string values
    if (user.role === 'artist') {
      return 'Artist';
    }
    if (user.role === 'organization') {
      return 'Organization';
    }
    return 'User';
  };


  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${
        fromHorizontalList ? 'w-72 mr-4' : 'w-full'
      }`}
    >
      {/* Avatar and Header */}
      <View className="relative bg-[#5271FF] h-32 items-center justify-center">
        {/* Heart Button */}
        <TouchableOpacity
          onPress={handleHeartPress}
          className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full items-center justify-center"
        >
          <IconSymbol name="heart" size={16} color="white" />
        </TouchableOpacity>

        {/* User Type Badge */}
        <View className="absolute top-3 left-3">
          <View className="bg-[#2FCC67] px-2 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">
              {getUserType()}
            </Text>
          </View>
        </View>

        {/* Circular Avatar */}
        <View className="absolute -bottom-8">
          <View className="bg-white rounded-full p-1 shadow-lg">
            <Image
              source={{ uri: cardImageUrl }}
              style={{ width: 60, height: 60, borderRadius: 30 }}
              contentFit="cover"
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <View className="p-4 pt-8">
        {/* Name and Location */}
        <View className="mb-2 items-center">
          {user.artist_tag && (
          <Text className="text-lg font-bold mt-2 text-[#1A1A2E]" numberOfLines={1}>
            {user.artist_tag ?? ''}
          </Text>
          )}
          {user.username && (
          <Text className="text-md font-normal text-[#1A1A2E] mb-1" numberOfLines={1}>
            {user.username ?? ''}
          </Text>
          )}
          {!user.username && !user.artist_tag && (
          <Text className="text-lg font-bold mt-2 text-[#1A1A2E] mb-1" numberOfLines={1}>
            {getDisplayName()}
          </Text>
          )}
          <View className="flex-row items-center">
            <IconSymbol name="location" size={12} color="#666" />
            <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
              {[user.city_from, user.country_from].filter(Boolean).join(', ') || 'Location not specified'}
            </Text>
          </View>
        </View>

      
        {/* Music Genres */}
        <View className="mb-3">
          <Text className="text-gray-500 text-xs mb-2">Music Genres</Text>
          <View className="flex-row flex-wrap gap-1">
            {user.preferred_music_genres && user.preferred_music_genres.length > 0 ? (
              user.preferred_music_genres.map((genre, index) => (
                <View key={index} className="bg-[#761CBC] px-2 py-1 rounded-2xl">
                  <Text className="text-xs text-white font-medium">{genre.name}</Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-400 text-sm">No genres specified</Text>
            )}
          </View>
        </View>

        {/* Social Links */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-3">
            {user.instagram_link && (
              <TouchableOpacity className="w-8 h-8 bg-pink-500 rounded-full items-center justify-center">
                <IconSymbol name="photo" size={14} color="white" />
              </TouchableOpacity>
            )}
            {user.facebook_link && (
              <TouchableOpacity className="w-8 h-8 bg-blue-600 rounded-full items-center justify-center">
                <IconSymbol name="person.2" size={14} color="white" />
              </TouchableOpacity>
            )}
            {user.spotify_link && (
              <TouchableOpacity className="w-8 h-8 bg-green-500 rounded-full items-center justify-center">
                <IconSymbol name="music.note" size={14} color="white" />
              </TouchableOpacity>
            )}
            {user.youtube_link && (
              <TouchableOpacity className="w-8 h-8 bg-red-600 rounded-full items-center justify-center">
                <IconSymbol name="play" size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* View Profile Button */}
          <TouchableOpacity 
            className="bg-[#2FCC67] px-4 py-2 rounded-full"
            onPress={() => router.push(`/user-detail?id=${user.id}`)}
          >
            <Text className="text-white text-sm font-semibold">View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
