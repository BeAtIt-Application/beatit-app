import { PageHeader } from "@/components/PageHeader";
import { UserCard } from "@/components/UserCard";
import { CityFilter } from "@/components/filters/CityFilter";
import { GenreFilter } from "@/components/filters/GenreFilter";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useUsers } from "@/src/hooks/usePublicUsers";
import { useMusicGenres } from "@/src/hooks/useTaxonomies";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsersScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal visibility states
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedGenres, setSelectedGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Determine user type (artists or organizations)
  const userType = type === 'organizations' ? 'organizations' : 'artists';
  const pageTitle = userType === 'organizations' ? 'Organizations' : 'Artists';

  const filters = ["Genre", "City"];

  // Use the combined hook based on user type
  const {
    users,
    loading,
    error,
    total,
    page,
    lastPage,
    hasMoreData,
    fetchUsers,
    loadMoreUsers,
    refreshUsers
  } = useUsers(userType as 'artists' | 'organizations');

  const { genres: allGenres } = useMusicGenres();

  // Handle URL parameters on component mount
  useEffect(() => {
    if (type && allGenres && allGenres.length > 0) {
      // You can add logic here to handle URL parameters if needed
    }
  }, [type, allGenres]);

  // Handle search query changes with debounce
  useEffect(() => {
    if (searchQuery !== undefined) {
      const timeoutId = setTimeout(async () => {
        try {
          const filters = {
            search: searchQuery || undefined,
            page: 1,
            limit: 20,
            column: 'users.first_name',
            dir: 'asc' as const,
            draw: 1,
            music_genre: selectedGenres.length > 0 ? selectedGenres.map(g => g.id) : undefined,
            city: selectedCity || undefined,
          };
          
          await fetchUsers(filters);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      }, 300); // 300ms debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, selectedGenres, selectedCity]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (filter: string) => {
    // Open appropriate modal based on filter
    switch (filter) {
      case "Genre":
        setGenreModalVisible(true);
        break;
      case "City":
        setCityModalVisible(true);
        break;
    }
  };

  // Handle filter changes and trigger new search
  const handleGenreSelect = async (genres: { id: number; name: string }[]) => {
    setSelectedGenres(genres);
    setGenreModalVisible(false);
    
    try {
      const filters = {
        search: searchQuery || undefined,
        page: 1,
        limit: 20,
        column: 'users.first_name',
        dir: 'asc' as const,
        draw: 1,
        music_genre: genres.length > 0 ? genres.map(g => g.id) : undefined,
        city: selectedCity || undefined,
      };
      
      await fetchUsers(filters);
    } catch (error) {
      console.error('Failed to fetch users with genre filter:', error);
    }
  };

  const handleCitySelect = async (city: string | null) => {
    setSelectedCity(city);
    setCityModalVisible(false);
    
    try {
      const filters = {
        search: searchQuery || undefined,
        page: 1,
        limit: 20,
        column: 'users.first_name',
        dir: 'asc' as const,
        draw: 1,
        music_genre: selectedGenres.length > 0 ? selectedGenres.map(g => g.id) : undefined,
        city: city || undefined,
      };
      
      await fetchUsers(filters);
    } catch (error) {
      console.error('Failed to fetch users with city filter:', error);
    }
  };

  const clearAllFilters = async () => {
    setSearchQuery("");
    setSelectedGenres([]);
    setSelectedCity(null);
    
    try {
      const filters = {
        search: undefined,
        page: 1,
        limit: 20,
        column: 'users.first_name',
        dir: 'asc' as const,
        draw: 1,
        music_genre: undefined,
        city: undefined,
      };
      
      await fetchUsers(filters);
    } catch (error) {
      console.error('Failed to clear filters:', error);
    }
  };

  // Handle pull to refresh
  const handleRefresh = async () => {
    try {
      const filters = {
        search: searchQuery || undefined,
        page: 1,
        limit: 20,
        column: 'users.first_name',
        dir: 'asc' as const,
        draw: 1,
        music_genre: selectedGenres.length > 0 ? selectedGenres.map(g => g.id) : undefined,
        city: selectedCity || undefined,
      };
      
      await refreshUsers(filters);
    } catch (error) {
      console.error('Failed to refresh users:', error);
    }
  };

  // Load more users function
  const handleLoadMore = async () => {
    if (loading || !hasMoreData) return;
    
    try {
      const filters = {
        search: searchQuery || undefined,
        limit: 20,
        column: 'users.first_name',
        dir: 'asc' as const,
        draw: 1,
        music_genre: selectedGenres.length > 0 ? selectedGenres.map(g => g.id) : undefined,
        city: selectedCity || undefined,
      };

      await loadMoreUsers(filters);
    } catch (error) {
      console.error('Failed to load more users:', error);
    }
  };

  const selectedFilters = {
    Genre: selectedGenres.length > 0 ? selectedGenres.map(g => g.name).join(', ') : null,
    City: selectedCity,
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
          headerTransparent: true,
          headerBackground: () => null,
        }} 
      />
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
          title={pageTitle}
          colors={['#5271FF', '#5C1593'] as const}
          filters={userType === 'artists' ? filters : []}
          showSearch={true}
          showLogo={true}
          showNotification={false}
          showBackButton={false}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          selectedFilters={selectedFilters}
        />

        {/* Back Button Overlay */}
        <TouchableOpacity 
          onPress={() => router.back()}
          activeOpacity={0.8}
          className="absolute top-8 left-5 w-10 h-10 bg-white/90 rounded-full justify-center items-center shadow-lg z-[10]"
          style={{ elevation: 9999 }}
        >
          <IconSymbol name="chevron.left" size={20} color="#000" />
        </TouchableOpacity>

        {/* Users List */}
        <View className="mb-8 mt-4 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-black">
              {loading ? "Loading..." : `Total ${total || users?.length || 0}`}
            </Text>
            <View className="flex-row gap-2">
              {(selectedGenres.length > 0 || selectedCity || searchQuery) && (
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
            {users?.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onPress={() => router.push(`/user-detail?id=${user.id}`)}
              />
            ))}
          </View>
          {(!users || users.length === 0) && !loading && !error && (
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-base">No {userType} found</Text>
              <Text className="text-gray-400 text-sm mt-2">Try adjusting your filters</Text>
            </View>
          )}
          
          {/* Load More Button */}
          {users && users.length > 0 && hasMoreData && (
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
                  {loading ? 'Loading...' : `Load More ${userType}`}
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs mt-2">
                Page {page} of {lastPage} • {total} total {userType}
              </Text>
            </View>
          )}
          
          {/* No More Results */}
          {users && users.length > 0 && !hasMoreData && (
            <View className="py-4 items-center">
              <Text className="text-gray-400 text-sm">No more results</Text>
              <Text className="text-gray-500 text-xs mt-1">
                Showing all {total} {userType}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Filter Modals */}
      <GenreFilter
        visible={genreModalVisible}
        onClose={() => setGenreModalVisible(false)}
        onSelect={handleGenreSelect}
        selectedGenres={selectedGenres}
      />
      
      <CityFilter
        visible={cityModalVisible}
        onClose={() => setCityModalVisible(false)}
        onSelect={handleCitySelect}
        selectedCity={selectedCity}
      />
      </SafeAreaView>
    </>
  );
}
