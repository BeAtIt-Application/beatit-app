import { PageHeader } from "@/components/PageHeader";
import { VenueCard } from "@/components/VenueCard";
import { CityFilter } from "@/components/filters/CityFilter";
import { VenueTypeFilter } from "@/components/filters/VenueTypeFilter";
import { useVenueTypes } from "@/src/hooks/useTaxonomies";
import { useVenues } from "@/src/hooks/useVenues";
import { getCurrentLocation, requestLocationPermission } from "@/src/services/locationService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VenuesScreen() {
  const { venueType } = useLocalSearchParams<{ venueType?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal visibility states
  const [venueTypeModalVisible, setVenueTypeModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedVenueType, setSelectedVenueType] = useState<{ id: number; name: string } | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [locationRadius, setLocationRadius] = useState(5); // Default 5km radius

  const filters = ["Venue Type", "City"];

  // Use the venues hook
  const { venues, loading, error, total, fetchVenues, refreshVenues } = useVenues();
  const { venueTypes: allVenueTypes } = useVenueTypes();

  // Handle URL parameters on component mount
  useEffect(() => {
    if (venueType && allVenueTypes && allVenueTypes.length > 0) {
      // Find the venue type by name (case-insensitive)
      const venueTypeName = venueType.replace(/-/g, ' ').toLowerCase();
      const foundVenueType = allVenueTypes.find(vt => 
        vt.name.toLowerCase() === venueTypeName
      );
      
      if (foundVenueType) {
        setSelectedVenueType({ id: foundVenueType.id, name: foundVenueType.name });
      }
    }
  }, [venueType, allVenueTypes]);

  // Debounced search function
  const debouncedLoadVenues = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          console.log('🔍 Venues Debounced Search Triggered with query:', searchQuery);
          try {
            const filters = {
              search: searchQuery || undefined,
              venueType: selectedVenueType?.id || undefined, // Use venue type ID for API
              city: useLocationFilter ? undefined : selectedCity || undefined, // Don't use city when location filter is active
              lat: useLocationFilter ? userLocation?.lat : undefined,
              lng: useLocationFilter ? userLocation?.lng : undefined,
              radius: useLocationFilter ? locationRadius : undefined, // Add radius for location-based filtering
              page: 1,
              limit: 20,
            };
            
            await fetchVenues(filters);
          } catch (error) {
            console.error('Failed to fetch venues:', error);
          }
        }, 300); // 300ms debounce
      };
    })(),
    [searchQuery, selectedVenueType, selectedCity, fetchVenues]
  );

  // Fetch venues with filters (immediate for non-search filters)
  const loadVenues = async () => {
    try {
      const filters = {
        search: searchQuery || undefined,
        venueType: selectedVenueType?.id || undefined, // Use venue type ID for API
        city: useLocationFilter ? undefined : selectedCity || undefined, // Don't use city when location filter is active
        lat: useLocationFilter ? userLocation?.lat : undefined,
        lng: useLocationFilter ? userLocation?.lng : undefined,
        radius: useLocationFilter ? locationRadius : undefined, // Add radius for location-based filtering
        page: 1,
        limit: 20,
      };
      
      await fetchVenues(filters);
    } catch (error) {
      console.error('Failed to fetch venues:', error);
    }
  };

  // Handle search query changes with debounce
  useEffect(() => {
    if (searchQuery !== undefined) {
      debouncedLoadVenues();
    }
  }, [searchQuery, debouncedLoadVenues]);

  // Handle filter changes immediately (no debounce needed)
  useEffect(() => {
    if (selectedVenueType !== undefined || selectedCity !== undefined || useLocationFilter !== undefined) {
      loadVenues();
    }
  }, [selectedVenueType, selectedCity, useLocationFilter, userLocation]);

  // Initial load on component mount
  useEffect(() => {
    loadVenues();
  }, []);

  const handleSearchChange = (text: string) => {
    console.log('🔍 Venues Search Query Changed:', text);
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

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedVenueType(null);
    setSelectedCity(null);
    setUseLocationFilter(false);
  };

  const handleLocationFilter = async () => {
    try {
      const permission = await requestLocationPermission();
      if (!permission.granted) {
        console.log('Location permission denied');
        return;
      }

      const location = await getCurrentLocation();
      if (location) {
        setUserLocation({ lat: location.latitude, lng: location.longitude });
        setUseLocationFilter(true);
        setSelectedCity(null); // Clear city filter when using location
      }
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const selectedFilters = {
    "Venue Type": selectedVenueType?.name || null,
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
            <View className="flex-row gap-2">
              {/* <TouchableOpacity
                onPress={handleLocationFilter}
                className={`px-3 py-1 rounded-full ${
                  useLocationFilter ? 'bg-[#5271FF]' : 'bg-gray-200'
                }`}
              >
                <Text className={`text-sm ${
                  useLocationFilter ? 'text-white' : 'text-gray-600'
                }`}>
                  {useLocationFilter ? 'Near Me ✓' : 'Near Me'}
                </Text>
              </TouchableOpacity> */}
              {(selectedVenueType || selectedCity || searchQuery || useLocationFilter) && (
                <TouchableOpacity
                  onPress={clearAllFilters}
                  className="bg-gray-200 px-3 py-1 rounded-full"
                >
                  <Text className="text-sm text-gray-600">Reset Filters</Text>
                </TouchableOpacity>
              )}
            </View>
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
                  image: venue.image || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
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
