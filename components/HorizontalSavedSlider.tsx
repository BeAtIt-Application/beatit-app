import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";

export interface SliderCard {
  id: number | string;
  title: string;
  image: string;
  onPress?: () => void;
}

interface HorizontalSavedSliderProps {
  cards: SliderCard[];
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
}

export function HorizontalSavedSlider({
  cards,
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
}: HorizontalSavedSliderProps) {
  const { width: screenWidth } = Dimensions.get('window');
  const defaultCardWidth = cardWidth || screenWidth * 0.55;
  const snapInterval = snapToInterval ? defaultCardWidth + spacing : undefined;

  return (
    <View className="mb-4 pt-8">
      <Text className="pl-5 text-xl font-bold text-[#1A1A2E]">
        Saved
      </Text>      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snapInterval}
        snapToAlignment="start"
        contentContainerStyle={{ paddingRight: spacing }}
      >
        {cards.map((card, index) => (
          <TouchableOpacity
            key={card.id}
            style={{ 
              width: defaultCardWidth,
              marginRight: index < cards.length - 1 ? spacing : 0,
            }}
            className="pl-5 mt-4"
            onPress={card.onPress || (() => console.log('Card pressed:', card.title))}
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
                source={{ uri: card.image }}
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
                  className={`text-${textColor} ${textSize} opacity-${textOpacity}`}
                >
                  {card.title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
