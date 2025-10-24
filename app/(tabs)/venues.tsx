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
    RefreshControl,
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
  const { venues, loading, error, total, page, lastPage, hasMoreData, fetchVenues, loadMoreVenues, refreshVenues } = useVenues();
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
    [searchQuery, fetchVenues]
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
  // This also handles initial load since all states are undefined initially
  useEffect(() => {
    loadVenues();
  }, [selectedVenueType, selectedCity, useLocationFilter, userLocation]);

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

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedVenueType(null);
    setSelectedCity(null);
    setUseLocationFilter(false);
  };

  // Load more venues function
  const handleLoadMore = async () => {
    if (loading || !hasMoreData) return;
    
    try {
      const filters = {
        search: searchQuery || undefined,
        venueType: selectedVenueType?.id || undefined,
        city: useLocationFilter ? undefined : selectedCity || undefined,
        lat: useLocationFilter ? userLocation?.lat : undefined,
        lng: useLocationFilter ? userLocation?.lng : undefined,
        radius: useLocationFilter ? locationRadius : undefined,
        limit: 20,
      };

      await loadMoreVenues(filters);
    } catch (error) {
      console.error('Failed to load more venues:', error);
    }
  };

  // Handle pull to refresh
  const handleRefresh = async () => {
    try {
      const filters = {
        search: searchQuery || undefined,
        venueType: selectedVenueType?.id || undefined,
        city: useLocationFilter ? undefined : selectedCity || undefined,
        lat: useLocationFilter ? userLocation?.lat : undefined,
        lng: useLocationFilter ? userLocation?.lng : undefined,
        radius: useLocationFilter ? locationRadius : undefined,
        page: 1,
        limit: 20,
      };

      await refreshVenues(filters);
    } catch (error) {
      console.error('Failed to refresh venues:', error);
    }
  };

  const handleLocationFilter = async () => {
    try {
      const permission = await requestLocationPermission();
      if (!permission.granted) {
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
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor="#5271FF"
            colors={["#5271FF"]}
          />
        }
      >
        <PageHeader
          title="Venues"
          colors={['#2FCC67', '#5C1593'] as const}
          filters={filters}
          showSearch={true}
          showLogo={true}
          showNotification={false}
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
                  banner: venue.banner,
                  images: venue.images,
                  venueTypes: [venue.type].filter(Boolean) as string[],
                  average_rating: venue.average_rating,
                  total_ratings: venue.total_ratings,
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
          
          {/* Load More Button */}
          {venues.length > 0 && hasMoreData && (
            <View className="py-4 items-center">
              <TouchableOpacity
                onPress={handleLoadMore}
                disabled={loading}
                className={`px-6 py-3 rounded-full ${
                  loading ? 'bg-gray-300' : 'bg-[#5271FF]'
                }`}
              >
                <Text className={`text-sm font-semibold ${
                  loading ? 'text-gray-500' : 'text-white'
                }`}>
                  {loading ? 'Loading...' : 'Load More Venues'}
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs mt-2">
                Page {page} of {lastPage} • {total} total venues
              </Text>
            </View>
          )}
          
          {/* No More Results */}
          {venues.length > 0 && !hasMoreData && (
            <View className="py-4 items-center">
              <Text className="text-gray-400 text-sm">No more results</Text>
              <Text className="text-gray-500 text-xs mt-1">
                Showing all {total} venues
              </Text>
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
