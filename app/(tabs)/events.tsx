import { EventCard } from "@/components/EventCard";
import { PageHeader } from "@/components/PageHeader";
import { CityFilter } from "@/components/filters/CityFilter";
import { DateFilter } from "@/components/filters/DateFilter";
import { GenreFilter } from "@/components/filters/GenreFilter";
import { useEvents } from "@/src/hooks/useEvents";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DateRange {
  from: string;
  to: string;
  label: string;
}

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal visibility states
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const filters = ["Genre", "Date", "City"];

  // Use the events hook
  const { events, loading, error, total, fetchEvents, refreshEvents } = useEvents();

  // Fetch events with filters
  const loadEvents = async () => {
    try {
      const filters = {
        search: searchQuery || undefined,
        genre: selectedGenres.length > 0 ? selectedGenres.join(',') : undefined,
        date_from: selectedDateRange?.from,
        date_to: selectedDateRange?.to,
        city: selectedCity || undefined,
        page: 1,
        limit: 20,
      };
      
      const result = await fetchEvents(filters);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  // Initial load and refetch when filters change
  useEffect(() => {
    loadEvents();
  }, [searchQuery, selectedGenres, selectedDateRange, selectedCity]);

  // Initial load on component mount
  useEffect(() => {
    loadEvents();
  }, []);

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
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
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
          <Text className="text-xl font-bold text-black mb-4">
            {loading ? "Loading..." : `Total ${total || events.length}`}
          </Text>
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
                  location: event.venue_name ? `${event.venue_name}, ${event.city}` : event.city,
                  venueName: event.venue_name,
                  city: event.city,
                  image: event.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
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
