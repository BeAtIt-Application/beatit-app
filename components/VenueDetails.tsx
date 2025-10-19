import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, Linking, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { Venue } from '@/src/api/venueApi';

interface VenueDetailsProps {
  venue: Venue;
}

export const VenueDetails: React.FC<VenueDetailsProps> = ({ venue }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Get a random banner image from the gallery
  const getBannerImage = () => {
    if (!venue.images || venue.images.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * venue.images.length);
    const image = venue.images[randomIndex];
    return image.banner?.url || image.card?.url || image.thumbnail?.url;
  };

  const bannerImageUrl = getBannerImage();

  // Debug: Log working hours to see the actual structure
  React.useEffect(() => {
    if (venue.working_hours) {
      console.log('Working hours data:', venue.working_hours);
    }
  }, [venue.working_hours]);

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
    if (!venue.working_hours || venue.working_hours.length === 0) return false;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
    
    const todayHours = venue.working_hours.find(hours => 
      hours.day_of_week === currentDay
    );
    
    if (!todayHours || todayHours.is_closed) return false;
    
    const formatTimeToMinutes = (time: any) => {
      if (!time) return null;
      if (time.hour !== undefined && time.minute !== undefined) {
        return time.hour * 60 + time.minute;
      }
      return null;
    };
    
    const openMinutes = formatTimeToMinutes(todayHours.opens_at);
    const closeMinutes = formatTimeToMinutes(todayHours.closes_at);
    
    if (openMinutes === null || closeMinutes === null) return false;
    
    return currentTime >= openMinutes && currentTime <= closeMinutes;
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

  const handleHeartPress = () => {
    // Handle heart press logic here
    console.log('Heart pressed for venue:', venue.name);
  };

  return (
    <View className="flex-1">
        {/* Hero Section with Banner and Logo */}
        <View className="relative">
          {/* Banner Image Background */}
          {bannerImageUrl && (
            <Image
              source={{ uri: bannerImageUrl }}
              className="w-full h-64"
              resizeMode="cover"
            />
          )}
          
          {/* Gradient Overlay */}
          <View className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            activeOpacity={0.8}
            className="absolute top-12 left-3 bg-white/90 p-2 rounded-full"
          >
            <IconSymbol name="chevron.left" size={16} color="#000" />
          </TouchableOpacity>
          
          {/* Heart Favorite Button */}
          <TouchableOpacity 
            onPress={handleHeartPress}
            activeOpacity={0.8}
            className="absolute top-12 right-3 bg-white/90 p-2 rounded-full"
          >
            <IconSymbol name="heart" size={16} color="#FF6B6B" />
          </TouchableOpacity>
          
          {/* Venue Info Card */}
          <View className="bg-white rounded-t-3xl p-5 ">
            <View className="flex justify-start items-center ">
              {venue.logo && (
                <Image
                  source={{ 
                    uri: typeof venue.logo === 'string' 
                      ? venue.logo 
                      : (venue.logo as any)?.url || (venue.logo as any)?.[0]
                  }}
                  className="w-32 h-32 rounded-full bg-white p-2 mb-4 shadow-lg absolute top-[-100px]"
                  resizeMode="contain"
                />
              )}
              <Text className="text-3xl font-bold text-[#22954B] mb-2 mt-8">
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
                      className="w-48 h-32 rounded-xl"
                      resizeMode="cover"
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
              resizeMode="contain"
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
