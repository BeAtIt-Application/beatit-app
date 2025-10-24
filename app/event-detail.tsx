import { IconSymbol } from "@/components/ui/icon-symbol";
import { useEvent, useToggleEventStatus } from "@/src/hooks/useEvents";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// Separate memoized VoteButtons component
interface VoteButtonsProps {
  localVoteData: {
    current_user_vote: 'interested' | 'going' | null;
    interested_percentage: number;
    going_percentage: number;
  } | null;
  toggleLoading: boolean;
  onToggleStatus: (status: 'interested' | 'going') => void;
}

const VoteButtons = React.memo<VoteButtonsProps>(({ localVoteData, toggleLoading, onToggleStatus }) => {
  if (!localVoteData) return null;

  return (
    <View className="flex-row gap-4 mb-8">
      <TouchableOpacity
        onPress={() => onToggleStatus('going')}
        disabled={toggleLoading || localVoteData.current_user_vote === 'going'}
        activeOpacity={1}
        className={`flex-1 py-4 rounded-xl ${
          localVoteData.current_user_vote === 'going' ? 'bg-[#2FCC67] opacity-70' : 'bg-[#2FCC67]'
        }`}
      >
        <Text className={`text-center font-bold text-lg ${
          localVoteData.current_user_vote === 'going' ? 'text-white' : 'text-gray-800'
        }`}>
          {toggleLoading ? 'Loading...' : `GOING ${localVoteData.going_percentage}%`}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onToggleStatus('interested')}
        disabled={toggleLoading  || localVoteData.current_user_vote === 'interested'}
        activeOpacity={1}
        className={`flex-1 py-4 rounded-xl ${
          localVoteData.current_user_vote === 'interested' ? 'bg-[#FFCC00] opacity-70' : 'bg-[#FFCC00]'
        }`}
      >
        <Text className={`text-center font-bold text-lg ${
          localVoteData.current_user_vote === 'interested' ? 'text-white' : 'text-gray-800'
        }`}>
          {toggleLoading ? 'Loading...' : `INTERESTED ${localVoteData.interested_percentage}%`}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = id ? parseInt(id) : null;
  
  const { event, loading, error, fetchEvent } = useEvent(eventId);
  const { toggleStatus, loading: toggleLoading } = useToggleEventStatus();
  
  // Local state for vote data to avoid full page reload
  const [localVoteData, setLocalVoteData] = React.useState<{
    current_user_vote: 'interested' | 'going' | null;
    interested_percentage: number;
    going_percentage: number;
  } | null>(null);
  
  // Flag to prevent UI updates during vote refetch
  const [isRefetchingVotes, setIsRefetchingVotes] = React.useState(false);
  
  // Update local vote data when event changes (but not during vote refetch)
  React.useEffect(() => {
    if (event && !isRefetchingVotes) {
      const newData = {
        current_user_vote: event.current_user_vote || null,
        interested_percentage: event.interested_percentage || 0,
        going_percentage: event.going_percentage || 0,
      };
      setLocalVoteData(newData);
    }
  }, [event, isRefetchingVotes]);

  const handleToggleStatus = useCallback(async (status: 'interested' | 'going') => {
    if (!eventId) return;
    
    try {
      // Update the status immediately for instant feedback
      setLocalVoteData(prev => prev ? { ...prev, current_user_vote: status } : null);
      
      // Make the API call
      const response = await toggleStatus(eventId, status);
      
      // The API response doesn't include vote counts or percentages
      // We need to refetch the event to get the updated data
      // Set flag to prevent UI updates during refetch
      setIsRefetchingVotes(true);
      
      const updatedEvent = await fetchEvent(eventId);
      
      // Update only the vote data from the refetched event
      if (updatedEvent) {
        const newVoteData = {
          current_user_vote: updatedEvent.current_user_vote || status,
          interested_percentage: updatedEvent.interested_percentage || 0,
          going_percentage: updatedEvent.going_percentage || 0,
        };
        
        setLocalVoteData(newVoteData);
      }
      
      // Clear the flag
      setIsRefetchingVotes(false);
      
    } catch (error) {
      console.error('Failed to toggle event status:', error);
      setIsRefetchingVotes(false);
      
      // Revert the optimistic update on error
      if (event) {
        setLocalVoteData({
          current_user_vote: event.current_user_vote || null,
          interested_percentage: event.interested_percentage || 0,
          going_percentage: event.going_percentage || 0,
        });
      }
    }
  }, [eventId, toggleStatus, event]);


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Loading event details...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-red-500">{error || 'Event not found'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-blue-500">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get banner image from event image
  const getBannerImage = () => {
    if (!event.event_image) {
      return "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
    }
    
    return event.event_image;
  };

  const bannerImageUrl = getBannerImage();

  // Format date and time
  const formatEventDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const startDateTime = formatEventDateTime(event.event_start);
  
  // Calculate end time - if event_end exists, use it, otherwise estimate 3 hours after start
  const getEndTime = () => {
    if ((event as any).event_end) {
      return (event as any).event_end;
    }
    // Estimate 3 hours after start time
    const startDate = new Date(event.event_start);
    const endDate = new Date(startDate.getTime() + (3 * 60 * 60 * 1000)); // Add 3 hours
    return endDate.toISOString();
  };
  
  const endDateTime = formatEventDateTime(getEndTime());

  const artists = [
    {
      id: 1,
      name: "Artist 1",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
    {
      id: 2,
      name: "Artist 2",
      image:
        "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
    },
  ];

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Hero Image with Back Button */}
      <View className="relative">
        <Image
          source={{
            uri: bannerImageUrl,
          }}
          style={{ width: "100%", height: 300 }}
          contentFit="cover"
          placeholder="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
          transition={200}
        />

        {/* Back Button Overlay */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-12 left-5 w-10 h-10 bg-white rounded-full justify-center items-center shadow-lg"
        >
          <IconSymbol name="chevron.left" size={20} color="black" />
        </TouchableOpacity>

        {/* Event Info Card Overlay */}
        <View className="flex justify-center items-center">
        <View className="absolute bottom-[-60px] bg-white rounded-3xl p-6 mt-24 w-[90%]">
          <Text className="text-3xl font-bold text-brand-purple mb-2">
            {event.name}
          </Text>
          <Text className="text-lg text-gray-800 mb-2">
            {event.music_genres && event.music_genres.length > 0 
              ? event.music_genres.join(' • ') 
              : 'Event'}
          </Text>
          <View className="flex-row items-center">
            <IconSymbol name="location" size={16} color="#666" />
            <View className="flex-row items-center ml-1">
              {event.venue_name ? (
                <>
                  <TouchableOpacity 
                    onPress={() => {
                      if (event.venue_id) {
                        router.push(`/venue-detail?id=${event.venue_id}`);
                      } 
                    }}
                    style={{ opacity: 1 }}
                  >
                    <Text className="font-medium text-[#2FCC67] underline">
                      {event.venue_name}
                    </Text>
                  </TouchableOpacity>
                  <Text className="text-gray-500">, {event.city}</Text>
                </>
              ) : (
                <Text className="text-gray-500">{event.city}</Text>
              )}
            </View>
          </View>
        </View>
        </View>
      </View>

      {/* Content */}
      <View className="px-5 pt-6 mt-16">
        {/* Description Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Description
          </Text>
          <Text className="text-gray-600 leading-6">
            {event.description || 'No description available for this event.'}
          </Text>
        </View>

        {/* Location Section
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Location
          </Text>
          <TouchableOpacity>
            <Text className="text-brand-purple text-lg underline">
              {event.address || `${event.city}, ${event.venue_name?.toUpperCase()}`}
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* Date and Time Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-brand-purple mb-3">
            Date & Time
          </Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <View className="mb-3">
              <Text className="text-gray-700 font-medium mb-1">Start</Text>
              <Text className="text-gray-600">{startDateTime.date}</Text>
              <Text className="text-gray-600">{startDateTime.time}</Text>
            </View>
            <View>
              <Text className="text-gray-700 font-medium mb-1">End</Text>
              <Text className="text-gray-600">{endDateTime.date}</Text>
              <Text className="text-gray-600">{endDateTime.time}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons - Separate Memoized Component */}
        <VoteButtons 
          localVoteData={localVoteData}
          toggleLoading={toggleLoading}
          onToggleStatus={handleToggleStatus}
        />

        {/* Artists Section */}
        {/* <HorizontalArtistSlider
          artists={artists}
          title="Artists"
          cardWidth={200}
          cardHeight={150}
        /> */}
      </View>
    </ScrollView>
  );
}
