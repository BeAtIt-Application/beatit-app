import { IconSymbol } from "@/components/ui/icon-symbol";
import { useProfile } from "@/src/hooks/useProfile";
import { useUser } from "@/src/hooks/useUser";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ProfileScreen() {
  const { logout } = useUser();
  const { profile, loading } = useProfile();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/auth/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleEmail = () => {
    if (profile?.email || profile?.contact_email) {
      Linking.openURL(`mailto:${profile.contact_email || profile.email}`);
    }
  };

  const handlePhoneCall = () => {
    const phone = profile?.contact_phone || profile?.phone_number;
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleSocialLink = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const avatarUrl = profile?.avatar_url || profile?.avatar_thumbnail || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";
  const location = profile ? [profile.city_from, profile.country_from].filter(Boolean).join(', ') : "";

  if (loading && !profile) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#761CBC" />
          <Text className="text-lg text-gray-600 mt-4">Loading profile...</Text>
        </View>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 justify-center items-center bg-white">
          <Text className="text-lg text-gray-600">No profile data available</Text>
        </View>
      </>
    );
  }

  const getUserRole = (role: number) => {
    switch (role) {
      case 1:
        return "Admin";
      case 2:
        return "Collaborator";
      case 3:
        return "Organization";
      case 4:
        return "Artist";
      case 5:
        return "Public";
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
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
      <View className="mt-20 px-5 pb-8">
        <Text className="text-3xl font-bold text-center text-[#1A1A2E] mb-2">
          {fullName}
        </Text>
        
        {profile.artist_tag && (
          <Text className="text-lg text-gray-600 text-center mb-2">
            {profile.artist_tag}
          </Text>
        )}
        
        {profile.role && (
          <View className="flex-row justify-center mb-4">
            <View className="bg-[#5271FF] px-4 py-2 rounded-2xl">
              <Text className="text-sm text-white font-medium">
                {getUserRole(parseInt(profile.role))}
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
        {profile.bio && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Bio
            </Text>
            <Text className="text-gray-700 leading-6">
              {profile.bio}
            </Text>
          </View>
        )}

        {/* Contact Info */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Contact Information
          </Text>
          
          <View className="bg-gray-50 rounded-xl p-4">
            {(profile.contact_email || profile.email) && (
              <TouchableOpacity
                onPress={handleEmail}
                className="flex-row items-center mb-3"
              >
                <IconSymbol name="envelope" size={20} color="#761CBC" />
                <Text className="text-brand-purple ml-3 text-base">
                  {profile.contact_email || profile.email}
                </Text>
              </TouchableOpacity>
            )}
            
            {(profile.contact_phone || profile.phone_number) && (
              <TouchableOpacity
                onPress={handlePhoneCall}
                className="flex-row items-center"
              >
                <IconSymbol name="phone" size={20} color="#761CBC" />
                <Text className="text-brand-purple ml-3 text-base">
                  {profile.contact_phone || profile.phone_number}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Social Links */}
        {(profile.instagram_link || profile.facebook_link || profile.youtube_link || profile.spotify_link || profile.soundcloud_link) && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Social Media
            </Text>
            
            <View className="flex-row flex-wrap gap-3">
              {profile.instagram_link && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSocialLink(profile.instagram_link)}
                  className="bg-[#E4405F] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="photo" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">Instagram</Text>
                </TouchableOpacity>
              )}
              
              {profile.facebook_link && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSocialLink(profile.facebook_link)}
                  className="bg-[#1877F2] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="person.2" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">Facebook</Text>
                </TouchableOpacity>
              )}
              
              {profile.youtube_link && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSocialLink(profile.youtube_link)}
                  className="bg-[#FF0000] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="play.rectangle.fill" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">YouTube</Text>
                </TouchableOpacity>
              )}
              
              {profile.spotify_link && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSocialLink(profile.spotify_link)}
                  className="bg-[#1DB954] px-4 py-3 rounded-xl flex-row items-center shadow-sm"
                >
                  <IconSymbol name="music.note.list" size={20} color="white" />
                  <Text className="text-white ml-2 font-medium">Spotify</Text>
                </TouchableOpacity>
              )}
              
              {profile.soundcloud_link && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleSocialLink(profile.soundcloud_link)}
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
        {profile.preferred_music_genres && profile.preferred_music_genres.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Music Genres
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {profile.preferred_music_genres.map((genre) => (
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
        {profile.preferred_venue_types && profile.preferred_venue_types.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-brand-purple mb-3">
              Preferred Venues
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {profile.preferred_venue_types.map((venue) => (
                <View key={venue.id} className="bg-[#2FCC67] px-3 py-2 rounded-2xl">
                  <Text className="text-white text-sm font-medium">
                    {venue.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mb-32">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Actions
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/edit-profile")}
            className="bg-gray-200 px-6 py-4 rounded-xl flex-row items-center mb-3"
          >
            <IconSymbol name="pencil" size={24} color="#666" />
            <Text className="text-gray-700 font-semibold text-lg ml-3">
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/edit-interests")}
            className="bg-gray-200 px-6 py-4 rounded-xl flex-row items-center mb-3"
          >
            <IconSymbol name="heart" size={24} color="#666" />
            <Text className="text-gray-700 font-semibold text-lg ml-3">
              Edit Interests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/change-password")}
            className="bg-gray-200 px-6 py-4 rounded-xl flex-row items-center mb-3"
          >
            <IconSymbol name="gear" size={24} color="#666" />
            <Text className="text-gray-700 font-semibold text-lg ml-3">
              Change Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Language", "Language settings coming soon!")}
            className="bg-gray-200 px-6 py-4 rounded-xl flex-row items-center mb-3"
          >
            <IconSymbol name="globe" size={24} color="#666" />
            <Text className="text-gray-700 font-semibold text-lg ml-3">
              Language
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 px-6 py-4 rounded-xl flex-row items-center"
          >
            <IconSymbol name="arrow.right.square" size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-3">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </>
  );
}
