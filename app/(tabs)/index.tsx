import { CategoryGrid, CategoryItem } from "@/components/CategoryGrid";
import { CompactUsersHorizontalList } from "@/components/CompactUsersHorizontalList";
import { EventsHorizontalList } from "@/components/EventsHorizontalList";
import { HorizontalSavedSlider, SliderCard } from "@/components/HorizontalSavedSlider";
import { PageHeader } from "@/components/PageHeader";
import { VenuesHorizontalList } from "@/components/VenuesHorizontalList";
import { useFavorites } from "@/src/context/FavoritesContext";
import { useFYP } from "@/src/hooks/useFYP";
import { useMusicGenres, useVenueTypes } from "@/src/hooks/useTaxonomies";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Discover");
  const { genres: allGenres } = useMusicGenres();
  const { venueTypes: allVenueTypes } = useVenueTypes();
  
  // FYP (For You Page) data
  const { fypData, loading: fypLoading, error: fypError, refetch: refetchFYP } = useFYP();
  const { setInitialFavorites } = useFavorites();

  // Helper functions to transform API data to component format
  const transformEventForComponent = (apiEvent: any) => ({
    id: apiEvent.id,
    title: apiEvent.name,
    date: new Date(apiEvent.event_start).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }),
    event_start: apiEvent.event_start,
    location: `${apiEvent.venue_name}, ${apiEvent.city}`,
    venueName: apiEvent.venue_name,
    city: apiEvent.city,
    image: apiEvent.image || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    tags: apiEvent.music_genres || []
  });

  const transformVenueForComponent = (apiVenue: any) => ({
    id: apiVenue.id,
    name: apiVenue.name,
    city: apiVenue.city,
    image: apiVenue.logo || apiVenue.banner?.url || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    banner: apiVenue.banner,
    stars: apiVenue.average_rating || 0,
    venueTypes: apiVenue.type ? [apiVenue.type] : [],
    is_favourite: apiVenue.is_favourite || false
  });

  // Log FYP data when it changes and initialize favorites
  useEffect(() => {
    if (fypError) {
      console.error('FYP Error:', fypError);
    }
    
    // Initialize favorites from FYP data
    if (fypData) {
      const favoriteVenueIds: number[] = [];
      
      // Add saved venue if it exists
      if (fypData.savedVenue) {
        favoriteVenueIds.push(fypData.savedVenue.id);
      }
      
      // Add preferred venues that are favorited
      if (fypData.preferredVenues) {
        fypData.preferredVenues.forEach(venue => {
          if (venue.is_favourite) {
            favoriteVenueIds.push(venue.id);
          }
        });
      }
      
      setInitialFavorites(favoriteVenueIds);
    }
  }, [fypData, fypError, fypLoading, setInitialFavorites]);

  const tabs = ["Discover", "Events", "Venues", "Artists"];

  // Function to get random items from an array
  const getRandomItems = <T,>(items: T[], count: number): T[] => {
    if (items.length <= count) return items;
    
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Get random 6 genres and venue types
  const randomGenres = useMemo(() => {
    if (!allGenres || allGenres.length === 0) return [];
    return getRandomItems(allGenres, 6).map(genre => ({
      id: genre.id,
      label: genre.name,
      value: genre.name.toLowerCase().replace(/\s+/g, '-'),
    }));
  }, [allGenres]);

  const randomVenueTypes = useMemo(() => {
    if (!allVenueTypes || allVenueTypes.length === 0) return [];
    return getRandomItems(allVenueTypes, 6).map(venueType => ({
      id: venueType.id,
      label: venueType.name,
      value: venueType.name.toLowerCase().replace(/\s+/g, '-'),
    }));
  }, [allVenueTypes]);


  const handleCategoryPress = (item: CategoryItem) => {
    
    // Determine if this is a genre or venue type based on the item's ID
    // Genres will have IDs from the music genres API, venue types from venue types API
    const isGenre = randomGenres.some(genre => genre.id === item.id);
    const isVenueType = randomVenueTypes.some(venueType => venueType.id === item.id);
    
    if (isGenre) {
      // Navigate to events page with genre filter
      router.push(`/events?genre=${item.value}`);
    } else if (isVenueType) {
      // Navigate to venues page with venue type filter
      router.push(`/venues?venueType=${item.value}`);
    } else {
      console.log("Unknown category type:", item);
    }
  };

  // Handle pull to refresh
  const handleRefresh = async () => {
    try {
      await refetchFYP();
    } catch (error) {
      console.error('Failed to refresh FYP data:', error);
    }
  };

  // Helper function to validate and get image URL
  const getValidImageUrl = (url: string | null | undefined): string => {
    if (!url || url.trim() === '' || url === 'null' || url === 'undefined') {
      return "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
    }
    console.log('Using image URL:', url);
    return url;
  };

  // Dynamic slider cards based on saved entities from FYP data
  const sliderCards: SliderCard[] = useMemo(() => {
    const cards: SliderCard[] = [];
    
    // Add Venues card if there is a saved venue
    if (fypData?.savedVenue) {
      let venueImage = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
      
      if (fypData.savedVenue.banner?.url) {
        venueImage = getValidImageUrl(fypData.savedVenue.banner.url);
      } else if (fypData.savedVenue.logo) {
        // Handle logo which can be string, string[], or object
        if (typeof fypData.savedVenue.logo === 'string') {
          venueImage = getValidImageUrl(fypData.savedVenue.logo);
        } else if (Array.isArray(fypData.savedVenue.logo) && fypData.savedVenue.logo.length > 0) {
          venueImage = getValidImageUrl(fypData.savedVenue.logo[0]);
        } else if (typeof fypData.savedVenue.logo === 'object' && 'url' in fypData.savedVenue.logo) {
          venueImage = getValidImageUrl(fypData.savedVenue.logo.url);
        }
      }
      
      cards.push({
        id: 'venues',
        title: "Venues",
        image: venueImage,
        onPress: () => router.push("/venues"),
      });
    }
    
    // Add Events card if there is a saved event
    if (fypData?.savedEvent) {
      cards.push({
        id: 'events',
        title: "Events",
        image: getValidImageUrl(fypData.savedEvent.image),
        onPress: () => router.push("/events"),
      });
    }
    
    // Add Organizations card if there is a saved organization
    if (fypData?.savedOrganization) {
      cards.push({
        id: 'organizations',
        title: "Organizations",
        image: getValidImageUrl(fypData.savedOrganization.avatar_url),
        onPress: () => router.push('/users?type=organizations'),
      });
    }
    
    // Add Artists card if there is a saved artist
    if (fypData?.savedArtist) {
      cards.push({
        id: 'artists',
        title: "Artists",
        image: getValidImageUrl(fypData.savedArtist.avatar_url),
        onPress: () => router.push('/users?type=artists'),
      });
    }
    
    return cards;
  }, [fypData]);

  return (
    <SafeAreaView className="flex-1 bg-[linear-gradient(180deg,#6932D4_0%,#3F6AE9_100%)]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={fypLoading}
            onRefresh={handleRefresh}
            tintColor="#5271FF"
            colors={["#5271FF"]}
          />
        }
      >
        <PageHeader
          title="Home Feed"
          colors={['#5271FF', '#22954B'] as const}
          showLogo={true}
          showSearch={false}
          showNotification={true}
        />

        {/* Horizontal Slider - Only show if there are saved entities */}
        {sliderCards.length > 0 && (
          <HorizontalSavedSlider
            cards={sliderCards}
            cardWidth={220}
            cardHeight={200}
            blurRadius={10}
          />
        )}

        {/* Content */}
          {/* Events near you - Large Cards */}
          {/* <View className="bg-gray-100 mt-4">
          <EventsHorizontalList
            title="Events near you"
            events={events}
            onSeeAll={() => router.push("/events")}
          />
        </View> */}

        {/* Events near you - Large Cards */}
          {/* <View className="bg-gray-100 mt-4">
          <VenuesHorizontalList
            title="Venues near you"
            venues={venues}
            onSeeAll={() => router.push("/venues")}
          />
        </View> */}

        {/* Events near you - Compact Cards */}
        {/* <CompactEventsHorizontalList
          title="Compact Events"
          events={compactEvents}
          onSeeAll={() => router.push("/events")}
        /> */}

        {/* Venues near you - Compact Cards */}
        {/* <CompactVenuesHorizontalList
          title="Compact Venues"
          venues={compactVenues}
          onSeeAll={() => router.push("/venues")}
        /> */}
        
        {/* Saved Artists Slider */}
        {/* <HorizontalArtistSlider
          title="Featured Artists"
          artists={compactArtists}
          cardWidth={220}
          cardHeight={200}
          blurRadius={10}
        /> */}

        {/* Artists - Compact Cards */}
        {/* <CompactUsersHorizontalList
          title="Featured Artists"
          users={compactArtists}
          onSeeAll={() => router.push('/users?type=artists')}
        /> */}

        {/* Organizations - Compact Cards */}
        {/* <CompactUsersHorizontalList
          title="Organizations"
          users={compactOrganizations}
          onSeeAll={() => router.push('/users?type=organizations')}
        /> */}

        {/* FYP (For You Page) Sections */}
        {fypData && (
          <>
            {/* FYP Preferred Events */}
            {fypData.preferredEvents && fypData.preferredEvents.length > 0 && (
              <EventsHorizontalList
                title="For You - Events"
                events={fypData.preferredEvents.map(transformEventForComponent)}
                onSeeAll={() => router.push("/events")}
              />
            )}

            {/* Genres */}
            <CategoryGrid
              title="View Events by Genre"
              items={randomGenres}
              onItemPress={handleCategoryPress}
              columns={2}
            />


            {/* FYP Preferred Venues */}
            {fypData.preferredVenues && fypData.preferredVenues.length > 0 && (
              <VenuesHorizontalList
                title="For You - Venues"
                venues={fypData.preferredVenues.map(transformVenueForComponent)}
                onSeeAll={() => router.push("/venues")}
              />
            )}
            
            
            {/* FYP Preferred Artists */}
            {fypData.preferredArtists && fypData.preferredArtists.length > 0 && (
              <CompactUsersHorizontalList
                title="For You - Artists"
                users={fypData.preferredArtists}
                onSeeAll={() => router.push('/users?type=artists')}
              />
            )}

            {/* Venue Types */}
              <CategoryGrid
                title="View Venues by Type"
                items={randomVenueTypes}
                onItemPress={handleCategoryPress}
                columns={2}
              />

            {/* FYP Preferred Organizations */}
            {fypData.preferredOrganizations && fypData.preferredOrganizations.length > 0 && (
              <CompactUsersHorizontalList
                title="Organizations"
                users={fypData.preferredOrganizations}
                onSeeAll={() => router.push('/users?type=organizations')}
              />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
