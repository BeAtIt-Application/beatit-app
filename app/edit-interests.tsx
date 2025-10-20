import { IconSymbol } from "@/components/ui/icon-symbol";
import { useProfile } from "@/src/hooks/useProfile";
import { useMusicGenres, useVenueTypes } from "@/src/hooks/useTaxonomies";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditInterestsScreen() {
  const { profile, loading: profileLoading, updateInterests } = useProfile();
  const { genres, loading: genresLoading } = useMusicGenres();
  const { venueTypes, loading: venueTypesLoading } = useVenueTypes();

  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'genres' | 'venues'>('genres');

  useEffect(() => {
    if (profile) {
      setSelectedGenres(profile.preferred_music_genres?.map(g => g.id) || []);
      setSelectedVenueTypes(profile.preferred_venue_types?.map(v => v.id) || []);
    }
  }, [profile]);

  const toggleGenre = (id: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(id)) {
        return prev.filter(genreId => genreId !== id);
      } else {
        if (prev.length >= 5) {
          Alert.alert("Limit Reached", "You can select up to 5 music genres");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const toggleVenueType = (id: number) => {
    setSelectedVenueTypes(prev => {
      if (prev.includes(id)) {
        return prev.filter(venueId => venueId !== id);
      } else {
        if (prev.length >= 4) {
          Alert.alert("Limit Reached", "You can select up to 4 venue types");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const validateAndSave = async () => {
    if (selectedGenres.length < 3) {
      Alert.alert("Validation Error", "Please select at least 3 music genres");
      return;
    }

    if (selectedVenueTypes.length < 2) {
      Alert.alert("Validation Error", "Please select at least 2 venue types");
      return;
    }

    try {
      setSaving(true);
      
      // Update genres
      await updateInterests({
        type: 'music_genres',
        ids: selectedGenres,
      });

      // Update venue types
      await updateInterests({
        type: 'venue_types',
        ids: selectedVenueTypes,
      });

      Alert.alert("Success", "Interests updated successfully!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to update interests"
      );
    } finally {
      setSaving(false);
    }
  };

  const loading = profileLoading || genresLoading || venueTypesLoading;

  if (loading && !profile) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#761CBC" />
          <Text className="text-gray-600 mt-4">Loading...</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="relative bg-[#5271FF]" style={{ height: 140 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            className="absolute top-12 left-5 w-10 h-10 bg-white rounded-full justify-center items-center shadow-lg z-10"
          >
            <IconSymbol name="chevron.left" size={20} color="black" />
          </TouchableOpacity>

          <View className="absolute top-12 right-5 z-10">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={validateAndSave}
              disabled={saving}
              className="bg-white px-4 py-2 rounded-full"
            >
              {saving ? (
                <ActivityIndicator size="small" color="#761CBC" />
              ) : (
                <Text className="text-[#761CBC] font-semibold">Save</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center items-center">
            <Text className="text-2xl font-bold text-white">Edit Interests</Text>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-white border-b border-gray-200 px-5 pt-4">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('genres')}
            className={`flex-1 pb-3 border-b-2 ${
              activeTab === 'genres' ? 'border-brand-purple' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'genres' ? 'text-brand-purple' : 'text-gray-500'
              }`}
            >
              Music Genres ({selectedGenres.length}/5)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('venues')}
            className={`flex-1 pb-3 border-b-2 ${
              activeTab === 'venues' ? 'border-brand-purple' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === 'venues' ? 'text-brand-purple' : 'text-gray-500'
              }`}
            >
              Venue Types ({selectedVenueTypes.length}/4)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-5 py-6" showsVerticalScrollIndicator={false}>
          {activeTab === 'genres' && (
            <View>
              <Text className="text-sm text-gray-600 mb-4">
                Select 3-5 music genres you're interested in
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {genres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre.id);
                  return (
                    <TouchableOpacity
                      key={genre.id}
                      activeOpacity={0.8}
                      onPress={() => toggleGenre(genre.id)}
                      className={`px-4 py-3 rounded-xl ${
                        isSelected ? 'bg-brand-purple' : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {genre.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {activeTab === 'venues' && (
            <View>
              <Text className="text-sm text-gray-600 mb-4">
                Select 2-4 venue types you prefer
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {venueTypes.map((venueType) => {
                  const isSelected = selectedVenueTypes.includes(venueType.id);
                  return (
                    <TouchableOpacity
                      key={venueType.id}
                      activeOpacity={0.8}
                      onPress={() => toggleVenueType(venueType.id)}
                      className={`px-4 py-3 rounded-xl ${
                        isSelected ? 'bg-[#2FCC67]' : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {venueType.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Requirements Footer */}
        <View className="bg-gray-50 px-5 py-4 border-t border-gray-200 mb-12">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            Requirements:
          </Text>
          <Text className="text-sm text-gray-600">
            • Music Genres: 3-5 selections required
          </Text>
          <Text className="text-sm text-gray-600">
            • Venue Types: 2-4 selections required
          </Text>
        </View>
      </View>
    </>
  );
}

