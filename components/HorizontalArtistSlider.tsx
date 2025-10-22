import { Artist } from "@/src/api/userApi";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface HorizontalArtistSliderProps {
  artists: Artist[];
  cardWidth?: number;
  cardHeight?: number;
  blurRadius?: number;
  showGradient?: boolean;
  gradientColors?: readonly [string, string, ...string[]];
  textColor?: string;
  textSize?: string;
  textOpacity?: number;
  spacing?: number;
  snapToInterval?: boolean;
  title?: string;
}

export function HorizontalArtistSlider({
  artists,
  cardWidth,
  cardHeight = 200,
  blurRadius = 10,
  showGradient = true,
  gradientColors = ['transparent', 'rgba(0, 0, 0, 0.7)'] as const,
  textColor = 'white',
  textSize = 'text-base',
  textOpacity = 90,
  spacing = 16,
  snapToInterval = true,
  title = "Featured Artists",
}: HorizontalArtistSliderProps) {
  const { width: screenWidth } = Dimensions.get('window');
  const defaultCardWidth = cardWidth || screenWidth * 0.55;
  const snapInterval = snapToInterval ? defaultCardWidth + spacing : undefined;

  const getArtistDisplayName = (artist: Artist) => {
    const fullName = `${artist.first_name || ''} ${artist.last_name || ''}`.trim();
    return fullName || artist.username || 'Unknown Artist';
  };

  const getArtistImage = (artist: Artist) => {
    return artist.avatar_url || artist.avatar_thumbnail || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
  };

  return (
    <View className="mb-8">
      <Text className="pl-5 text-xl font-bold text-[#1A1A2E]">
        {title}
      </Text>      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        contentContainerStyle={{ paddingRight: spacing }}
      >
        {artists.map((artist, index) => (
          <TouchableOpacity
            key={artist.id}
            style={{ 
              width: defaultCardWidth,
              marginRight: index < artists.length - 1 ? spacing : 0,
            }}
            className="mt-4"
            onPress={() => router.push(`/user-detail?id=${artist.id}`)}
          >
            <View 
              className="relative rounded-2xl overflow-hidden" 
              style={{ 
                height: cardHeight, 
                width: defaultCardWidth 
              }}
            >
              {/* Background Image */}
              <Image
                source={{ uri: getArtistImage(artist) }}
                style={{ width: '100%', height: '100%' }}
                contentFit="cover"
                blurRadius={blurRadius}
              />
              
              {/* Gradient Overlay */}
              {showGradient && (
                <LinearGradient
                  colors={gradientColors}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              )}
              
              {/* Content */}
              <View className="absolute inset-0 justify-end p-6">
                <Text 
                  className={`text-${textColor} ${textSize} font-semibold opacity-${textOpacity}`}
                >
                  {getArtistDisplayName(artist)}
                </Text>
                {artist.artist_tag && (
                  <Text 
                    className={`text-${textColor} text-sm opacity-70 mt-1`}
                  >
                    {artist.artist_tag}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

