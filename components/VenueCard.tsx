import { IconSymbol } from "@/components/ui/icon-symbol";
import { useFavorites } from "@/src/context/FavoritesContext";
import { Image } from "expo-image";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface VenueCardProps {
  venue: {
    id: number;
    name: string;
    city: string;
    image: string;
    banner?: {
      id: number;
      url: string;
      srcset: string;
      webp: string[];
    };
    stars?: number;
    venueTypes?: string[];
    average_rating?: number;
    total_ratings?: number;
    is_favourite?: boolean;
  };
  onPress?: () => void;
  fromHorizontalList?: boolean;
  hideLikeButton?: boolean;
}

const VenueCardComponent: React.FC<VenueCardProps> = ({ venue, onPress, fromHorizontalList, hideLikeButton }) => {
  const [isToggling, setIsToggling] = useState(false);
  const { toggleVenueFavorite, isVenueFavorite, favoriteVenues } = useFavorites();
  
  // Use context first, fallback to venue prop for initial state
  // Accessing favoriteVenues directly forces re-render when Context updates
  const isFavorite = favoriteVenues.has(venue.id) || venue.is_favourite || false;

  const handleHeartPress = async (e: any) => {
    e.stopPropagation();
    
    if (isToggling) return; // Prevent multiple rapid clicks
    
    try {
      setIsToggling(true);
      await toggleVenueFavorite(venue.id);
    } catch (error) {
      console.error("Error toggling venue favorite:", error);
      Alert.alert("Error", "Failed to update favorite status");
    } finally {
      setIsToggling(false);
    }
  };

  // Get the banner image - prioritize banner.url over image (thumbnail)
  const getCardImage = () => {
    // Use banner if available (from venues list API when it includes banner)
    if (venue.banner?.url) {
      return venue.banner.url;
    }
    // Fallback to image (thumbnail) from venues list API
    return venue.image;
  };

  const cardImageUrl = getCardImage();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <IconSymbol key={i} name="star.fill" size={14} color="#FFD700" />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <IconSymbol key={i} name="star.leadinghalf.filled" size={14} color="#FFD700" />
        );
      } else {
        // Empty star
        stars.push(
          <IconSymbol key={i} name="star" size={14} color="#D1D5DB" />
        );
      }
    }
    
    return stars;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      className={"mb-4 " + (fromHorizontalList ? "max-w-[310] w-[310] mr-4" : "max-w-full w-full")}
    >
      <View className="bg-white rounded-2xl shadow-sm">
        {/* Venue Image */}
        <View className="relative">
          <Image
            source={{ uri: cardImageUrl }}
            style={{ width: "100%", height: 200, borderTopRightRadius: 16, borderTopLeftRadius: 16 }}
            contentFit="cover"
            placeholder="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            transition={200}
          />

          {!hideLikeButton && (
            <TouchableOpacity 
              onPress={handleHeartPress}
              activeOpacity={0.7}
              className="absolute top-3 right-2.5 bg-white/90 p-2 rounded-full h-10 w-10 justify-center items-center"
              disabled={isToggling}
            >
              <IconSymbol 
                name={"heart"} 
                size={18} 
                color={isFavorite ? "#FF6B6B" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Venue Details */}
        <View className="p-4">
          <Text className="text-base font-bold text-[#1A1A2E] mb-2 leading-5 text-lg">
            {venue.name}
          </Text>
          {(venue.average_rating !== undefined && venue.average_rating > 0) && (
            <View className="flex-row items-center gap-1 mb-1">
              {renderStars(venue.average_rating)}
              <Text className="text-sm font-semibold text-gray-700 ml-1">
                {venue.average_rating.toFixed(1)}
              </Text>
              {venue.total_ratings && venue.total_ratings > 0 && (
                <Text className="text-xs text-gray-500 ml-1">
                  ({venue.total_ratings})
                </Text>
              )}
            </View>
          )}
          <View className="flex-row items-center mb-3">
            <IconSymbol name="location" size={14} color="#666" />
            <Text className="text-md text-gray-600 ml-1">{venue.city}</Text>
          </View>
          {venue.venueTypes && (
            <View className="flex-row gap-2">
              {venue.venueTypes.map((type, index) => (
                <View key={index} className="bg-[#2FCC67] px-2 py-1 rounded-2xl">
                  <Text className="text-xs text-white font-medium">{type}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Removed React.memo to allow re-renders when Context state changes
export const VenueCard = VenueCardComponent;
VenueCard.displayName = 'VenueCard';
