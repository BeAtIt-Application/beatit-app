import { EventCard } from "@/components/EventCard";
import { PageHeader } from "@/components/PageHeader";
import { CityFilter } from "@/components/filters/CityFilter";
import { DateFilter } from "@/components/filters/DateFilter";
import { GenreFilter } from "@/components/filters/GenreFilter";
import { useEvents } from "@/src/hooks/useEvents";
import { useMusicGenres } from "@/src/hooks/useTaxonomies";
import { getCurrentLocation, requestLocationPermission } from "@/src/services/locationService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DateRange {
  from: string;
  to: string;
  label: string;
}

// Helper function to map date range labels to API dateFilter values
const getDateFilterType = (label?: string): 'today' | 'this_week' | 'next_2_weeks' | 'this_month' | 'this_year' | 'custom' | undefined => {
  if (!label) return undefined;
  
  switch (label) {
    case "Today":
      return "today";
    case "This Week":
      return "this_week";
    case "Next 2 Weeks":
      return "next_2_weeks";
    case "This Month":
      return "this_month";
    case "This Year":
      return "this_year";
    case "Custom Range":
      return "custom";
    default:
      return undefined;
  }
};

// Helper function to convert formatted date back to ISO format for API
const convertFormattedDateToISO = (formattedDate: string): string => {
  // Parse formatted date like "26th Sept 2025" back to ISO format
  const parts = formattedDate.split(' ');
  if (parts.length !== 3) return formattedDate; // Return as-is if not in expected format
  
  const day = parts[0].replace(/\D/g, ''); // Remove ordinal suffix
  const month = parts[1];
  const year = parts[2];
  
  const monthMap: { [key: string]: string } = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sept': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
  };
  
  const monthNum = monthMap[month];
  if (!monthNum) return formattedDate; // Return as-is if month not found
  
  return `${year}-${monthNum}-${day.padStart(2, '0')}`;
};

