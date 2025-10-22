import { authApi } from "@/src/api";
import { useMusicGenres, useVenueTypes } from "@/src/hooks/useTaxonomies";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectInterestsScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const { genres, isLoading: genresLoading } = useMusicGenres();
  const { venueTypes, isLoading: venueTypesLoading } = useVenueTypes();
  
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleGenre = (id: number) => {
    if (selectedGenres.includes(id)) {
      setSelectedGenres((prev) => prev.filter((g) => g !== id));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres((prev) => [...prev, id]);
      } else {
        Alert.alert("Maximum Reached", "You can select up to 5 music genres");
      }
    }
  };

  const toggleVenueType = (id: number) => {
    if (selectedVenueTypes.includes(id)) {
      setSelectedVenueTypes((prev) => prev.filter((v) => v !== id));
    } else {
      if (selectedVenueTypes.length < 4) {
        setSelectedVenueTypes((prev) => [...prev, id]);
      } else {
        Alert.alert("Maximum Reached", "You can select up to 4 venue types");
      }
    }
  };

  const isValid =
    selectedGenres.length >= 3 &&
    selectedGenres.length <= 5 &&
    selectedVenueTypes.length >= 2 &&
    selectedVenueTypes.length <= 4;

  const getGenreStatus = () => {
    if (selectedGenres.length < 3) return `${selectedGenres.length}/3 (minimum)`;
    if (selectedGenres.length > 5) return `${selectedGenres.length}/5 (maximum exceeded)`;
    return `${selectedGenres.length}/5`;
  };

  const getVenueTypeStatus = () => {
    if (selectedVenueTypes.length < 2) return `${selectedVenueTypes.length}/2 (minimum)`;
    if (selectedVenueTypes.length > 4) return `${selectedVenueTypes.length}/4 (maximum exceeded)`;
    return `${selectedVenueTypes.length}/4`;
  };

  const handleContinue = async () => {
    if (!isValid) {
      Alert.alert(
        "Selection Required",
        "Please select 3-5 music genres and 2-4 venue types"
      );
      return;
    }

    if (!email) {
      Alert.alert("Error", "Email is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.saveInterests({
        email,
        music_genre_ids: selectedGenres,
        venue_type_ids: selectedVenueTypes,
      });

      // Send verification email automatically
      router.replace({
        pathname: "/auth/verify-email-by-code",
        params: { email }
      });
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to save interests"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-5 pt-8 pb-4">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-[23px] text-[#151B23] font-poppins-bold mb-2">
              Tell us what you like
            </Text>
            <Text className="text-base text-[#798CA3] leading-6">
              Select your favorite music genres and venue types to personalize
              your experience
            </Text>
          </View>

          {/* Music Genres Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-poppins-semibold text-[#151B23]">
                Music Genres
              </Text>
              <Text
                className={`text-sm font-poppins-medium ${
                  selectedGenres.length >= 3 && selectedGenres.length <= 5
                    ? "text-green-600"
                    : "text-[#798CA3]"
                }`}
              >
                Selected: {getGenreStatus()}
              </Text>
            </View>

            {genresLoading ? (
              <View className="py-8 items-center">
                <Text className="text-gray-400">Loading genres...</Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {genres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre.id);
                  return (
                    <TouchableOpacity
                      key={genre.id}
                      onPress={() => toggleGenre(genre.id)}
                      activeOpacity={1}
                      className={`px-4 py-2 rounded-full border-2 ${
                        isSelected
                          ? "bg-[#761CBC] border-[#761CBC]"
                          : "bg-white border-[#761CBC]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-poppins-medium ${
                          isSelected ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {genre.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Venue Types Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-poppins-semibold text-[#151B23]">
                Venue Types
              </Text>
              <Text
                className={`text-sm font-poppins-medium ${
                  selectedVenueTypes.length >= 2 && selectedVenueTypes.length <= 4
                    ? "text-green-600"
                    : "text-[#798CA3]"
                }`}
              >
                Selected: {getVenueTypeStatus()}
              </Text>
            </View>

            {venueTypesLoading ? (
              <View className="py-8 items-center">
                <Text className="text-gray-400">Loading venue types...</Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                {venueTypes.map((venueType) => {
                  const isSelected = selectedVenueTypes.includes(venueType.id);
                  return (
                    <TouchableOpacity
                      key={venueType.id}
                      onPress={() => toggleVenueType(venueType.id)}
                      activeOpacity={1}
                      className={`px-4 py-2 rounded-full border-2 ${
                        isSelected
                          ? "bg-[#2FCC67] border-[#2FCC67]"
                          : "bg-white border-[#2FCC67]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-poppins-medium ${
                          isSelected ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {venueType.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Continue Button */}
          <View className="mt-auto pt-6">
            <TouchableOpacity
              className={`rounded-full py-4 items-center ${
                isValid && !isSubmitting
                  ? "bg-brand-blue"
                  : "bg-gray-300"
              }`}
              onPress={handleContinue}
              disabled={!isValid || isSubmitting}
            >
              <Text className="text-white text-base font-poppins-medium">
                {isSubmitting ? "Saving..." : "Continue"}
              </Text>
            </TouchableOpacity>

            {!isValid && (
              <Text className="text-center text-sm text-[#798CA3] mt-3">
                Select 3-5 music genres and 2-4 venue types to continue
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

