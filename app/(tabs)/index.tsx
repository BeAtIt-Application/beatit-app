import { CategoryGrid, CategoryItem } from "@/components/CategoryGrid";
import { CompactEventsHorizontalList } from "@/components/CompactEventsHorizontalList";
import { CompactVenuesHorizontalList } from "@/components/CompactVenuesHorizontalList";
import { EventsHorizontalList } from "@/components/EventsHorizontalList";
import { HorizontalSavedSlider, SliderCard } from "@/components/HorizontalSavedSlider";
import { PageHeader } from "@/components/PageHeader";
import { VenuesHorizontalList } from "@/components/VenuesHorizontalList";
import { useMusicGenres, useVenueTypes } from "@/src/hooks/useTaxonomies";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Discover");
  const { genres: allGenres } = useMusicGenres();
  const { venueTypes: allVenueTypes } = useVenueTypes();

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

  const events = [
    {
      id: 1,
      title: "Neshto interesno ke ima vo Kamarite",
      date: "Thur 26 May, 09:00 am",
      location: "Kamarite, Bitola",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tags: ["Rock", "Metal"],
    },
    {
      id: 2,
      title: "Neshto interesno ke ima vo Kamarite",
      date: "Fri 27 May, 08:00 pm",
      location: "Skopje Center",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tags: ["Rock", "Metal"],

    },
  ];

  const venues = [
    {
      id: 1,
      name: "Elegant Garden Venue",
      date: "Available Now",
      location: "Adresa, Bitola",
      image:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      venueTypes: ["Pub", "Klub"],
      stars: 4.5
    },
    {
      id: 2,
      name: "Modern Conference Hall",
      date: "Thu 26 May",
      location: "Kamarite, Bitola",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      venueTypes: ["Pub", "Klub"],

        stars: 4.5
    },
    {
      id: 3,
      name: "Outdoor Event Space",
      date: "Fri 27 May",
      location: "City Center, Skopje",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      venueTypes: ["Pub", "Klub"],

      stars: 4.5
    },
  ];

  const compactVenues = [
    {
      id: 1,
      name: "Elegant Garden Venue",
      date: "Available Now",
      location: "Adresa, Bitola",
      image:
      "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      venueTypes: ["Pub", "Klub"],
      stars: 4.5
    },
    {
      id: 2,
      name: "Modern Conference Hall",
      date: "Thu 26 May",
      location: "Kamarite, Bitola",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      venueTypes: ["Pub", "Klub"],

        stars: 4.5
    },
    {
      id: 3,
      name: "Outdoor Event Space",
      date: "Fri 27 May",
      location: "City Center, Skopje",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      venueTypes: ["Pub", "Klub"],

      stars: 4.5
    },
  ];


  const compactEvents = [
    {
      id: 3,
      title: "Nekoja zabava ima negde ",
      date: "Thur 26 May, 10pm",
      location: "Bitola",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tag: "Neshto",
    },
    {
      id: 4,
      title: "Nekoja zabava ima negde ",
      date: "Sat 28 May, 11pm",
      location: "Skopje",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      tag: "Rock",
    },
  ];


  const handleCategoryPress = (item: CategoryItem) => {
    console.log("Category pressed:", item);
    
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

  // Slider cards data
  const sliderCards: SliderCard[] = [
    {
      id: 1,
      title: "Venues",
      image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      onPress: () => console.log('Featured Event pressed'),
    },
    {
      id: 2,
      title: "Events",
      image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      onPress: () => console.log('New Venue pressed'),
    },
    {
      id: 3,
      title: "Organizations",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      onPress: () => console.log('Artist Spotlight pressed'),
    },
    {
      id: 4,
      title: "Artists",
      image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
      onPress: () => console.log('Weekend Special pressed'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[linear-gradient(180deg,#6932D4_0%,#3F6AE9_100%)]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 90 }}
      >
        <PageHeader
          title="Home Feed"
          colors={['#5271FF', '#22954B'] as const}
          showLogo={true}
          showSearch={false}
          showNotification={true}
        />

        {/* Horizontal Slider */}
        <HorizontalSavedSlider
          cards={sliderCards}
          cardWidth={220}
          cardHeight={200}
          blurRadius={10}
        />

        {/* Content */}
        <View className="bg-gray-100 mt-4">
          {/* Events near you - Large Cards */}
          <EventsHorizontalList
            title="Events near you"
            events={events}
            onSeeAll={() => router.push("/events")}
          />
        </View>

        <View className="bg-gray-100 mt-4">
          {/* Events near you - Large Cards */}
          <VenuesHorizontalList
            title="Venues near you"
            venues={venues}
            onSeeAll={() => router.push("/venues")}
          />
        </View>

        {/* Events near you - Compact Cards */}
        <CompactEventsHorizontalList
          title="Compact Events"
          events={compactEvents}
          onSeeAll={() => router.push("/events")}
        />

        {/* Venues near you - Compact Cards */}
        <CompactVenuesHorizontalList
          title="Compact Venues"
          venues={compactVenues}
          onSeeAll={() => router.push("/venues")}
        />

        {/* Genres */}
        <CategoryGrid
          title="Genres"
          items={randomGenres}
          onItemPress={handleCategoryPress}
          columns={2}
        />

        {/* Venue Types */}
        <CategoryGrid
          title="Venue Types"
          items={randomVenueTypes}
          onItemPress={handleCategoryPress}
          columns={2}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