export default function EventsScreen() {
  const { genre } = useLocalSearchParams<{ genre?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal visibility states
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedGenres, setSelectedGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [useLocationFilter, setUseLocationFilter] = useState(false);
  const [locationRadius, setLocationRadius] = useState(5); // Default 5km radius
  
  const filters = ["Genre", "Date", "City"];

  // Use the events hook
  const { events, loading, error, total, page, lastPage, hasMoreData, fetchEvents, loadMoreEvents, refreshEvents } = useEvents();
  const { genres: allGenres } = useMusicGenres();

  // Handle URL parameters on component mount
  useEffect(() => {
    if (genre && allGenres && allGenres.length > 0) {
      // Find the genre by name (case-insensitive)
      const genreName = genre.replace(/-/g, ' ').toLowerCase();
      const foundGenre = allGenres.find(g => 
        g.name.toLowerCase() === genreName
      );
      
      if (foundGenre) {
        setSelectedGenres([{ id: foundGenre.id, name: foundGenre.name }]);
      }
    }
  }, [genre, allGenres]);

  // Debounced search function
  const debouncedLoadEvents = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            const filters = {
              search: searchQuery || undefined,
              musicGenre: selectedGenres.length > 0 ? selectedGenres[0].id : undefined, // Use first selected genre ID
              dateFilter: selectedDateRange ? (selectedDateRange.label === "Custom Range" ? "custom" : getDateFilterType(selectedDateRange.label)) : undefined,
              startDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.from || '') : undefined,
              endDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.to || '') : undefined,
              // Also send the old parameters in case API expects them
              date_from: convertFormattedDateToISO(selectedDateRange?.from || ''),
              date_to: convertFormattedDateToISO(selectedDateRange?.to || ''),
              city: useLocationFilter ? undefined : selectedCity || undefined, // Don't use city when location filter is active
              lat: useLocationFilter ? userLocation?.lat : undefined,
              lng: useLocationFilter ? userLocation?.lng : undefined,
              radius: useLocationFilter ? locationRadius : undefined, // Add radius for location-based filtering
              page: 1,
              limit: 20,
            };

            await fetchEvents(filters);
          } catch (error) {
            console.error('Failed to fetch events:', error);
          }
        }, 300); // 300ms debounce
      };
    })(),
    [searchQuery, fetchEvents]
  );

  // Fetch events with filters (immediate for non-search filters)
  const loadEvents = async () => {
    try {
      const filters = {
        search: searchQuery || undefined,
        musicGenre: selectedGenres.length > 0 ? selectedGenres[0].id : undefined, // Use first selected genre ID
        dateFilter: selectedDateRange ? (selectedDateRange.label === "Custom Range" ? "custom" : getDateFilterType(selectedDateRange.label)) : undefined,
        startDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.from || '') : undefined,
        endDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.to || '') : undefined,
        // Also send the old parameters in case API expects them
        date_from: convertFormattedDateToISO(selectedDateRange?.from || ''),
        date_to: convertFormattedDateToISO(selectedDateRange?.to || ''),
        city: useLocationFilter ? undefined : selectedCity || undefined, // Don't use city when location filter is active
        lat: useLocationFilter ? userLocation?.lat : undefined,
        lng: useLocationFilter ? userLocation?.lng : undefined,
        radius: useLocationFilter ? locationRadius : undefined, // Add radius for location-based filtering
        page: 1,
        limit: 20,
      };

      await fetchEvents(filters);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  // Handle search query changes with debounce
  useEffect(() => {
    if (searchQuery !== undefined) {
      debouncedLoadEvents();
    }
  }, [searchQuery, debouncedLoadEvents]);

  // Handle filter changes immediately (no debounce needed)
  // This also handles initial load since all states are undefined initially
  useEffect(() => {
    loadEvents();
  }, [selectedGenres, selectedDateRange, selectedCity, useLocationFilter, userLocation]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (filter: string) => {
    // Open appropriate modal based on filter
    switch (filter) {
      case "Genre":
        setGenreModalVisible(true);
        break;
      case "Date":
        setDateModalVisible(true);
        break;
      case "City":
        setCityModalVisible(true);
        break;
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedDateRange(null);
    setSelectedCity(null);
    setUseLocationFilter(false);
  };

  // Load more events function
  const handleLoadMore = async () => {
    if (loading || !hasMoreData) return;
    
    try {
      const filters = {
        search: searchQuery || undefined,
        musicGenre: selectedGenres.length > 0 ? selectedGenres[0].id : undefined,
        dateFilter: selectedDateRange ? (selectedDateRange.label === "Custom Range" ? "custom" : getDateFilterType(selectedDateRange.label)) : undefined,
        startDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.from || '') : undefined,
        endDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.to || '') : undefined,
        date_from: convertFormattedDateToISO(selectedDateRange?.from || ''),
        date_to: convertFormattedDateToISO(selectedDateRange?.to || ''),
        city: useLocationFilter ? undefined : selectedCity || undefined,
        lat: useLocationFilter ? userLocation?.lat : undefined,
        lng: useLocationFilter ? userLocation?.lng : undefined,
        radius: useLocationFilter ? locationRadius : undefined,
        limit: 20,
      };

      await loadMoreEvents(filters);
    } catch (error) {
      console.error('Failed to load more events:', error);
    }
  };

  // Handle pull to refresh
  const handleRefresh = async () => {
    try {
      const filters = {
        search: searchQuery || undefined,
        musicGenre: selectedGenres.length > 0 ? selectedGenres[0].id : undefined,
        dateFilter: selectedDateRange ? (selectedDateRange.label === "Custom Range" ? "custom" : getDateFilterType(selectedDateRange.label)) : undefined,
        startDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.from || '') : undefined,
        endDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.to || '') : undefined,
        date_from: convertFormattedDateToISO(selectedDateRange?.from || ''),
        date_to: convertFormattedDateToISO(selectedDateRange?.to || ''),
        city: useLocationFilter ? undefined : selectedCity || undefined,
        lat: useLocationFilter ? userLocation?.lat : undefined,
        lng: useLocationFilter ? userLocation?.lng : undefined,
        radius: useLocationFilter ? locationRadius : undefined,
        page: 1,
        limit: 20,
      };

      await refreshEvents(filters);
    } catch (error) {
      console.error('Failed to refresh events:', error);
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
    Genre: selectedGenres.length > 0 ? selectedGenres.map(g => g.name).join(', ') : null,
    Date: selectedDateRange?.label || null,
    City: selectedCity,
  };

  return (
    <SafeAreaView className="flex-1 bg-[linear-gradient(180deg,#6932D4_0%,#3F6AE9_100%)]bg-white">
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
          title="Events"
          colors={['#761CBC', '#5271FF'] as const}
          filters={filters}
          showSearch={true}
          showLogo={true}
          showNotification={true}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          selectedFilters={selectedFilters}
        />

        {/* Events List */}
        <View className="mb-8 mt-4 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-black">
              {loading ? "Loading..." : `Total ${total || events.length}`}
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
              {(selectedGenres.length > 0 || selectedDateRange || selectedCity || searchQuery || useLocationFilter) && (
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
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  title: event.name,
                  date: new Date(event.event_start).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    day: 'numeric', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }),
                  event_start: event.event_start,
                  location: event.venue_name ? `${event.venue_name}, ${event.city}` : event.city,
                  venueName: event.venue_name,
                  city: event.city,
                  image: event.image || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
                  tags: event.music_genres || [event.city],
                }}
                onPress={() => router.push(`/event-detail?id=${event.id}`)}
              />
            ))}
          </View>
          {events.length === 0 && !loading && !error && (
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-base">No events found</Text>
              <Text className="text-gray-400 text-sm mt-2">Try adjusting your filters</Text>
            </View>
          )}
          
          {/* Load More Button */}
          {events.length > 0 && hasMoreData && (
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
                  {loading ? 'Loading...' : 'Load More Events'}
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs mt-2">
                Page {page} of {lastPage} • {total} total events
              </Text>
            </View>
          )}
          
          {/* No More Results */}
          {events.length > 0 && !hasMoreData && (
            <View className="py-4 items-center">
              <Text className="text-gray-400 text-sm">No more results</Text>
              <Text className="text-gray-500 text-xs mt-1">
                Showing all {total} events
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modals */}
      <GenreFilter
        visible={genreModalVisible}
        onClose={() => setGenreModalVisible(false)}
        onSelect={(genres) => {
          setSelectedGenres(genres);
          setGenreModalVisible(false);
        }}
        selectedGenres={selectedGenres}
      />
      
      <DateFilter
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onSelect={(dateRange) => {
          setSelectedDateRange(dateRange);
          setDateModalVisible(false);
        }}
        selectedDateRange={selectedDateRange}
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
