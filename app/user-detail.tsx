import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePublicUser } from "@/src/hooks/usePublicUsers";
import { Image } from "expo-image";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userId = id ? parseInt(id) : null;
  
  const { user, loading, error } = usePublicUser(userId);

  // Hide the default header
  React.useEffect(() => {
    // This will be handled by Stack.Screen if needed
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-600">Loading user details...</Text>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-red-500">{error || 'User not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`.trim();
  const location = [user.city_from, user.country_from].filter(Boolean).join(', ');
  const avatarUrl = user.avatar_url || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";

  const handlePhoneCall = () => {
    const phone = user.contact_phone || user.phone_number;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = () => {
    const email = user.contact_email || user.email;
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleSocialLink = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 bg-white">
      {/* Header with Avatar */}
      <View className="relative bg-[#5271FF]" style={{ height: 200 }}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-5 w-10 h-10 bg-white rounded-full justify-center items-center shadow-lg z-10"
        >
          <IconSymbol name="chevron.left" size={20} color="black" />
        </TouchableOpacity>

        {/* Avatar */}
        <View className="absolute -bottom-16 left-0 right-0 items-center">
          <View className="bg-white rounded-full p-2 shadow-lg">
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
              contentFit="cover"
            />
          </View>
        </View>
      </View>

      {/* User Info */}
      <View className="mt-20 px-5">
        <Text className="text-3xl font-bold text-center text-[#1A1A2E] mb-2">
          {fullName}
        </Text>
        
        {user.artist_tag && (
          <Text className="text-lg text-gray-600 text-center mb-2">
            {user.artist_tag}
          </Text>
        )}
        
        {user.role && (
          <View className="flex-row justify-center mb-4">
            <View className="bg-[#5271FF] px-4 py-2 rounded-2xl">
              <Text className="text-sm text-white font-medium">
                {user.role == "3" ? "Organization" : "Artist" }
              </Text>
            </View>
          </View>
        )}

        {location && (
          <View className="flex-row items-center justify-center mb-6">
            <IconSymbol name="location" size={16} color="#666" />
            <Text className="text-gray-600 ml-2">{location}</Text>
          </View>
        )}

        {/* Bio Section */}
        {user.bio && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Bio
            </Text>
            <Text className="text-gray-700 leading-6">
              {user.bio}
            </Text>
          </View>
        )}

        {/* Contact Info */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Contact Information
          </Text>
          
          <View className="bg-gray-50 rounded-xl p-4">
            {(user.contact_email || user.email) && (
              <TouchableOpacity
                onPress={handleEmail}
                className="flex-row items-center mb-3"
              >
                <IconSymbol name="envelope" size={20} color="#761CBC" />
                <Text className="text-brand-purple ml-3 text-base">
                  {user.contact_email || user.email}
                </Text>
              </TouchableOpacity>
            )}
            
            {(user.contact_phone || user.phone_number) && (
              <TouchableOpacity
                onPress={handlePhoneCall}
                className="flex-row items-center"
              >
                <IconSymbol name="phone" size={20} color="#761CBC" />
                <Text className="text-brand-purple ml-3 text-base">
                  {user.contact_phone || user.phone_number}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Social Links */}
        {(user.instagram_link || user.facebook_link || user.youtube_link || user.spotify_link || user.soundcloud_link) && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Social Media
            </Text>
            
            <View className="flex-row flex-wrap gap-3">
              {user.instagram_link && (
                <TouchableOpacity
                  onPress={() => handleSocialLink(user.instagram_link)}
                  className="bg-[#E4405F] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="photo" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">Instagram</Text>
                </TouchableOpacity>
              )}
              
              {user.facebook_link && (
                <TouchableOpacity
                  onPress={() => handleSocialLink(user.facebook_link)}
                  className="bg-[#1877F2] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="person.2" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">Facebook</Text>
                </TouchableOpacity>
              )}
              
              {user.youtube_link && (
                <TouchableOpacity
                  onPress={() => handleSocialLink(user.youtube_link)}
                  className="bg-[#FF0000] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="play.rectangle.fill" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">YouTube</Text>
                </TouchableOpacity>
              )}
              
              {user.spotify_link && (
                <TouchableOpacity
                  onPress={() => handleSocialLink(user.spotify_link)}
                  className="bg-[#1DB954] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="music.note.list" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">Spotify</Text>
                </TouchableOpacity>
              )}
              
              {user.soundcloud_link && (
                <TouchableOpacity
                  onPress={() => handleSocialLink(user.soundcloud_link)}
                  className="bg-[#FF5500] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="waveform.path" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">SoundCloud</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Preferred Music Genres */}
        {user.preferred_music_genres && user.preferred_music_genres.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Music Genres
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {user.preferred_music_genres.map((genre) => (
                <View key={genre.id} className="bg-[#761CBC] px-3 py-2 rounded-2xl">
                  <Text className="text-white text-sm font-medium">
                    {genre.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Preferred Venue Types */}
        {user.preferred_venue_types && user.preferred_venue_types.length > 0 && (
          <View className="mb-8">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Preferred Venues
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {user.preferred_venue_types.map((venue) => (
                <View key={venue.id} className="bg-[#2FCC67] px-3 py-2 rounded-2xl">
                  <Text className="text-white text-sm font-medium">
                    {venue.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
    </>
  );
}

