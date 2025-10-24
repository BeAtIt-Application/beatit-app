import { StarRating } from '@/components/StarRating';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFavorites } from '@/src/context/FavoritesContext';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Venue } from '@/src/api/venueApi';
import { useRateVenue } from '@/src/hooks/useVenues';

interface VenueDetailsProps {
  venue: Venue;
}

export const VenueDetails: React.FC<VenueDetailsProps> = ({ venue }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRating, setCurrentRating] = useState(venue.current_user_rating || 0);
  const [averageRating, setAverageRating] = useState(venue.average_rating || 0);
  const [totalRatings, setTotalRatings] = useState(venue.total_ratings || 0);
  const [isToggling, setIsToggling] = useState(false);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const { rateVenue, loading: ratingLoading } = useRateVenue();
  const { toggleVenueFavorite, isVenueFavorite } = useFavorites();
  
  const isFavorite = isVenueFavorite(venue.id);

  // Get the banner image from the venue's root banner field
  const getBannerImage = () => {
    // First priority: Use the root-level banner field
    if (venue.banner?.url) {
      return venue.banner.url;
    }
    
    // Fallback: Use the first image's banner URL from images array
    if (venue.images && venue.images.length > 0) {
      const firstImage = venue.images[0];
      if (firstImage.banner?.url) {
        return firstImage.banner.url;
      }
      return firstImage.card?.url || firstImage.thumbnail?.url;
    }
    
    // Final fallback: placeholder image
    return "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  };

  const bannerImageUrl = getBannerImage();

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const formatWorkingHours = (hours: any) => {
    if (!hours || hours.is_closed) return 'Closed';
    
    const formatTime = (time: any) => {
      if (!time) return '';
      
      // Handle object format from API
      if (typeof time === 'object' && time !== null) {
        if (time.hour !== undefined && time.minute !== undefined) {
          return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
        }
        // Handle other possible object structures
        if (time.hours !== undefined && time.minutes !== undefined) {
          return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
        }
      }
      
      // Handle string format
      if (typeof time === 'string') {
        return time;
      }
      
      return '';
    };

    const openTime = formatTime(hours.opens_at);
    const closeTime = formatTime(hours.closes_at);
    
    // If both open and close times are null/undefined, show as closed
    if (!openTime && !closeTime) {
      return 'Closed';
    }
    
    // If only one time is available, show what we have
    if (openTime && closeTime) {
      return `${openTime} - ${closeTime}`;
    } else if (openTime) {
      return `Opens at ${openTime}`;
    } else if (closeTime) {
      return `Closes at ${closeTime}`;
    }
    
    return 'Hours not available';
  };

  const isCurrentlyOpen = () => {
    if (!venue.working_hours || venue.working_hours.length === 0) {
      return false;
    }
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    
    
    const todayHours = venue.working_hours.find(hours => 
      hours.day_of_week === currentDay
    );
    
    if (!todayHours || todayHours.is_closed) {
      return false;
    }
    
    const formatTimeToMinutes = (time: any) => {
      if (!time) return null;
      // Check for both 'hours'/'minutes' (API format) and 'hour'/'minute' (alternative format)
      const hours = time.hours !== undefined ? time.hours : time.hour;
      const minutes = time.minutes !== undefined ? time.minutes : time.minute;
      
      if (hours !== undefined && minutes !== undefined) {
        return hours * 60 + minutes;
      }
      return null;
    };
    
    const openMinutes = formatTimeToMinutes(todayHours.opens_at);
    const closeMinutes = formatTimeToMinutes(todayHours.closes_at);
    
    if (openMinutes === null || closeMinutes === null) return false;
    
    // Handle closing times that go past midnight (e.g., open 16:58, close 01:15 next day)
    let isOpen = false;
    if (closeMinutes < openMinutes) {
      // Closes after midnight - venue is open if current time is after opening OR before closing
      isOpen = currentTime >= openMinutes || currentTime <= closeMinutes;
    } else {
      // Normal hours - venue is open if current time is between opening and closing
      isOpen = currentTime >= openMinutes && currentTime <= closeMinutes;
    }

    return isOpen;
  };

  const handlePhoneCall = () => {
    if (venue.phone_number) {
      Linking.openURL(`tel:${venue.phone_number}`);
    }
  };

  const handleEmail = () => {
    if (venue.email) {
      Linking.openURL(`mailto:${venue.email}`);
    }
  };

  const handleLocation = () => {
    const url = `https://maps.google.com/?q=${venue.lat},${venue.lng}`;
    Linking.openURL(url);
  };

  const handleHeartPress = async () => {
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

  const handleRatingChange = async (rating: number) => {
    try {
      console.log('Rating venue:', venue.id, 'with rating:', rating);
      const response = await rateVenue(venue.id, rating);
      console.log('Rating response:', response);
      setCurrentRating(rating);
      setAverageRating(response.average_rating);
      setTotalRatings(response.total_ratings);
      Alert.alert('Success', `You rated this venue ${rating} star${rating > 1 ? 's' : ''}!`);
    } catch (error) {
      console.error('Rating error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit rating. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View className="flex-1">
        {/* Hero Section with Banner and Logo */}
        <View className="relative">
          {/* Banner Image Background */}
          <Image
            source={{ uri: bannerImageUrl }}
            style={{ width: '100%', height: 256 }}
            contentFit="cover"
            placeholder="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
            transition={200}
          />
          
          {/* Gradient Overlay */}
          <View className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          
          {/* Back Button */}
          <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-5 w-10 h-10 bg-white rounded-full justify-center items-center shadow-lg"
        >
          <IconSymbol name="chevron.left" size={20} color="black" />
        </TouchableOpacity>
          
          {/* Heart Favorite Button */}
          <TouchableOpacity 
            onPress={handleHeartPress}
            activeOpacity={0.8}
            className="absolute top-12 right-5 bg-white/90 p-2 rounded-full h-10 w-10 justify-center items-center"
            disabled={isToggling}
          >
            <IconSymbol 
              name="heart" 
              size={16} 
              color={isFavorite ? "#FF6B6B" : "#FFFFFF"} 
            />
          </TouchableOpacity>
          
          {/* Venue Info Card */}
          <View className="bg-white rounded-t-3xl p-5 ">
            <View className="flex justify-start items-center ">
              {venue.logo && (
                <View className="bg-white rounded-full p-2 shadow-lg absolute top-[-100px]">
                  <Image
                    source={{ 
                      uri: typeof venue.logo === 'string' 
                        ? venue.logo 
                        : (venue.logo as any)?.url || (venue.logo as any)?.[0]
                    }}
                    placeholder="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                    transition={200}
                    style={{ width: 120, height: 120, borderRadius: 60 }}
                    contentFit="cover"
                  />
                </View>
              )}
              <Text className="text-3xl font-bold text-[#22954B] mb-2 mt-10">
                {venue.name}
              </Text>
            </View>
            <Text className="text-lg text-gray-600 mb-2">{venue.type_label || venue.type || 'Venue'}</Text>
            <View className="flex-row items-center mb-4">
              <IconSymbol name="location" size={16} color="#666" />
              <Text className="text-gray-500 ml-1 flex-1">{venue.address || venue.name}, {venue.city}</Text>
            </View>
          </View>
        </View>

      {/* Content */}
      <View className="flex-1 p-5">
        {/* About Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#22954B] mb-3">
            About {venue.name}
          </Text>
          <Text className="text-gray-600 leading-6">
            {venue.bio || 'No description available for this venue.'}
          </Text>
        </View>

        {/* Image Gallery */}
        {venue.images && venue.images.length > 0 && (
          <View className="mb-6">
            <Text className="text-xl font-bold text-[#22954B] mb-3">
              Gallery
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {venue.images.map((image, index) => {
                const imageUrl = image.card?.url || image.banner?.url || image.thumbnail?.url;
                return (
                  <TouchableOpacity 
                    key={image.id || index} 
                    className="mr-3"
                    onPress={() => imageUrl && openImageModal(imageUrl)}
                  >
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ width: 192, height: 128, borderRadius: 12 }}
                      contentFit="cover"
                      placeholder="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                      transition={200}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Contact Information */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#22954B] mb-4">
            Contact Information
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            {venue.phone_number && (
              <TouchableOpacity 
                onPress={handlePhoneCall}
                className="flex-row items-center mb-3"
              >
                <IconSymbol name="phone" size={16} color="#666" />
                <Text className="text-gray-600 ml-2 text-blue-500 underline">{venue.phone_number}</Text>
              </TouchableOpacity>
            )}
            {venue.email && (
              <TouchableOpacity 
                onPress={handleEmail}
                className="flex-row items-center mb-3"
              >
                <IconSymbol name="envelope" size={16} color="#666" />
                <Text className="text-gray-600 ml-2 text-blue-500 underline">{venue.email}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={handleLocation}
              className="flex-row items-center"
            >
              <IconSymbol name="location" size={16} color="#666" />
              <Text className="text-gray-600 ml-2 text-blue-500 underline">View on Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Working Hours */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-[#22954B]">
              Working Hours
            </Text>
            {/* Open/Closed Status Flag */}
            <View className={`flex-row items-center px-3 py-1 rounded-full ${isCurrentlyOpen() ? 'bg-green-100' : 'bg-red-100'}`}>
              <View className={`w-2 h-2 rounded-full mr-2 ${isCurrentlyOpen() ? 'bg-green-500' : 'bg-red-500'}`} />
              <Text className={`text-sm font-medium ${isCurrentlyOpen() ? 'text-green-700' : 'text-red-700'}`}>
                {isCurrentlyOpen() ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          </View>
          <View className="bg-gray-50 rounded-xl p-4">
            {venue.working_hours?.map((hours, index) => (
              <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                <Text className="text-gray-700 font-medium">{hours.day_of_week}</Text>
                <Text className="text-gray-600">{formatWorkingHours(hours)}</Text>
              </View>
            ))}
          </View>
        </View>
         
        {/* Rating Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-lg font-semibold text-gray-800">Rating</Text>
            {totalRatings > 0 && (
              <Text className="text-sm text-gray-500">
                {totalRatings} rating{totalRatings > 1 ? 's' : ''}
              </Text>
            )}
          </View>
          
          {/* Average Rating Display */}
          {averageRating > 0 && (
            <View className="mb-3">
              <StarRating 
                rating={averageRating} 
                size={18} 
                showText={true}
                interactive={false}
              />
            </View>
          )}
          
          {/* User Rating Section */}
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              {currentRating > 0 ? 'Your Rating:' : 'Rate this venue:'}
            </Text>
            <StarRating 
              rating={currentRating} 
              onRatingChange={handleRatingChange}
              interactive={true}
              size={24}
              disabled={ratingLoading}
            />
            {ratingLoading && (
              <Text className="text-sm text-gray-500 mt-2">Submitting rating...</Text>
            )}
          </View>
        </View>
        
      </View>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/90 justify-center items-center"
          activeOpacity={1}
          onPress={closeImageModal}
        >
          {/* Close Button */}
          <TouchableOpacity
            onPress={closeImageModal}
            className="absolute top-12 right-5 w-12 h-12 bg-black/50 rounded-full justify-center items-center z-20"
            style={{ elevation: 10 }}
          >
            <IconSymbol name="xmark" size={24} color="white" />
          </TouchableOpacity>

          {/* Full Screen Image */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: screenWidth * 0.9,
                height: screenHeight * 0.8,
              }}
              placeholder="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
              transition={200}
              contentFit="contain"
            />
          )}

          {/* Tap to close hint */}
          <View className="absolute bottom-12 left-0 right-0 items-center">
            <Text className="text-white/70 text-sm">Tap anywhere to close</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
