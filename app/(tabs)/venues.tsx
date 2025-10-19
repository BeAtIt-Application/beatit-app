import { PageHeader } from "@/components/PageHeader";
import { VenueCard } from "@/components/VenueCard";
import { CityFilter } from "@/components/filters/CityFilter";
import { VenueTypeFilter } from "@/components/filters/VenueTypeFilter";
import { useVenues } from "@/src/hooks/useVenues";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VenuesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal visibility states
  const [venueTypeModalVisible, setVenueTypeModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedVenueType, setSelectedVenueType] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filters = ["Venue Type", "City"];

  // Use the venues hook
  const { venues, loading, error, total, fetchVenues, refreshVenues } = useVenues();

  // Fetch venues with filters
  const loadVenues = async () => {
    try {
      const filters = {
        search: searchQuery || undefined,
        venue_type: selectedVenueType || undefined,
        city: selectedCity || undefined,
        page: 1,
        limit: 20,
      };
      
      const result = await fetchVenues(filters);
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    }
  };

  // Initial load and refetch when filters change
  useEffect(() => {
    loadVenues();
  }, [searchQuery, selectedVenueType, selectedCity]);

  // Initial load on component mount
  useEffect(() => {
    loadVenues();
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (filter: string) => {
    // Open appropriate modal based on filter
    switch (filter) {
      case "Venue Type":
        setVenueTypeModalVisible(true);
        break;
      case "City":
        setCityModalVisible(true);
        break;
    }
  };

  const selectedFilters = {
    "Venue Type": selectedVenueType,
    City: selectedCity,
  };

  return (
    <SafeAreaView className="flex-1 bg-[linear-gradient(180deg,#6932D4_0%,#3F6AE9_100%)]">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <PageHeader
          title="Venues"
          colors={['#2FCC67', '#5C1593'] as const}
          filters={filters}
          showSearch={true}
          showLogo={true}
          showNotification={true}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          selectedFilters={selectedFilters}
        />

        {/* Venues List */}
        <View className="mb-8 mt-4 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-black">
              {loading ? "Loading..." : `Total ${total || venues.length}`}
            </Text>
          </View>
          {error && (
            <View className="py-4 items-center">
              <Text className="text-red-500 text-base">{error}</Text>
            </View>
          )}
          <View className="gap-4">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={{
                  id: venue.id,
                  name: venue.name,
                  venueType: venue.type,
                  city: venue.city,
                  image: venue.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
                  venueTypes: [venue.type].filter(Boolean) as string[],
                  stars: 0, // No rating field in API response
                }}
                onPress={() => router.push(`/venue-detail?id=${venue.id}`)}
              />
            ))}
          </View>
          {venues.length === 0 && !loading && !error && (
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-base">No venues found</Text>
              <Text className="text-gray-400 text-sm mt-2">Try adjusting your filters</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modals */}
      <VenueTypeFilter
        visible={venueTypeModalVisible}
        onClose={() => setVenueTypeModalVisible(false)}
        onSelect={(venueType) => {
          setSelectedVenueType(venueType);
          setVenueTypeModalVisible(false);
        }}
        selectedVenueType={selectedVenueType}
      />
      
      <CityFilter
        visible={cityModalVisible}
        onClose={() => setCityModalVisible(false)}
        onSelect={(city) => {
          setSelectedCity(city);
          setCityModalVisible(false);
        }}
        selectedCity={selectedCity}
      />
    </SafeAreaView>
  );
}
