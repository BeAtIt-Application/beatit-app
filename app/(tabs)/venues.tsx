import { PageHeader } from "@/components/PageHeader";
import { VenueCard } from "@/components/VenueCard";
import { CityFilter } from "@/components/filters/CityFilter";
import { VenueTypeFilter } from "@/components/filters/VenueTypeFilter";
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
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal visibility states
  const [venueTypeModalVisible, setVenueTypeModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedVenueType, setSelectedVenueType] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filters = ["Venue Type", "City"];

  // Mock venues data - will be replaced by API data
  const mockVenues = [
    {
      id: 1,
      name: "Elegant Garden Venue",
      date: "Available Now",
      location: "Adresa, Bitola",
      image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      venueTypes: ["Pub", "Klub"],
      stars: 2.5
    },
    {
      id: 2,
      name: "Modern Conference Hall",
      date: "Thu 26 May",
      location: "Kamarite, Bitola",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      venueTypes: ["Pub", "Klub"],
      stars: 3.7
    },
    {
      id: 3,
      name: "Outdoor Event Space",
      date: "Fri 27 May",
      location: "City Center, Skopje",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      venueTypes: ["Kafe", "Klub"],
      stars: 5
    },
  ];

  // Fetch venues with filters
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedVenueType) params.append('venueType', selectedVenueType);
      if (selectedCity) params.append('city', selectedCity);
      
      // TODO: Replace with actual API endpoint when backend is ready
      // const data = await apiGet(`/venues?${params.toString()}`);
      // setVenues(data);
      
      // For now, use mock data
      console.log('Fetching venues with params:', params.toString());
      setVenues(mockVenues);
    } catch (error) {
      console.error('Failed to fetch venues:', error);
      setVenues(mockVenues); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchVenues();
  }, [searchQuery, selectedVenueType, selectedCity]);

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
              {loading ? "Loading..." : `Total ${venues.length}`}
            </Text>
          </View>
          <View className="gap-4">
            {venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onPress={() => router.push("/event-detail")}
              />
            ))}
          </View>
          {venues.length === 0 && !loading && (
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
