import { DateFilter } from "@/components/filters/DateFilter";
import { GenreFilter } from "@/components/filters/GenreFilter";
import { VenueTypeFilter } from "@/components/filters/VenueTypeFilter";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Event } from "@/src/api/eventApi";
import { Venue } from "@/src/api/venueApi";
import { useEvents, useEventsNearUser } from "@/src/hooks/useEvents";
import { useMusicGenres, useVenueTypes } from "@/src/hooks/useTaxonomies";
import { useVenues, useVenuesNearUser } from "@/src/hooks/useVenues";
import { getCurrentLocation, requestLocationPermission } from "@/src/services/locationService";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import { router, Stack } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, AppState, Dimensions, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

const { width } = Dimensions.get("window");

type MapMode = "events" | "venues" | "both";


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

// Custom map style to hide POIs (Points of Interest) and other default markers
const customMapStyle = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.attraction",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.government",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.place_of_worship",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.school",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.sports_complex",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [mapMode, setMapMode] = useState<MapMode>("events");
  const [region, setRegion] = useState<Region>({
    latitude: 41.9981,
    longitude: 21.4254,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<{ type: "event" | "venue"; data: Event[] | Venue } | null>(null);
  const [searchRadius, setSearchRadius] = useState(10000); // Default 10km in meters
  const [showRadiusControl, setShowRadiusControl] = useState(false);
  const [useProximitySearch, setUseProximitySearch] = useState(false); // Toggle for near me feature - starts OFF
  
  // Filter modal states
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [venueTypeModalVisible, setVenueTypeModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  
  // Selected filter values
  const [selectedGenres, setSelectedGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedVenueType, setSelectedVenueType] = useState<{ id: number; name: string } | null>(null);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null);

  // Fetch events and venues - use proximity hooks when user location available
  const { events: genericEvents, loading: eventsLoading, fetchEvents } = useEvents();
  const { venues: genericVenues, loading: venuesLoading, fetchVenues } = useVenues();
  const { events: nearbyEvents, loading: nearbyEventsLoading, fetchEventsNearUser } = useEventsNearUser();
  const { venues: nearbyVenues, loading: nearbyVenuesLoading, fetchVenuesNearUser } = useVenuesNearUser();
  const { genres } = useMusicGenres();
  const { venueTypes } = useVenueTypes();

  // Use proximity data when user location is available AND proximity search is enabled
  const events = (userLocation && useProximitySearch) ? nearbyEvents : genericEvents;
  const venues = (userLocation && useProximitySearch) ? nearbyVenues : genericVenues;

  // Get user location on mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const permissionStatus = await requestLocationPermission();
        if (!permissionStatus.granted) {
          console.log("Location permission denied, using default location");
          setLocationPermissionDenied(true);
          setLoadingLocation(false);
          return;
        }

        const location = await getCurrentLocation();
        if (location) {
          setUserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });
          setRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setLocationPermissionDenied(false);
        } else {
          console.log("Could not get location, using default location");
          setLocationPermissionDenied(true);
        }
      } catch (error) {
        console.log("Error getting user location, using default location:", error);
        setLocationPermissionDenied(true);
      } finally {
        setLoadingLocation(false);
      }
    };

    getUserLocation();
  }, []);

  // Function to retry location permission or open settings
  const handleEnableLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const permissionStatus = await requestLocationPermission();
      
      if (!permissionStatus.granted) {
        console.log("Location permission still denied");
        setLocationPermissionDenied(true);
        setLoadingLocation(false);
        
        // If we can't ask again, the user needs to go to settings
        if (!permissionStatus.canAskAgain) {
          Alert.alert(
            "Location Permission Required",
            "To use the 'Near Me' feature, please enable location access in your device settings.",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Open Settings",
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                }
              }
            ]
          );
        }
        return;
      }

      // Permission granted, get location
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        setLocationPermissionDenied(false);
        setShowLocationPrompt(false);
        
        // Center map on user location
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }, 1000);
        }
      } else {
        setLocationPermissionDenied(true);
      }
    } catch (error) {
      console.log("Error enabling location:", error);
      setLocationPermissionDenied(true);
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  // Check location permission when app comes to foreground (user returns from settings)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active' && locationPermissionDenied) {
        // User returned to app, check if they enabled location in settings
        try {
          const location = await getCurrentLocation();
          if (location) {
            setUserLocation({
              latitude: location.latitude,
              longitude: location.longitude,
            });
            setRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
            setLocationPermissionDenied(false);
            setShowLocationPrompt(false);
            
            // Center map on user location
            if (mapRef.current) {
              mapRef.current.animateToRegion({
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }, 1000);
            }
          }
        } catch (error) {
          console.log("Could not get location on app resume:", error);
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [locationPermissionDenied]);

  // Hide bottom card when map mode changes
  useEffect(() => {
    setSelectedMarker(null);
  }, [mapMode]);

  // Fetch data when location, radius or filters change (with debouncing)
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        // Prepare common filter parameters for events
        const eventFilters = {
          musicGenre: selectedGenres.length > 0 ? selectedGenres[0].id : undefined,
          dateFilter: selectedDateRange ? getDateFilterType(selectedDateRange.label) : undefined,
          startDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.from || '') : undefined,
          endDate: selectedDateRange?.label === "Custom Range" ? convertFormattedDateToISO(selectedDateRange?.to || '') : undefined,
        };

        // Use proximity-based APIs when user location is available AND proximity search is enabled
        if (userLocation && useProximitySearch) {
          // Pass radius directly in meters to API
          const radiusInMeters = searchRadius;
          
          if (mapMode === "events" || mapMode === "both") {
            const eventsResponse = await fetchEventsNearUser(
              userLocation.latitude,
              userLocation.longitude,
              radiusInMeters,
              eventFilters
            );
            console.log('Events response:', eventsResponse);
          }
          if (mapMode === "venues" || mapMode === "both") {
            const venuesResponse = await fetchVenuesNearUser(
              userLocation.latitude,
              userLocation.longitude,
              radiusInMeters
            );
            console.log('Venues response:', venuesResponse);
          }
        } else {
          // Fallback to generic filter endpoints with map region
          const baseFilters = {
            lat: region.latitude,
            lng: region.longitude,
            radius: 50,
            limit: 100,
          };

          if (mapMode === "events" || mapMode === "both") {
            await fetchEvents({
              ...baseFilters,
              ...eventFilters,
            });
          }
          if (mapMode === "venues" || mapMode === "both") {
            await fetchVenues({
              ...baseFilters,
              venueType: selectedVenueType?.id,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    if (!loadingLocation) {
      // Debounce radius changes to avoid excessive API calls
      const debounceTimer = setTimeout(() => {
        fetchMapData();
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [userLocation, useProximitySearch, searchRadius, region, mapMode, selectedGenres, selectedVenueType, selectedDateRange, loadingLocation]);

  const centerOnUserLocation = useCallback(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  }, [userLocation]);

  const eventsWithCoordinates = events.filter(
    (event): event is Event & { lat: string; lng: string } =>
      event.lat !== undefined && event.lng !== undefined
  );

  const venuesWithCoordinates = venues.filter(
    (venue): venue is Venue & { lat: number; lng: number } =>
      venue.lat !== undefined && venue.lng !== undefined
  );

  // Group events by venue location
  const groupedEvents = eventsWithCoordinates.reduce((acc, event) => {
    const key = `${event.lat},${event.lng}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const handleMarkerPress = (type: "event" | "venue", data: Event[] | Venue) => {
    setSelectedMarker({ type, data });
  };

  const handleCardPress = (type: "event" | "venue", id: number) => {
    setSelectedMarker(null);
    if (type === "event") {
      router.push(`/event-detail?id=${id}`);
    } else {
      router.push(`/venue-detail?id=${id}`);
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      if (!dateString) return 'Date TBA';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date TBA';
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch (error) {
      console.log('Error formatting date:', error);
      return 'Date TBA';
    }
  };

  const formatRadius = (radiusInMeters: number): string => {
    if (radiusInMeters < 1000) {
      return `${radiusInMeters}m`;
    } else if (radiusInMeters < 100000) {
      return `${(radiusInMeters / 1000).toFixed(1)}km`;
    } else {
      return `${Math.round(radiusInMeters / 1000)}km`;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {/* Header - Transparent overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Map</Text>
          <View style={{ width: 40 }} />
        </View>

      {/* Map Mode Selector & Filters */}
      <View style={styles.controlsContainer}>
        {/* Mode Selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity
            style={[styles.modeButton, mapMode === "events" && styles.modeButtonActive]}
            onPress={() => setMapMode("events")}
          >
            <Text style={[styles.modeButtonText, mapMode === "events" && styles.modeButtonTextActive]}>
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, mapMode === "venues" && styles.modeButtonActive]}
            onPress={() => setMapMode("venues")}
          >
            <Text style={[styles.modeButtonText, mapMode === "venues" && styles.modeButtonTextActive]}>
              Venues
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filters Row */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {mapMode === "events" && (
            <>
              <TouchableOpacity
                style={[styles.filterChip, selectedGenres.length > 0 && styles.filterChipActive]}
                onPress={() => setGenreModalVisible(true)}
              >
                <IconSymbol name="music.note.list" size={16} color={selectedGenres.length > 0 ? "#fff" : "#666"} />
                <Text style={[styles.filterChipText, selectedGenres.length > 0 && styles.filterChipTextActive]}>
                  {selectedGenres.length > 0 ? selectedGenres[0].name : "Genre"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterChip, selectedDateRange && styles.filterChipActive]}
                onPress={() => setDateModalVisible(true)}
              >
                <IconSymbol name="calendar" size={16} color={selectedDateRange ? "#fff" : "#666"} />
                <Text style={[styles.filterChipText, selectedDateRange && styles.filterChipTextActive]}>
                  {selectedDateRange?.label || "Date"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          {mapMode === "venues" && (
            <TouchableOpacity
              style={[styles.filterChip, selectedVenueType && styles.filterChipActive]}
              onPress={() => setVenueTypeModalVisible(true)}
            >
              <IconSymbol name="building.2" size={16} color={selectedVenueType ? "#fff" : "#666"} />
              <Text style={[styles.filterChipText, selectedVenueType && styles.filterChipTextActive]}>
                {selectedVenueType?.name || "Venue Type"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Clear all filters */}
          {(selectedGenres.length > 0 || selectedVenueType || selectedDateRange) && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={() => {
                setSelectedGenres([]);
                setSelectedVenueType(null);
                setSelectedDateRange(null);
              }}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Location Prompt - Show when location is not available */}
      {!userLocation && !loadingLocation && showLocationPrompt && locationPermissionDenied && (
        <View style={styles.locationPromptContainer}>
          <View style={styles.locationPromptContent}>
            <IconSymbol name="location.slash.fill" size={20} color="#FF9800" />
            <View style={styles.locationPromptTextContainer}>
              <Text style={styles.locationPromptTitle}>Enable Location</Text>
              <Text style={styles.locationPromptSubtitle}>
                Turn on location to discover events and venues near you
              </Text>
            </View>
          </View>
          <View style={styles.locationPromptActions}>
            <TouchableOpacity
              style={styles.locationPromptDismiss}
              onPress={() => setShowLocationPrompt(false)}
            >
              <Text style={styles.locationPromptDismissText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.locationPromptButton}
              onPress={handleEnableLocation}
            >
              <IconSymbol name="location.fill" size={14} color="#fff" />
              <Text style={styles.locationPromptButtonText}>Enable</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Radius Control - Only show when user location is available */}
      {userLocation && (
        <View style={styles.radiusControlContainer}>
          {useProximitySearch ? (
            <>
              <View style={styles.radiusHeaderRow}>
                <TouchableOpacity
                  style={styles.radiusToggleButton}
                  onPress={() => setShowRadiusControl(!showRadiusControl)}
                >
                  <IconSymbol name="location.circle" size={16} color="#5271FF" />
                  <Text style={styles.radiusToggleText}>
                    Near Me: {formatRadius(searchRadius)}
                  </Text>
                  <IconSymbol 
                    name={showRadiusControl ? "chevron.up" : "chevron.down"} 
                    size={14} 
                    color="#666" 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.disableNearMeButton}
                  onPress={() => {
                    setUseProximitySearch(false);
                    setShowRadiusControl(false);
                  }}
                >
                  <Text style={styles.disableNearMeText}>Disable</Text>
                </TouchableOpacity>
              </View>
              
              {showRadiusControl && (
                <View style={styles.radiusSliderContainer}>
                  <View style={styles.radiusSliderWrapper}>
                    <Text style={styles.radiusSliderLabel}>Search Radius</Text>
                    <View style={styles.radiusSliderRow}>
                      <Text style={styles.radiusSliderMinLabel}>5m</Text>
                      <Slider
                        style={styles.radiusSlider}
                        minimumValue={5}
                        maximumValue={20000}
                        value={searchRadius}
                        onValueChange={setSearchRadius}
                        minimumTrackTintColor="#5271FF"
                        maximumTrackTintColor="#e0e0e0"
                        thumbTintColor="#5271FF"
                        step={1}
                      />
                      <Text style={styles.radiusSliderMaxLabel}>20km</Text>
                    </View>
                    <Text style={styles.radiusSliderValue}>
                      Current: {formatRadius(searchRadius)}
                    </Text>
                  </View>
                  <Text style={styles.radiusResultsHint}>
                    {nearbyEventsLoading || nearbyVenuesLoading ? 'Searching...' : 
                     `Found ${events.length} events, ${venues.length} venues`}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <TouchableOpacity
              style={styles.enableNearMeButton}
              onPress={() => {
                setUseProximitySearch(true);
                setShowRadiusControl(true); // Auto-expand radius controls when enabling
              }}
            >
              <IconSymbol name="location.fill" size={16} color="#5271FF" />
              <View style={styles.enableNearMeTextContainer}>
                <Text style={styles.enableNearMeText}>Enable Near Me</Text>
                <Text style={styles.enableNearMeSubtext}>Search by distance from your location</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Map */}
      <View style={styles.mapContainer}>
        {loadingLocation ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5271FF" />
            <Text style={styles.loadingText}>Loading map...</Text>
          </View>
        ) : (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            customMapStyle={customMapStyle}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            onPress={() => setSelectedMarker(null)}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
          >
            {/* Event Markers */}
            {mapMode === "events" &&
              Object.entries(groupedEvents).map(([key, eventGroup]) => {
                const [lat, lng] = key.split(',');
                return (
                  <Marker
                    key={`event-${key}`}
                    coordinate={{
                      latitude: parseFloat(lat),
                      longitude: parseFloat(lng),
                    }}
                    onPress={() => handleMarkerPress("event", eventGroup)}
                    title={eventGroup[0].name}
                    pinColor="#FF3B30"
                  />
                );
              })}

            {/* Venue Markers */}
            {mapMode === "venues" &&
              venuesWithCoordinates.map((venue) => (
                <Marker
                  key={`venue-${venue.id}`}
                  coordinate={{
                    latitude: venue.lat,
                    longitude: venue.lng,
                  }}
                  onPress={() => handleMarkerPress("venue", venue)}
                  pinColor="#FF3B30"
                  title={venue.name}
                />
              ))}
          </MapView>
        )}

        {/* Center on User Location Button - Only show if we have user location */}
        {userLocation && !loadingLocation && (
          <TouchableOpacity
            style={styles.locationButton}
            onPress={centerOnUserLocation}
          >
            <IconSymbol name="location.fill" size={24} color="#1A1A2E" />
          </TouchableOpacity>
        )}

        {/* Loading Indicator */}
        {(eventsLoading || venuesLoading) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#5271FF" />
          </View>
        )}
      </View>

      {/* Bottom Card */}
      {selectedMarker && (
        <View style={styles.bottomCard}>
          {selectedMarker.type === "event" ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
            >
              {(selectedMarker.data as Event[]).map((event) => {
                if (!event || !event.id) return null;
                return (
                  <TouchableOpacity
                    key={event.id}
                    onPress={() => handleCardPress("event", event.id)}
                    activeOpacity={0.7}
                    style={styles.card}
                  >
                    <Image
                      source={{ uri: event.image || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" }}
                      style={styles.cardImage}
                      contentFit="cover"
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {event.name || 'Untitled Event'}
                      </Text>
                      <View style={styles.cardRow}>
                        <IconSymbol name="calendar" size={14} color="#666" />
                        <Text style={styles.cardText}>{formatEventDate(event.event_start)}</Text>
                      </View>
                    {event.venue_name && (
                      <View style={styles.cardRow}>
                        <IconSymbol name="building.2" size={14} color="#2FCC67" />
                        <Text style={styles.cardVenueText} numberOfLines={1}>{event.venue_name}</Text>
                      </View>
                    )}
                    {event.city && (
                      <View style={styles.cardRow}>
                        <IconSymbol name="location" size={14} color="#666" />
                        <Text style={styles.cardText}>{event.city}</Text>
                      </View>
                    )}
                    {event.music_genres && event.music_genres.length > 0 && (
                      <View style={styles.tagsContainer}>
                        {event.music_genres.slice(0, 2).map((genre, index) => (
                          <View key={`${event.id}-genre-${index}`} style={styles.eventTag}>
                            <Text style={styles.tagText}>{genre}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                );
              })}
        </ScrollView>
          ) : (
            <View style={styles.cardsContainer}>
              <TouchableOpacity
                onPress={() => handleCardPress("venue", (selectedMarker.data as Venue).id)}
                activeOpacity={0.7}
                style={styles.venueCard}
              >
                <Image
                  source={{ 
                    uri: (selectedMarker.data as Venue).banner?.url || 
                         (selectedMarker.data as Venue).image || 
                         "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" 
                  }}
                  style={styles.cardImage}
                  contentFit="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {(selectedMarker.data as Venue).name || 'Untitled Venue'}
                  </Text>
                  {(selectedMarker.data as Venue).type && (
                    <View style={styles.cardRow}>
                      <IconSymbol name="building.2" size={14} color="#4ECDC4" />
                      <Text style={styles.cardVenueTypeText}>
                        {(selectedMarker.data as Venue).type}
                      </Text>
                    </View>
                  )}
                  {(selectedMarker.data as Venue).city && (
                    <View style={styles.cardRow}>
                      <IconSymbol name="location" size={14} color="#666" />
                      <Text style={styles.cardText}>{(selectedMarker.data as Venue).city}</Text>
                    </View>
                  )}
                  {(selectedMarker.data as Venue).address && (
                    <Text style={styles.cardAddress} numberOfLines={2}>
                      {(selectedMarker.data as Venue).address}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Filter Modals */}
      <GenreFilter
        visible={genreModalVisible}
        onClose={() => setGenreModalVisible(false)}
        onSelect={setSelectedGenres}
        selectedGenres={selectedGenres}
      />

      <VenueTypeFilter
        visible={venueTypeModalVisible}
        onClose={() => setVenueTypeModalVisible(false)}
        onSelect={setSelectedVenueType}
        selectedVenueType={selectedVenueType}
      />

      <DateFilter
        visible={dateModalVisible}
        onClose={() => setDateModalVisible(false)}
        onSelect={setSelectedDateRange}
        selectedDateRange={selectedDateRange}
      />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerOverlay: {
    paddingTop: 50,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#5271FF",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  controlsContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginTop: 100,
  },
  modeSelector: {
    flexDirection: "row",
    padding: 12,
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modeButtonActive: {
    backgroundColor: "#5271FF",
    borderColor: "#5271FF",
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  modeButtonTextActive: {
    color: "#fff",
  },
  filtersScroll: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#5271FF",
    borderColor: "#5271FF",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  locationPromptContainer: {
    backgroundColor: "#FFF3E0",
    borderBottomWidth: 1,
    borderBottomColor: "#FFB74D",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationPromptContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  locationPromptTextContainer: {
    flex: 1,
  },
  locationPromptTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E65100",
    marginBottom: 4,
  },
  locationPromptSubtitle: {
    fontSize: 12,
    color: "#5D4037",
    lineHeight: 16,
  },
  locationPromptActions: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
  },
  locationPromptDismiss: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  locationPromptDismissText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  locationPromptButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#FF9800",
  },
  locationPromptButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  radiusControlContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  radiusHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radiusToggleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  radiusToggleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  disableNearMeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FFE5E5",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  disableNearMeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B6B",
  },
  enableNearMeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F0F4FF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5271FF",
  },
  enableNearMeTextContainer: {
    flex: 1,
  },
  enableNearMeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5271FF",
    marginBottom: 2,
  },
  enableNearMeSubtext: {
    fontSize: 11,
    color: "#7B91FF",
  },
  radiusSliderContainer: {
    paddingTop: 8,
  },
  radiusSliderWrapper: {
    marginBottom: 8,
  },
  radiusSliderLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  radiusSliderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 4,
  },
  radiusSliderMinLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    minWidth: 30,
  },
  radiusSlider: {
    flex: 1,
    height: 40,
  },
  radiusSliderMaxLabel: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
    minWidth: 40,
  },
  radiusSliderValue: {
    fontSize: 12,
    color: "#5271FF",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 6,
  },
  radiusStepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  radiusStepLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "500",
  },
  radiusResultsHint: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  eventMarker: {
    width: 37,
    height: 37,
    borderRadius: 20,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  venueMarker: {
    width: 37,
    height: 37,
    borderRadius: 20,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#1A1A2E",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  locationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationUnavailableBox: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "#FFF9E6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFD700",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationUnavailableText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    paddingBottom: 40,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    maxHeight: 240,
  },
  cardsContainer: {
    padding: 8,
    gap: 12,
  },
  card: {
    width: width - 80,
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  venueCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardImage: {
    width: 100,
    height: 140,
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A2E",
    marginBottom: 6,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 12,
    color: "#666",
  },
  cardVenueText: {
    fontSize: 12,
    color: "#2FCC67",
    fontWeight: "600",
    flex: 1,
  },
  cardVenueTypeText: {
    fontSize: 12,
    color: "#4ECDC4",
    fontWeight: "600",
  },
  cardAddress: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 4,
  },
  eventTag: {
    backgroundColor: "#761CBC",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
});
