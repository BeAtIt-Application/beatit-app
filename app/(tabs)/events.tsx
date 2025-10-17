import { EventCard } from "@/components/EventCard";
import { PageHeader } from "@/components/PageHeader";
import { CityFilter } from "@/components/filters/CityFilter";
import { DateFilter } from "@/components/filters/DateFilter";
import { GenreFilter } from "@/components/filters/GenreFilter";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DateRange {
  from: string;
  to: string;
  label: string;
}

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Scroll animation value
  const scrollY = useRef(new Animated.Value(0)).current;

  // Modal visibility states
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const filters = ["Genre", "Date", "City"];

  // Mock events data - will be replaced by API data
  const mockEvents = [
    {
      id: 1,
      title: "Neshto interesno ke ima vo Kamarite",
      date: "Thur 26 May, 09:00 am",
      location: "Kamarite, Bitola",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      tags: ["Bitola", "Kamarite"],
    },
    {
      id: 2,
      title: "Summer Music Festival",
      date: "Fri 27 May, 08:00 pm",
      location: "Skopje Center",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
      tags: ["Skopje", "Festival"],
    },
    {
      id: 3,
      title: "Electronic Night",
      date: "Sat 28 May, 11:00 pm",
      location: "Club Arena, Bitola",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      tags: ["Electronic", "Club"],
    },
  ];

  // Fetch events with filters
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedGenres.length > 0) params.append('genres', selectedGenres.join(','));
      if (selectedDateRange) {
        params.append('dateFrom', selectedDateRange.from);
        params.append('dateTo', selectedDateRange.to);
      }
      if (selectedCity) params.append('city', selectedCity);
      
      // TODO: Replace with actual API endpoint when backend is ready
      // const data = await apiGet(`/events?${params.toString()}`);
      // setEvents(data);
      
      // For now, use mock data
      console.log('Fetching events with params:', params.toString());
      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents(mockEvents); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedGenres, selectedDateRange, selectedCity]);

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

  const selectedFilters = {
    Genre: selectedGenres,
    Date: selectedDateRange,
    City: selectedCity,
  };

  return (
    <SafeAreaView className="flex-1 bg-[linear-gradient(180deg,#6932D4_0%,#3F6AE9_100%)]bg-white">
      {/* Content with scroll tracking - header is now INSIDE */}
      <Animated.ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        {/* Sticky PageHeader component */}
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
          scrollY={scrollY}
        />

        {/* Events List */}
        <View className="mb-8 mt-4 px-5">
          <Text className="text-xl font-bold text-black mb-4">
            {loading ? "Loading..." : `Total ${events.length}`}
          </Text>
          <View className="gap-4">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => router.push("/event-detail")}
              />
            ))}
          </View>
          {events.length === 0 && !loading && (
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-base">No events found</Text>
              <Text className="text-gray-400 text-sm mt-2">Try adjusting your filters</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>

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
