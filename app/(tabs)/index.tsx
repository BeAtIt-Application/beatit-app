import { CategoryGrid, CategoryItem } from "@/components/CategoryGrid";
import { CompactEventsHorizontalList } from "@/components/CompactEventsHorizontalList";
import { CompactVenuesHorizontalList } from "@/components/CompactVenuesHorizontalList";
import { EventsHorizontalList } from "@/components/EventsHorizontalList";
import { PageHeader } from "@/components/PageHeader";
import { VenuesHorizontalList } from "@/components/VenuesHorizontalList";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Discover");
  
  // Scroll animation value
  const scrollY = useRef(new Animated.Value(0)).current;

  const tabs = ["Discover", "Events", "Venues", "Artists"];

  const events = [
    {
      id: 1,
      title: "Neshto interesno ke ima vo Kamarite",
      date: "Thur 26 May, 09:00 am",
      location: "Kamarite, Bitola",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      tags: ["Rock", "Metal"],
    },
    {
      id: 2,
      title: "Neshto interesno ke ima vo Kamarite",
      date: "Fri 27 May, 08:00 pm",
      location: "Skopje Center",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
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
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      venueTypes: ["Pub", "Klub"],
      stars: 4.5
    },
    {
      id: 2,
      name: "Modern Conference Hall",
      date: "Thu 26 May",
      location: "Kamarite, Bitola",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      venueTypes: ["Pub", "Klub"],

        stars: 4.5
    },
    {
      id: 3,
      name: "Outdoor Event Space",
      date: "Fri 27 May",
      location: "City Center, Skopje",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
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
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      venueTypes: ["Pub", "Klub"],
      stars: 4.5
    },
    {
      id: 2,
      name: "Modern Conference Hall",
      date: "Thu 26 May",
      location: "Kamarite, Bitola",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      venueTypes: ["Pub", "Klub"],

        stars: 4.5
    },
    {
      id: 3,
      name: "Outdoor Event Space",
      date: "Fri 27 May",
      location: "City Center, Skopje",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
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
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      tag: "Neshto",
    },
    {
      id: 4,
      title: "Nekoja zabava ima negde ",
      date: "Sat 28 May, 11pm",
      location: "Skopje",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
      tag: "Rock",
    },
  ];

  const genres: CategoryItem[] = [
    { id: 1, label: "Rock", value: "rock" },
    { id: 2, label: "Jazz", value: "jazz" },
    { id: 3, label: "Electronic", value: "electronic" },
    { id: 4, label: "Hip Hop", value: "hip-hop" },
    { id: 5, label: "Pop", value: "pop" },
    { id: 6, label: "Metal", value: "metal" },
  ];

  const venueTypes: CategoryItem[] = [
    { id: 1, label: "Pub", value: "pub" },
    { id: 2, label: "Club", value: "club" },
    { id: 3, label: "Arena", value: "arena" },
    { id: 4, label: "Bar", value: "bar" },
  ];

  const handleCategoryPress = (item: CategoryItem) => {
    console.log("Category pressed:", item);
    // Navigate with filter or handle category selection
    // router.push(`/events?genre=${item.value}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[linear-gradient(180deg,#6932D4_0%,#3F6AE9_100%)]">
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
          title="Home Feed"
          colors={['#5271FF', '#22954B'] as const}
          showLogo={true}
          showNotification={true}
          scrollY={scrollY}
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
          items={genres}
          onItemPress={handleCategoryPress}
          columns={2}
        />

        {/* Venue Types */}
        <CategoryGrid
          title="Venue Types"
          items={venueTypes}
          onItemPress={handleCategoryPress}
          columns={2}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
